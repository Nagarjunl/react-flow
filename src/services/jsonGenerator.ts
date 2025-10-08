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

  // Find the initial node
  const initialNode = nodes.find((node) => node.id === initialNodeId);
  if (!initialNode) return connectedRuleGroups;

  // Get all outgoing nodes using React Flow native function
  const outgoers = getOutgoers(initialNode, nodes, edges);

  for (const targetNode of outgoers) {
    if (targetNode.type === "ruleName") {
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
      conditionalOperatorNodes,
      edges
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
 * Find conditional operator nodes connected to a rule group using React Flow native functions
 */
const findConditionalOperatorsForGroup = (
  ruleGroupId: string,
  nodes: any[],
  edges: any[]
): any[] => {
  const conditionalOperators: any[] = [];

  // Find the rule group node
  const ruleGroupNode = nodes.find((node) => node.id === ruleGroupId);
  if (!ruleGroupNode) return conditionalOperators;

  // Get all outgoing nodes using React Flow native function
  const outgoers = getOutgoers(ruleGroupNode, nodes, edges);

  // Filter for conditional operator nodes
  const connectedOperators = outgoers.filter(
    (node) => node.type === "conditionalOperator"
  );

  conditionalOperators.push(...connectedOperators);

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
 * Generate expression from condition nodes and operators following edge connections
 */
const generateExpression = (
  conditionNodes: any[],
  conditionalOperatorNodes: any[],
  edges: any[]
): string => {
  if (conditionNodes.length === 0) {
    return "";
  }

  // Build a flow graph by following edge connections
  const flowGraph = buildFlowGraph(
    conditionNodes,
    conditionalOperatorNodes,
    edges
  );

  // Generate expression by traversing the flow graph
  const expressionParts = traverseFlowGraph(flowGraph);

  return expressionParts.join(" ");
};

/**
 * Build a flow graph from nodes and edges using React Flow native functions
 */
const buildFlowGraph = (
  conditionNodes: any[],
  conditionalOperatorNodes: any[],
  edges: any[]
) => {
  const graph: any[] = [];
  const allNodes = [...conditionNodes, ...conditionalOperatorNodes];
  const visited = new Set();

  // Find starting nodes (nodes with no incoming edges) using React Flow native function
  const startingNodes = allNodes.filter((node) => {
    const incomers = getIncomers(node, allNodes, edges);
    return incomers.length === 0;
  });

  // Build graph by following edges using React Flow native functions
  const queue = [...startingNodes];

  while (queue.length > 0) {
    const currentNode = queue.shift();
    if (!currentNode || visited.has(currentNode.id)) continue;

    visited.add(currentNode.id);
    graph.push(currentNode);

    // Get outgoing nodes using React Flow native function
    const outgoers = getOutgoers(currentNode, allNodes, edges);

    for (const nextNode of outgoers) {
      if (!visited.has(nextNode.id)) {
        queue.push(nextNode);
      }
    }
  }

  return graph;
};

/**
 * Traverse flow graph to generate expression parts
 */
const traverseFlowGraph = (flowGraph: any[]): string[] => {
  const expressionParts: string[] = [];

  for (let i = 0; i < flowGraph.length; i++) {
    const node = flowGraph[i];

    if (node.type === "condition") {
      const conditionExpression = generateConditionExpression(node);
      if (conditionExpression) {
        expressionParts.push(conditionExpression);
      }
    } else if (node.type === "conditionalOperator") {
      const operator =
        node.data?.operator || node.data?.selectedOperator || "AND";
      expressionParts.push(operator.toUpperCase());
    }
  }

  return expressionParts;
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
      customer_id: "numeric",
      Customer_id: "numeric",
    },
    products: {
      stock_quantity: "numeric",
      price: "numeric",
    },
    attendance: {
      WorkingHours: "numeric",
      Date: "date",
    },
  };

  // Check for exact match first
  if (typeMap[table]?.[field]) {
    return typeMap[table][field];
  }

  // Fallback: guess type based on field name patterns
  const fieldLower = field.toLowerCase();
  if (
    fieldLower.includes("id") ||
    fieldLower.includes("quantity") ||
    fieldLower.includes("amount") ||
    fieldLower.includes("price")
  ) {
    return "numeric";
  } else if (fieldLower.includes("date") || fieldLower.includes("time")) {
    return "date";
  }

  return "varchar";
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

  // Additional fallback: handle common variations
  const expressionLower = expression.toLowerCase();
  if (expressionLower.includes("greater") && expressionLower.includes("than")) {
    return ">";
  } else if (
    expressionLower.includes("less") &&
    expressionLower.includes("than")
  ) {
    return "<";
  } else if (expressionLower.includes("equal")) {
    return "=";
  } else if (
    expressionLower.includes("not") &&
    expressionLower.includes("equal")
  ) {
    return "!=";
  }

  // Default fallback
  return "=";
};

/**
 * Format value based on field type
 */
const formatValue = (value: string, fieldType: string): string => {
  if (fieldType === "varchar") {
    return `"${value}"`;
  } else if (fieldType === "date") {
    return `"${value}"`;
  } else if (fieldType === "numeric" || fieldType === "integer") {
    // For numeric values, return as-is without quotes
    return value;
  } else {
    // Default to quoted string for unknown types
    return `"${value}"`;
  }
};

/**
 * Find action group connected to a rule group using React Flow native functions
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

  // Fallback: Find action groups connected via edges using React Flow native functions
  const ruleGroupNode = nodes.find((node) => node.id === ruleGroupId);
  if (!ruleGroupNode) return null;

  // Get all outgoing nodes using React Flow native function
  const outgoers = getOutgoers(ruleGroupNode, nodes, edges);

  for (const targetNode of outgoers) {
    if (targetNode.type === "conditionalOperator") {
      // Get outgoing nodes from the conditional operator
      const operatorOutgoers = getOutgoers(targetNode, nodes, edges);

      for (const actionTargetNode of operatorOutgoers) {
        if (actionTargetNode.type === "actionName") {
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
