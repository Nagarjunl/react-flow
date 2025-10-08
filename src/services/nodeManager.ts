/**
 * Node Management Service
 * Handles creation and management of React Flow nodes
 */

import type { Node } from "@xyflow/react";

/**
 * Node counter interface
 */
export interface NodeCounter {
  resizableGroup: number;
  initial: number;
  condition: number;
  conditionalOperator: number;
  action: number;
  ruleName: number;
  actionName: number;
}

/**
 * Position interface
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Creates a condition node within a parent group
 */
export const createConditionNode = (
  parentId: string,
  nodes: Node[],
  setNodes: (nodes: Node[] | ((prev: Node[]) => Node[])) => void,
  setSelectedGroupId: (id: string | null) => void
): Node | null => {
  // Validate that the parent group still exists
  const parentExists = nodes.some(
    (node) => node.id === parentId && node.type === "resizableGroup"
  );
  if (!parentExists) {
    alert(
      "The selected group no longer exists. Please select a valid group first."
    );
    setSelectedGroupId(null);
    return null;
  }

  const conditionId = `condition-${Date.now()}`;
  const conditionNode: Node = {
    id: conditionId,
    type: "condition",
    position: { x: 20, y: 80 }, // Relative to parent group
    parentId: parentId,
    extent: "parent",
    data: {
      onChange: (newData: any) => {
        setNodes((nds) =>
          nds.map((node) =>
            node.id === conditionId
              ? { ...node, data: { ...node.data, ...newData } }
              : node
          )
        );
      },
      selectedTable: "",
      selectedField: "",
      expression: "",
      value: "",
      isValid: false,
    },
  };

  setNodes((nds) => [...nds, conditionNode]);
  return conditionNode;
};

/**
 * Creates a conditional operator node within a parent group
 */
export const createOperatorNode = (
  parentId: string,
  nodes: Node[],
  setNodes: (nodes: Node[] | ((prev: Node[]) => Node[])) => void,
  setSelectedGroupId: (id: string | null) => void
): Node | null => {
  // Validate that the parent group still exists
  const parentExists = nodes.some(
    (node) => node.id === parentId && node.type === "resizableGroup"
  );
  if (!parentExists) {
    alert(
      "The selected group no longer exists. Please select a valid group first."
    );
    setSelectedGroupId(null);
    return null;
  }

  const operatorId = `conditionalOperator-${Date.now()}`;
  const operatorNode: Node = {
    id: operatorId,
    type: "conditionalOperator",
    position: { x: 20, y: 120 }, // Position below conditions
    parentId: parentId,
    extent: "parent",
    data: {
      onChange: (newData: any) => {
        setNodes((nds) =>
          nds.map((node) =>
            node.id === operatorId
              ? { ...node, data: { ...node.data, ...newData } }
              : node
          )
        );
      },
      operator: "",
      isValid: false,
    },
  };

  setNodes((nds) => [...nds, operatorNode]);
  return operatorNode;
};

/**
 * Creates a rule group with its child rule name node
 */
export const createRuleGroup = (
  nodeCounter: NodeCounter,
  selectedGroupId: string | null,
  setNodeCounter: (counter: NodeCounter) => void,
  setNodes: (nodes: Node[] | ((prev: Node[]) => Node[])) => void,
  setSelectedGroupId: (id: string | null) => void
): Node[] => {
  const ruleGroupId = `resizableRuleGroup-${nodeCounter.resizableGroup + 1}`;
  const newCounter = {
    ...nodeCounter,
    resizableGroup: nodeCounter.resizableGroup + 1,
  };
  setNodeCounter(newCounter);

  const ruleGroup: Node = {
    id: ruleGroupId,
    type: "resizableGroup",
    position: { x: 50, y: 50 }, // Fixed position to avoid covering viewport
    parentId: selectedGroupId || undefined, // Nest under selected group if available
    extent: selectedGroupId ? "parent" : undefined, // Set extent if nested
    style: {
      width: 300,
      height: 200,
    },
    data: {
      label: "Rule Group",
      backgroundColor: "rgba(139, 92, 246, 0.05)",
      border: "2px solid #8b5cf6",
    },
  };

  // Create Rule Name child node
  const ruleNameId = `${ruleGroupId}-name`;
  const ruleNameNode: Node = {
    id: ruleNameId,
    type: "ruleName",
    position: { x: 10, y: 10 }, // Relative to parent
    parentId: ruleGroupId,
    extent: "parent",
    data: {
      ruleName: "",
      isValid: false,
      onChange: (newData: any) => {
        setNodes((nds) =>
          nds.map((node) =>
            node.id === ruleGroupId
              ? { ...node, data: { ...node.data, ...newData } }
              : node
          )
        );
      },
    },
  };

  setSelectedGroupId(ruleGroupId); // Auto-select the new group
  return [ruleGroup, ruleNameNode];
};

/**
 * Creates an action group with its child action name node
 */
