import { getIncomers, getOutgoers } from "@xyflow/react";

/**
 * Generate JSON configuration from React Flow nodes and edges
 */
export const generateRuleEngineJson = (nodes: any[], edges: any[]): any => {
  try {
    // Find the initial node
    const initialNode = nodes.find((node) => node.type === "initial");
    if (!initialNode) {
      throw new Error(
        "No Initial Node found. Please add an Initial Node first."
      );
    }

    const workflowName = initialNode.data?.workflowName || "UnnamedWorkflow";
    const description = initialNode.data?.description || "";
    if (!workflowName || workflowName.trim() === "") {
      throw new Error("Workflow Name is required in Initial Node.");
    }

    // Find all rule groups connected to the initial node
    const ruleGroups = findConnectedRuleGroups(initialNode.id, nodes, edges);

    if (ruleGroups.length === 0) {
      throw new Error(
        "No Rule Groups found. Please add and connect Rule Groups to the Initial Node."
      );
    }

    // Generate rules array
    const rules = ruleGroups
      .map((ruleGroup) => {
        return generateRuleFromGroup(ruleGroup, nodes, edges);
      })
      .filter((rule) => rule !== null);

    if (rules.length === 0) {
      throw new Error(
        "No valid rules found. Please ensure all Rule Groups have proper connections and data."
      );
    }

    return {
      WorkflowName: workflowName,
      Description: description,
      Rules: rules,
    };
  } catch (error) {
    console.error("Error generating JSON:", error);
    throw error;
  }
};

/**
 * Find all rule groups connected to the initial node using React Flow native functions
 */
const findConnectedRuleGroups = (
  initialNodeId: string,
  nodes: any[],
  edges: any[]
): any[] => {
  const connectedRuleGroups: any[] = [];

  const initialNode = nodes.find((node) => node.id === initialNodeId);
  if (!initialNode) return connectedRuleGroups;

  const outgoers = getOutgoers(initialNode, nodes, edges);

  for (const targetNode of outgoers) {
    if (targetNode.type === "ruleName") {
      const ruleGroup = nodes.find(
        (node) =>
          node.type === "resizableGroup" && node.id === targetNode.parentId
      );
      if (ruleGroup) {
        connectedRuleGroups.push(ruleGroup);
      }
    }
  }

  return connectedRuleGroups;
};

/**
 * Generate a single rule from a rule group
 */
const generateRuleFromGroup = (
  ruleGroup: any,
  nodes: any[],
  edges: any[]
): any => {
  try {
    const ruleNameNode = nodes.find(
      (node) => node.type === "ruleName" && node.parentId === ruleGroup.id
    );

    if (!ruleNameNode) {
      console.warn(`No RuleName node found for group ${ruleGroup.id}`);
      return null;
    }

    const ruleName =
      ruleNameNode.data?.ruleName || ruleNameNode.data?.value || "UnnamedRule";
    if (!ruleName || ruleName.trim() === "") {
      console.warn(`Rule name is empty for group ${ruleGroup.id}`);
      return null;
    }

    const conditionNodes = nodes.filter(
      (node) => node.type === "condition" && node.parentId === ruleGroup.id
    );

    if (conditionNodes.length === 0) {
      throw new Error(
        `No condition nodes found for rule ${ruleName} in group ${ruleGroup.id}`
      );
    }

    const conditionalOperatorNodes = findConditionalOperatorsForGroup(
      ruleGroup.id,
      nodes,
      edges
    );

    // Validate graph structure
    validateRuleGroupStructure(
      ruleGroup.id,
      edges,
      conditionNodes,
      conditionalOperatorNodes
    );

    // Generate expression based on valid structure
    const expression = generateExpression(
      conditionNodes,
      conditionalOperatorNodes,
      edges
    );

    const actionGroups = findConnectedActionGroups(ruleGroup.id, nodes, edges);

    let actions = {};
    if (actionGroups.length > 0) {
      // Merge actions from all action groups
      actionGroups.forEach((actionGroup) => {
        const groupActions = generateActionsFromGroup(
          actionGroup,
          nodes,
          edges
        );
        actions = { ...actions, ...groupActions };
      });
    }

    return {
      RuleName: ruleName,
      Expression: expression,
      Actions: actions,
      SuccessEvent: "IndividualTarget",
    };
  } catch (error) {
    console.error(`Error generating rule for group ${ruleGroup.id}:`, error);
    throw error;
  }
};

