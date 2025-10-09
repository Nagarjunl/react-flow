import { expressionSymbols } from "../types/nodeTypes";
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
      nodes,
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

    const actionGroup = findConnectedActionGroup(ruleGroup.id, nodes, edges);
    let actions = {};
    if (actionGroup) {
      actions = generateActionsFromGroup(actionGroup, nodes);
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
  nodes: any[],
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
 * Generate expression from condition nodes and operators
 */
const generateExpression = (
  conditionNodes: any[],
  conditionalOperatorNodes: any[],
  edges: any[]
): string => {
  if (conditionNodes.length === 1 && conditionalOperatorNodes.length === 0) {
    return generateConditionExpression(conditionNodes[0]);
  }

  const allNodes = [...conditionNodes, ...conditionalOperatorNodes];
  const processedNodes = new Set<string>();

  // Find starting nodes (conditions with no incoming edges)
  const startingConditions = conditionNodes.filter((node) => {
    const incomers = getIncomers(node, allNodes, edges);
    return incomers.length === 0;
  });

  if (startingConditions.length === 0) {
    throw new Error("No starting conditions found in the rule group");
  }

  const expressions = startingConditions
    .map((cond) =>
      buildExpressionFromFlow(cond, allNodes, edges, processedNodes)
    )
    .filter(Boolean);

  return expressions.join(" AND "); // Default join for multiple starting points
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
 * Find action group connected to a rule group
 */
const findConnectedActionGroup = (
  ruleGroupId: string,
  nodes: any[],
  edges: any[]
): any => {
  const childActionGroups = nodes.filter(
    (node) =>
      node.type === "resizableGroup" &&
      node.parentId === ruleGroupId &&
      node.data?.label === "Action Group"
  );

  if (childActionGroups.length > 0) {
    return childActionGroups[0];
  }

  const ruleGroupNode = nodes.find((node) => node.id === ruleGroupId);
  if (!ruleGroupNode) return null;

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
          if (actionGroup) {
            return actionGroup;
          }
        }
      }
    }
  }

  return null;
};

/**
 * Generate actions from an action group
 */
const generateActionsFromGroup = (
  actionGroup: any,
  nodes: any[]
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
    const conditionExpression =
      generateActionConditionExpression(conditionNodes);

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
  nodes: any[]
): any[] => {
  const actionGroupId = nodes.find(
    (node) => node.id === actionNodeId
  )?.parentId;
  return nodes.filter(
    (node) => node.type === "condition" && node.parentId === actionGroupId
  );
};

/**
 * Generate expression for action conditions
 */
const generateActionConditionExpression = (conditionNodes: any[]): string => {
  if (conditionNodes.length === 0) {
    return "";
  }

  const expressionParts = conditionNodes
    .map((conditionNode) => generateConditionExpression(conditionNode))
    .filter(Boolean);

  return expressionParts.join(" AND ");
};