export const createActionGroup = (
  nodeCounter: NodeCounter,
  selectedGroupId: string | null,
  setNodeCounter: (counter: NodeCounter) => void,
  setNodes: (nodes: Node[] | ((prev: Node[]) => Node[])) => void,
  setSelectedGroupId: (id: string | null) => void
): Node[] => {
  const actionGroupId = `resizableActionGroup-${
    nodeCounter.resizableGroup + 1
  }`;
  const newCounter = {
    ...nodeCounter,
    resizableGroup: nodeCounter.resizableGroup + 1,
  };
  setNodeCounter(newCounter);

  const actionGroup: Node = {
    id: actionGroupId,
    type: "resizableGroup",
    position: { x: 20, y: 150 }, // Position within parent if selected
    parentId: selectedGroupId || undefined, // Nest under selected group if available
    extent: selectedGroupId ? "parent" : undefined, // Set extent if nested
    style: {
      width: 300,
      height: 200,
    },
    data: {
      label: "Action Group",
      backgroundColor: "rgba(239, 68, 68, 0.05)",
      border: "2px solid #ef4444",
    },
  };

  // Create Action Name child node
  const actionNameId = `${actionGroupId}-name`;
  const actionNameNode: Node = {
    id: actionNameId,
    type: "actionName",
    position: { x: 10, y: 10 }, // Relative to parent
    parentId: actionGroupId,
    extent: "parent", // This is crucial for proper parent-child relationship
    data: {
      actionType: "onSuccess", // Fixed case to match actionTypes
      actionName: "",
      isValid: false,
      onChange: (newData: any) => {
        setNodes((nds) =>
          nds.map((node) =>
            node.id === actionGroupId
              ? { ...node, data: { ...node.data, ...newData } }
              : node
          )
        );
      },
    },
  };

  setSelectedGroupId(actionGroupId); // Auto-select the new group
  return [actionGroup, actionNameNode];
};

/**
 * Creates a simple node (initial, conditionalOperator, etc.)
 */
export const createSimpleNode = (
  nodeType: string,
  newNodeId: string,
  position: Position,
  setNodes: (nodes: Node[] | ((prev: Node[]) => Node[])) => void
): Node => {
  const newNode: Node = {
    id: newNodeId,
    type: nodeType,
    position,
    data: {
      onChange: (newData: any) => {
        setNodes((nds) =>
          nds.map((node) =>
            node.id === newNodeId
              ? { ...node, data: { ...node.data, ...newData } }
              : node
          )
        );
      },
    },
  };

  return newNode;
};

/**
 * Calculates position for new nodes based on node counter
 */
export const calculateNodePosition = (
  nodeCounter: NodeCounter,
  nodeType: string
): Position => {
  const baseX = 400; // Moved further right to avoid overlap with Rule Groups
  const baseY = 100;
  const nodeIndex = nodeCounter[nodeType as keyof NodeCounter] || 0;

  return {
    x: baseX + nodeIndex * 320,
    y: baseY + nodeIndex * 120,
  };
};

/**
 * Main function to add a node based on type
 */
export const addNode = (
  nodeType: string,
  nodeCounter: NodeCounter,
  selectedGroupId: string | null,
  setNodeCounter: (counter: NodeCounter) => void,
  setNodes: (nodes: Node[] | ((prev: Node[]) => Node[])) => void,
  setSelectedGroupId: (id: string | null) => void,
  onAddConditionToGroup: (groupId: string) => void,
  onAddOperatorToGroup: (groupId: string) => void
): Node[] => {
  // Handle condition node with context awareness
  if (nodeType === "condition") {
    if (!selectedGroupId) {
      alert(
        "Please select a group first by clicking on a Rule or Action group, then add a condition."
      );
      return [];
    }
    // Add condition to selected group
    onAddConditionToGroup(selectedGroupId);
    return [];
  }

  // Handle conditional operator node with context awareness
  if (nodeType === "conditionalOperator") {
    if (!selectedGroupId) {
      alert(
        "Please select a group first by clicking on a Rule or Action group, then add an operator."
      );
      return [];
    }
    // Add operator to selected group
    onAddOperatorToGroup(selectedGroupId);
    return [];
  }

  const newNodeId = `${nodeType}-${
    (nodeCounter[nodeType as keyof NodeCounter] || 0) + 1
  }`;
  const newCounter = {
    ...nodeCounter,
    [nodeType]: (nodeCounter[nodeType as keyof NodeCounter] || 0) + 1,
  };
  setNodeCounter(newCounter);

  let newNodes: Node[] = [];

  if (nodeType === "resizableGroup") {
    // Create Rule group container with resizable functionality
    newNodes = createRuleGroup(
      newCounter,
      selectedGroupId,
      setNodeCounter,
      setNodes,
      setSelectedGroupId
    );
  } else if (nodeType === "action") {
    // Create Action group container with resizable functionality
    newNodes = createActionGroup(
      newCounter,
      selectedGroupId,
      setNodeCounter,
      setNodes,
      setSelectedGroupId
    );
  } else {
    // For initial, and other nodes
    const position = calculateNodePosition(newCounter, nodeType);
    const newNode = createSimpleNode(nodeType, newNodeId, position, setNodes);
    newNodes = [newNode];
  }

  setNodes((nds) => [...nds, ...newNodes]);
  return newNodes;
};