/**
 * Validate the structure of a rule group
 */
const validateRuleGroupStructure = (
  ruleGroupId: string,
  edges: any[],
  conditionNodes: any[],
  conditionalOperatorNodes: any[]
): void => {
  const allNodes = [...conditionNodes, ...conditionalOperatorNodes];
  const processedNodes = new Set<string>();
  const visited = new Set<string>();

  // Check for cycles and disconnected nodes using DFS
  const checkNode = (nodeId: string) => {
    if (visited.has(nodeId)) {
      if (processedNodes.has(nodeId)) return; // Back edge, cycle detected
      throw new Error(
        `Cycle detected in rule group ${ruleGroupId} at node ${nodeId}`
      );
    }
    visited.add(nodeId);
    processedNodes.add(nodeId);

    const node = allNodes.find((n) => n.id === nodeId);
    if (!node) return;

    const outgoers = getOutgoers(node, allNodes, edges);
    for (const outgoer of outgoers) {
      checkNode(outgoer.id);
    }

    const incomers = getIncomers(node, allNodes, edges);
    if (node.type === "conditionalOperator" && incomers.length < 1) {
      throw new Error(
        `Operator at ID ${node.id} in rule group ${ruleGroupId} has no incoming conditions`
      );
    }
    if (node.type === "conditionalOperator" && incomers.length === 1) {
      const outgoerConditions = getOutgoers(node, allNodes, edges).filter(
        (n) => n.type === "condition"
      );
      if (outgoerConditions.length === 0) {
        throw new Error(
          `Operator at ID ${node.id} in rule group ${ruleGroupId} has only one condition and no further connections`
        );
      }
    }
  };

  // Start DFS from each condition node
  for (const condition of conditionNodes) {
    if (!processedNodes.has(condition.id)) {
      checkNode(condition.id);
    }
  }

  // Check for unprocessed nodes (disconnected)
  const groupNodes = allNodes.filter((n) => n.parentId === ruleGroupId);
  for (const node of groupNodes) {
    if (!processedNodes.has(node.id)) {
      throw new Error(
        `Disconnected node ${node.id} found in rule group ${ruleGroupId}`
      );
    }
  }
};

/**
 * Find conditional operator nodes connected to a rule group
 */
const findConditionalOperatorsForGroup = (
  ruleGroupId: string,
  nodes: any[],
  edges: any[]
): any[] => {
  const conditionalOperators: any[] = [];

  const ruleGroupNode = nodes.find((node) => node.id === ruleGroupId);
  if (!ruleGroupNode) return conditionalOperators;

  const outgoers = getOutgoers(ruleGroupNode, nodes, edges);
  const connectedOperators = outgoers.filter(
    (node) => node.type === "conditionalOperator"
  );
  conditionalOperators.push(...connectedOperators);

  const childConditionalOperators = nodes.filter(
    (node) =>
      node.type === "conditionalOperator" && node.parentId === ruleGroupId
  );
  if (childConditionalOperators.length > 0) {
    conditionalOperators.push(...childConditionalOperators);
  }

  return conditionalOperators;
};

/**
 * Generate expression from condition nodes and operators using new complex grouping logic
 */
