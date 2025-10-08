import { expressionSymbols } from "../types/nodeTypes";

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
 * Find all rule groups connected to the initial node
 */
const findConnectedRuleGroups = (
  initialNodeId: string,
  nodes: any[],
  edges: any[]
): any[] => {
  const connectedRuleGroups: any[] = [];

  // Find edges from initial node
  const initialEdges = edges.filter((edge) => edge.source === initialNodeId);

  for (const edge of initialEdges) {
    const targetNode = nodes.find((node) => node.id === edge.target);
    if (targetNode && targetNode.type === "ruleName") {
      // Find the parent rule group
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
    // Find the rule name node within this group
    const ruleNameNode = nodes.find(
      (node) => node.type === "ruleName" && node.parentId === ruleGroup.id
    );

    if (!ruleNameNode) {
      console.warn(`No RuleName node found for group ${ruleGroup.id}`);
      return null;
    }

    // Get rule name from the node's data or from the component's state
    const ruleName =
      ruleNameNode.data?.ruleName || ruleNameNode.data?.value || "UnnamedRule";
    if (!ruleName || ruleName.trim() === "") {
      console.warn(`Rule name is empty for group ${ruleGroup.id}`);
      return null;
    }

    // Find all condition nodes within this group
    const conditionNodes = nodes.filter(
      (node) => node.type === "condition" && node.parentId === ruleGroup.id
    );

    if (conditionNodes.length === 0) {
      console.warn(`No condition nodes found for rule ${ruleName}`);
      return null;
    }

    // Find conditional operator nodes connected to this group
    const conditionalOperatorNodes = findConditionalOperatorsForGroup(
      ruleGroup.id,
      nodes,
      edges
    );

    // Generate expression from conditions and operators
    const expression = generateExpression(
      conditionNodes,
      conditionalOperatorNodes
    );

    // Find action group connected to this rule
    const actionGroup = findConnectedActionGroup(ruleGroup.id, nodes, edges);

    let actions = {};
    if (actionGroup) {
      actions = generateActionsFromGroup(actionGroup, nodes);
    }

    return {
      RuleName: ruleName,
      Expression: expression,
      Actions: actions,
      SuccessEvent: "IndividualTarget", // Default success event
    };
  } catch (error) {
    console.error(`Error generating rule for group ${ruleGroup.id}:`, error);
    return null;
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

  // Find edges from the rule group to conditional operators
  const groupEdges = edges.filter((edge) => edge.source === ruleGroupId);

  for (const edge of groupEdges) {
    const targetNode = nodes.find((node) => node.id === edge.target);
    if (targetNode && targetNode.type === "conditionalOperator") {
      conditionalOperators.push(targetNode);
    }
  }

  // Also check for conditional operators that are children of the rule group
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
  conditionalOperatorNodes: any[]
): string => {
  if (conditionNodes.length === 0) {
    return "";
  }

  // Sort condition nodes by position or creation order
  const sortedConditions = conditionNodes.sort((a, b) => {
    return (a.position?.y || 0) - (b.position?.y || 0);
  });

  // Build expression parts
  const expressionParts: string[] = [];

  for (let i = 0; i < sortedConditions.length; i++) {
    const condition = sortedConditions[i];
    const conditionExpression = generateConditionExpression(condition);

    if (conditionExpression) {
      expressionParts.push(conditionExpression);
    }

    // Add operator between conditions (except for the last one)
    if (i < sortedConditions.length - 1) {
      const operator = getOperatorForConditions(conditionalOperatorNodes);
      if (operator) {
        expressionParts.push(operator);
      }
    }
  }

  return expressionParts.join(" ");
};

/**
 * Generate expression for a single condition node
 */
const generateConditionExpression = (conditionNode: any): string => {
  const data = conditionNode.data || {};
  const table = data.table || data.selectedTable || "";
  const field = data.field || data.selectedField || "";
  const expression = data.expression || data.selectedExpression || "";
  const value = data.value || data.inputValue || "";

  if (!table || !field || !expression || !value) {
    console.warn(
      `Incomplete condition data for node ${conditionNode.id}:`,
      data
    );
    return "";
  }

  // Map expression symbol based on field type
  const fieldType = getFieldType(table, field);
  const symbol = getExpressionSymbol(expression, fieldType);

  return `${table}.${field} ${symbol} ${formatValue(value, fieldType)}`;
};

/**
 * Get field type from table schema
 */
const getFieldType = (table: string, field: string): string => {
  // This would typically come from your table schema
  // For now, we'll use a simple mapping
  const typeMap: Record<string, Record<string, string>> = {
    metrics: {
      TargetAchievement: "numeric",
      WorkingHours: "numeric",
      SalesAmount: "numeric",
    },
    user: {
      Position: "varchar",
      Department: "varchar",
      Designation: "varchar",
    },
    sales: {
      Amount: "numeric",
    },
    orders: {
      product_id: "numeric",
    },
    attendance: {
      WorkingHours: "numeric",
      Date: "date",
    },
  };

  return typeMap[table]?.[field] || "varchar";
};

/**
 * Get expression symbol based on expression type and field type
 */
const getExpressionSymbol = (expression: string, fieldType: string): string => {
  const symbols = expressionSymbols[fieldType] || expressionSymbols.varchar;

  // Find the symbol object that matches the expression label
  const symbolObj = symbols.find((symbol) => symbol.label === expression);

  if (symbolObj) {
    return symbolObj.value;
  }

  // Fallback: try to find by value if it's already a symbol
  const symbolByValue = symbols.find((symbol) => symbol.value === expression);
  if (symbolByValue) {
    return symbolByValue.value;
  }

  // Default fallback
  return "==";
};

/**
 * Format value based on field type
 */
const formatValue = (value: string, fieldType: string): string => {
  if (fieldType === "varchar") {
    return `"${value}"`;
  } else if (fieldType === "date") {
    return `"${value}"`;
  } else {
    return value; // numeric values don't need quotes
  }
};

/**
 * Get operator for conditions
 */
const getOperatorForConditions = (conditionalOperatorNodes: any[]): string => {
  // Find the operator from conditional operator nodes
  if (conditionalOperatorNodes.length > 0) {
    const operator =
      conditionalOperatorNodes[0].data?.operator ||
      conditionalOperatorNodes[0].data?.selectedOperator ||
      "AND";
    return operator.toUpperCase();
  }
  return "AND"; // Default operator
};

/**
 * Find action group connected to a rule group
 */
const findConnectedActionGroup = (
  ruleGroupId: string,
  nodes: any[],
  edges: any[]
): any => {
  // First, try to find action groups that are children of the rule group
  const childActionGroups = nodes.filter(
    (node) =>
      node.type === "resizableGroup" &&
      node.parentId === ruleGroupId &&
      node.data?.label === "Action Group"
  );

  if (childActionGroups.length > 0) {
    return childActionGroups[0]; // Return the first action group found
  }

  // Fallback: Find action groups connected via edges (for future compatibility)
  const ruleEdges = edges.filter((edge) => edge.source === ruleGroupId);

  for (const edge of ruleEdges) {
    const targetNode = nodes.find((node) => node.id === edge.target);
    if (targetNode && targetNode.type === "conditionalOperator") {
      // Find edges from conditional operator to action groups
      const operatorEdges = edges.filter((e) => e.source === targetNode.id);

      for (const operatorEdge of operatorEdges) {
        const actionTargetNode = nodes.find(
          (node) => node.id === operatorEdge.target
        );
        if (actionTargetNode && actionTargetNode.type === "actionName") {
          // Find the parent action group
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
  // Find all action name nodes within this action group
  const actionNameNodes = nodes.filter(
    (node) => node.type === "actionName" && node.parentId === actionGroup.id
  );

  if (actionNameNodes.length === 0) {
    console.warn(`No ActionName nodes found for group ${actionGroup.id}`);
    return {};
  }

  const actions: Record<string, any> = {};

  // Process each action name node
  actionNameNodes.forEach((actionNameNode: any) => {
    const data = actionNameNode.data || {};
    const actionType =
      data.actionType || data.selectedActionType || "OnSuccess";
    const actionName =
      data.actionName || data.inputActionName || "DefaultAction";

    // Find condition nodes connected to this action
    const conditionNodes = findConditionNodesForAction(
      actionNameNode.id,
      nodes
    );

    // Generate expression from condition nodes
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
  // Find all condition nodes within the same action group
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
    .map((conditionNode) => {
      return generateConditionExpression(conditionNode);
    })
    .filter(Boolean);

  return expressionParts.join(" AND ");
};