const generateExpression = (
  conditionNodes: any[],
  conditionalOperatorNodes: any[],
  edges: any[]
): string => {
  if (conditionNodes.length === 1 && conditionalOperatorNodes.length === 0) {
    return generateConditionExpression(conditionNodes[0]);
  }

  // Detect valid groups using the new grouping logic
  const validGroups = detectValidGroupsForGeneration(
    conditionNodes,
    conditionalOperatorNodes,
    edges
  );

  if (validGroups.length === 0) {
    throw new Error("No valid groups found in the rule group");
  }

  // Generate expressions for each valid group
  const groupExpressions = validGroups.map((group) =>
    generateGroupExpression(group, edges)
  );

  // Apply dynamic operator between groups
  if (groupExpressions.length === 2) {
    const connectingOperator = findConnectingOperatorInGeneration(
      validGroups,
      conditionalOperatorNodes,
      edges
    );

    if (connectingOperator) {
      // Use the operator value from the operator node
      const operatorValue = connectingOperator.data?.operator || "AND";
      return `(${groupExpressions[0]}) ${operatorValue} (${groupExpressions[1]})`;
    } else {
      // Apply default AND operator when no connecting operator exists
      return `(${groupExpressions[0]}) AND (${groupExpressions[1]})`;
    }
  }

  // If more than 2 groups or explicit operators exist, use the original logic
  return groupExpressions.join(" AND ");
};

/**
 * Build expression from flow
 */
const buildExpressionFromFlow = (
  startNode: any,
  allNodes: any[],
  edges: any[],
  processedNodes: Set<string>
): string => {
  if (processedNodes.has(startNode.id)) return "";

  processedNodes.add(startNode.id);

  if (startNode.type === "condition") {
    let expression = generateConditionExpression(startNode);

    const outgoers = getOutgoers(startNode, allNodes, edges);
    const operatorNode = outgoers.find(
      (node) =>
        node.type === "conditionalOperator" && !processedNodes.has(node.id)
    );

    if (operatorNode) {
      expression = processOperatorWithNestedLogic(
        operatorNode,
        allNodes,
        edges,
        processedNodes,
        expression
      );
    }

    return expression;
  } else if (startNode.type === "conditionalOperator") {
    return processOperatorWithNestedLogic(
      startNode,
      allNodes,
      edges,
      processedNodes
    );
  }

  return "";
};

/**
 * Process operator with nested logic handling
 */
const processOperatorWithNestedLogic = (
  operatorNode: any,
  allNodes: any[],
  edges: any[],
  processedNodes: Set<string>,
  leftExpression: string | null = null
): string => {
  if (processedNodes.has(operatorNode.id)) return "";

  const operator = operatorNode.data?.operator || "AND";
  processedNodes.add(operatorNode.id);

  const incomers = getIncomers(operatorNode, allNodes, edges);
  const subInputs = incomers.filter((node) => !processedNodes.has(node.id));

  let subExpressions = subInputs
    .map((node) =>
      buildExpressionFromFlow(node, allNodes, edges, processedNodes)
    )
    .filter(Boolean);

  const conditionOutputs = getOutgoers(operatorNode, allNodes, edges).filter(
    (node) => node.type === "condition" && !processedNodes.has(node.id)
  );

  const outputExpressions = conditionOutputs
    .map((node) =>
      buildExpressionFromFlow(node, allNodes, edges, processedNodes)
    )
    .filter(Boolean);

  subExpressions = [...subExpressions, ...outputExpressions];

  if (leftExpression) {
    subExpressions.unshift(leftExpression);
  }

  let currentExpression: string;
  if (subExpressions.length === 0) {
    throw new Error(
      `Operator at ID ${operatorNode.id} has no conditions to combine`
    );
  } else if (subExpressions.length === 1) {
    currentExpression = subExpressions[0];
  } else {
    currentExpression = `(${subExpressions.join(` ${operator} `)})`;
  }

  const nextOutgoers = getOutgoers(operatorNode, allNodes, edges);
  const nextOperator = nextOutgoers.find(
    (node) =>
      node.type === "conditionalOperator" && !processedNodes.has(node.id)
  );

  if (nextOperator) {
    return processOperatorWithNestedLogic(
      nextOperator,
      allNodes,
      edges,
      processedNodes,
      currentExpression
    );
  }

  return currentExpression;
};

/**
 * Generate expression for a single condition node
 */
const generateConditionExpression = (conditionNode: any): string => {
  const data = conditionNode.data || {};
  const table = data.selectedTable || "";
  const field = data.selectedField || "";
  const expression = data.expression || "";
  const value = data.value || "";

  if (!table || !field || !expression || !value) {
    console.warn(
      `Incomplete condition data for node ${conditionNode.id}:`,
      data
    );
    return "";
  }

  return `${table}.${field} ${expression} "${value}"`;
};

/**
 * Find all action groups connected to a rule group
 */
const findConnectedActionGroups = (
  ruleGroupId: string,
  nodes: any[],
  edges: any[]
): any[] => {
  const actionGroups: any[] = [];

  // Find child action groups (direct children)
  const childActionGroups = nodes.filter(
    (node) =>
      node.type === "resizableGroup" &&
      node.parentId === ruleGroupId &&
      node.data?.label === "Action Group"
  );

  actionGroups.push(...childActionGroups);

  // Find connected action groups through operators
  const ruleGroupNode = nodes.find((node) => node.id === ruleGroupId);
  if (!ruleGroupNode) return actionGroups;

  const outgoers = getOutgoers(ruleGroupNode, nodes, edges);

  for (const targetNode of outgoers) {
    if (targetNode.type === "conditionalOperator") {
      const operatorOutgoers = getOutgoers(targetNode, nodes, edges);
      for (const actionTargetNode of operatorOutgoers) {
        if (actionTargetNode.type === "actionName") {
          const actionGroup = nodes.find(
            (node) =>
              node.type === "resizableGroup" &&
              node.id === actionTargetNode.parentId
          );
          if (
            actionGroup &&
            !actionGroups.some((ag) => ag.id === actionGroup.id)
          ) {
            actionGroups.push(actionGroup);
          }
        }
      }
    }
  }

  return actionGroups;
};

/**
 * Generate actions from an action group using new grouping logic
 */
const generateActionsFromGroup = (
  actionGroup: any,
  nodes: any[],
  edges: any[]
): Record<string, any> => {
  const actionNameNodes = nodes.filter(
    (node) => node.type === "actionName" && node.parentId === actionGroup.id
  );

  if (actionNameNodes.length === 0) {
    console.warn(`No ActionName nodes found for group ${actionGroup.id}`);
    return {};
  }

  const actions: Record<string, any> = {};

  actionNameNodes.forEach((actionNameNode: any) => {
    const data = actionNameNode.data || {};
    const actionType =
      data.actionType || data.selectedActionType || "OnSuccess";
    const actionName =
      data.actionName || data.inputActionName || "DefaultAction";

    const conditionNodes = findConditionNodesForAction(
      actionNameNode.id,
      nodes
    );

    // Find conditional operators within the action group
    const conditionalOperatorNodes = nodes.filter(
      (node) =>
        node.type === "conditionalOperator" && node.parentId === actionGroup.id
    );

    // Use the same expression generation logic as main rule groups
    const conditionExpression = generateExpression(
      conditionNodes,
      conditionalOperatorNodes,
      edges
    );

    actions[actionType] = {
      Name: actionName,
      Context: {
        Expression: conditionExpression || `context.${actionName}`,
      },
    };
  });

  return actions;
};

/**
 * Find condition nodes connected to an action
 */
const findConditionNodesForAction = (
  actionNodeId: string,
  allNodes: any[]
): any[] => {
  const actionGroupId = allNodes.find(
    (node) => node.id === actionNodeId
  )?.parentId;
  return allNodes.filter(
    (node) => node.type === "condition" && node.parentId === actionGroupId
  );
};

// ============================================================================
// NEW GROUPING LOGIC FUNCTIONS FOR JSON GENERATION
// ============================================================================

/**
 * Detect valid groups for JSON generation using the new grouping logic
 */
const detectValidGroupsForGeneration = (
  conditionNodes: any[],
  conditionalOperatorNodes: any[],
  edges: any[]
): GenerationGroup[] => {
  const groups: GenerationGroup[] = [];
  const processedNodes = new Set<string>();

  // Find starting conditions (no incoming edges)
  const startingConditions = conditionNodes.filter((node) => {
    const incomers = getIncomers(
      node,
      [...conditionNodes, ...conditionalOperatorNodes],
      edges
    );
    return incomers.length === 0;
  });

  // Build groups from starting conditions
  for (const condition of startingConditions) {
    if (!processedNodes.has(condition.id)) {
      const group = buildGroupFromConditionForGeneration(
        condition,
        conditionNodes,
        conditionalOperatorNodes,
        edges,
        processedNodes
      );
      if (group) {
        groups.push(group);
      }
    }
  }

  return groups;
};

/**
 * Build group from condition for JSON generation
 */
const buildGroupFromConditionForGeneration = (
  startCondition: any,
  conditionNodes: any[],
  conditionalOperatorNodes: any[],
  edges: any[],
  processedNodes: Set<string>
): GenerationGroup | null => {
  const groupNodes: any[] = [startCondition];
  processedNodes.add(startCondition.id);

  // Follow the flow to build the group
  let currentNode = startCondition;
  while (true) {
    const outgoers = getOutgoers(
      currentNode,
      [...conditionNodes, ...conditionalOperatorNodes],
      edges
    );
    const operatorNode = outgoers.find(
      (node) =>
        node.type === "conditionalOperator" && !processedNodes.has(node.id)
    );

    if (operatorNode) {
      groupNodes.push(operatorNode);
      processedNodes.add(operatorNode.id);

      // Check if this operator has multiple inputs (fan-in pattern)
      const incomers = getIncomers(
        operatorNode,
        [...conditionNodes, ...conditionalOperatorNodes],
        edges
      );
      const conditionInputs = incomers.filter(
        (node) => node.type === "condition"
      );

      if (conditionInputs.length >= 2) {
        // Valid fan-in pattern
        groupNodes.push(...conditionInputs);
        conditionInputs.forEach((node) => processedNodes.add(node.id));
      }

      // Continue to next operator if exists
      const nextOutgoers = getOutgoers(
        operatorNode,
        [...conditionNodes, ...conditionalOperatorNodes],
        edges
      );
      const nextOperator = nextOutgoers.find(
        (node) =>
          node.type === "conditionalOperator" && !processedNodes.has(node.id)
      );

      if (nextOperator) {
        currentNode = nextOperator;
      } else {
        break;
      }
    } else {
      break;
    }
  }

  // Validate the group has at least 2 effective operands
  const isValid = validateGroupForGeneration(groupNodes, edges);

  return {
    id: `group_${startCondition.id}`,
    nodes: groupNodes,
    isValid: isValid.isValid,
    reason: isValid.reason,
  };
};

/**
 * Validate a group for JSON generation
 */
const validateGroupForGeneration = (
  groupNodes: any[],
  edges: any[]
): { isValid: boolean; reason?: string } => {
  const operators = groupNodes.filter(
    (node) => node.type === "conditionalOperator"
  );

  // Check if group has at least 2 effective operands
  for (const operator of operators) {
    const incomers = getIncomers(operator, groupNodes, edges);
    const outgoers = getOutgoers(operator, groupNodes, edges);
    const effectiveOperands = incomers.length + outgoers.length;

    if (effectiveOperands < 2) {
      return {
        isValid: false,
        reason: `Operator ${operator.id} has fewer than 2 effective operands`,
      };
    }
  }

  return { isValid: true };
};

/**
 * Generate expression for a single group
 */
const generateGroupExpression = (
  group: GenerationGroup,
  edges: any[]
): string => {
  if (!group.isValid) {
    throw new Error(`Invalid group: ${group.reason}`);
  }

  const processedNodes = new Set<string>();
  const expressions: string[] = [];

  // Find starting conditions in this group
  const startingConditions = group.nodes.filter((node) => {
    if (node.type !== "condition") return false;
    const incomers = getIncomers(node, group.nodes, edges);
    return incomers.length === 0;
  });

  // Build expressions from each starting condition
  for (const condition of startingConditions) {
    if (!processedNodes.has(condition.id)) {
      const expression = buildExpressionFromFlowForGroup(
        condition,
        group.nodes,
        edges,
        processedNodes
      );
      if (expression) {
        expressions.push(expression);
      }
    }
  }

  if (expressions.length === 1) {
    return expressions[0];
  } else if (expressions.length > 1) {
    return `(${expressions.join(" AND ")})`;
  }

  return "";
};

/**
 * Build expression from flow for a specific group
 */
const buildExpressionFromFlowForGroup = (
  startNode: any,
  groupNodes: any[],
  edges: any[],
  processedNodes: Set<string>
): string => {
  if (processedNodes.has(startNode.id)) return "";

  processedNodes.add(startNode.id);

  if (startNode.type === "condition") {
    let expression = generateConditionExpression(startNode);

    const outgoers = getOutgoers(startNode, groupNodes, edges);
    const operatorNode = outgoers.find(
      (node) =>
        node.type === "conditionalOperator" && !processedNodes.has(node.id)
    );

    if (operatorNode) {
      expression = processOperatorWithNestedLogicForGroup(
        operatorNode,
        groupNodes,
        edges,
        processedNodes,
        expression
      );
    }

    return expression;
  } else if (startNode.type === "conditionalOperator") {
    return processOperatorWithNestedLogicForGroup(
      startNode,
      groupNodes,
      edges,
      processedNodes
    );
  }

  return "";
};

/**
 * Process operator with nested logic handling for a specific group
 */
const processOperatorWithNestedLogicForGroup = (
  operatorNode: any,
  groupNodes: any[],
  edges: any[],
  processedNodes: Set<string>,
  leftExpression: string | null = null
): string => {
  if (processedNodes.has(operatorNode.id)) return "";

  const operator = operatorNode.data?.operator || "AND";
  processedNodes.add(operatorNode.id);

  const incomers = getIncomers(operatorNode, groupNodes, edges);
  const subInputs = incomers.filter((node) => !processedNodes.has(node.id));

  let subExpressions = subInputs
    .map((node) =>
      buildExpressionFromFlowForGroup(node, groupNodes, edges, processedNodes)
    )
    .filter(Boolean);

  const conditionOutputs = getOutgoers(operatorNode, groupNodes, edges).filter(
    (node) => node.type === "condition" && !processedNodes.has(node.id)
  );

  const outputExpressions = conditionOutputs
    .map((node) =>
      buildExpressionFromFlowForGroup(node, groupNodes, edges, processedNodes)
    )
    .filter(Boolean);

  subExpressions = [...subExpressions, ...outputExpressions];

  if (leftExpression) {
    subExpressions.unshift(leftExpression);
  }

  let currentExpression: string;
  if (subExpressions.length === 0) {
    throw new Error(
      `Operator at ID ${operatorNode.id} has no conditions to combine`
    );
  } else if (subExpressions.length === 1) {
    currentExpression = subExpressions[0];
  } else {
    currentExpression = `(${subExpressions.join(` ${operator} `)})`;
  }

  const nextOutgoers = getOutgoers(operatorNode, groupNodes, edges);
  const nextOperator = nextOutgoers.find(
    (node) =>
      node.type === "conditionalOperator" && !processedNodes.has(node.id)
  );

  if (nextOperator) {
    return processOperatorWithNestedLogicForGroup(
      nextOperator,
      groupNodes,
      edges,
      processedNodes,
      currentExpression
    );
  }

  return currentExpression;
};

/**
 * Find connecting operator between groups in generation
 */
const findConnectingOperatorInGeneration = (
  groups: GenerationGroup[],
  operatorNodes: any[],
  edges: any[]
): any | null => {
  // Check if there's an operator that connects the outputs of multiple groups
  for (const operator of operatorNodes) {
    const incomers = getIncomers(operator, operatorNodes, edges);
    if (incomers.length >= 2) {
      // Check if these incomers are from different groups
      const groupIds = new Set();
      for (const incomer of incomers) {
        const group = groups.find((g) =>
          g.nodes.some((n) => n.id === incomer.id)
        );
        if (group) {
          groupIds.add(group.id);
        }
      }
      if (groupIds.size >= 2) {
        return operator;
      }
    }
  }
  return null;
};

// Helper interface for generation grouping logic
interface GenerationGroup {
  id: string;
  nodes: any[];
  isValid: boolean;
  reason?: string;
}
