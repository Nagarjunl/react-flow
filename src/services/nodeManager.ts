/**
 * Node Management Service
 * Handles creation and management of React Flow nodes
 */

import type { Node, XYPosition, ReactFlowInstance } from "@xyflow/react";
import { LayoutService } from "./layoutService";

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
  setSelectedGroupId: (id: string | null) => void,
  reactFlowInstance?: ReactFlowInstance
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

  // Calculate position using centralized LayoutService with React Flow native methods
  const conditionPosition = LayoutService.calculateOffsetPosition(
    nodes,
    "condition",
    reactFlowInstance,
    parentId
  );

  const conditionId = `condition-${Date.now()}`;
  const conditionNode: Node = {
    id: conditionId,
    type: "condition",
    position: conditionPosition, // Use centralized positioning
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
  setSelectedGroupId: (id: string | null) => void,
  reactFlowInstance?: ReactFlowInstance
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

  // Calculate position using centralized LayoutService with React Flow native methods
  const operatorPosition = LayoutService.calculateOffsetPosition(
    nodes,
    "conditionalOperator",
    reactFlowInstance,
    parentId
  );

  const operatorId = `conditionalOperator-${Date.now()}`;
  const operatorNode: Node = {
    id: operatorId,
    type: "conditionalOperator",
    position: operatorPosition, // Use centralized positioning
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
  setSelectedGroupId: (id: string | null) => void,
  existingNodes: Node[] = []
): Node[] => {
  const ruleGroupId = `resizableRuleGroup-${nodeCounter.resizableGroup + 1}`;
  const newCounter = {
    ...nodeCounter,
    resizableGroup: nodeCounter.resizableGroup + 1,
  };
  setNodeCounter(newCounter);

  // Calculate position using React Flow's recommended layouting approach with Dagre
  const position = LayoutService.calculateNewNodePosition(
    existingNodes,
    "resizableGroup",
    undefined, // reactFlowInstance not available in this context
    nodeCounter.resizableGroup
  );

  const ruleGroup: Node = {
    id: ruleGroupId,
    type: "resizableGroup",
    position,
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

  // Calculate position using centralized LayoutService
  const ruleNamePosition = LayoutService.calculateOffsetPosition(
    existingNodes,
    "ruleName",
    undefined, // reactFlowInstance not available in this context
    ruleGroupId
  );

  const ruleNameNode: Node = {
    id: ruleNameId,
    type: "ruleName",
    position: ruleNamePosition, // Use centralized positioning
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
  setSelectedGroupId: (id: string | null) => void,
  existingNodes: Node[] = []
): Node[] => {
  // Validate: Action Group within Action Group is not allowed
  if (selectedGroupId) {
    const parentNode = existingNodes.find(
      (node) => node.id === selectedGroupId
    );
    if (parentNode && parentNode.data?.label === "Action Group") {
      alert("Action Group within another Action Group is not allowed.");
      return [];
    }
  }
  const actionGroupId = `resizableActionGroup-${
    nodeCounter.resizableGroup + 1
  }`;
  const newCounter = {
    ...nodeCounter,
    resizableGroup: nodeCounter.resizableGroup + 1,
  };
  setNodeCounter(newCounter);

  // Calculate position based on context (main flow vs within group)
  let position: XYPosition;
  if (selectedGroupId) {
    // Action group within a rule group - position relative to other action groups in same group
    position = LayoutService.calculateOffsetPosition(
      existingNodes,
      "resizableGroup",
      undefined,
      selectedGroupId
    );
  } else {
    // Action group in main flow - use normal positioning
    position = LayoutService.calculateNewNodePosition(
      existingNodes,
      "resizableGroup",
      undefined,
      nodeCounter.resizableGroup
    );
  }

  const actionGroup: Node = {
    id: actionGroupId,
    type: "resizableGroup",
    position,
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

  // Calculate position using centralized LayoutService
  const actionNamePosition = LayoutService.calculateOffsetPosition(
    existingNodes,
    "actionName",
    undefined, // reactFlowInstance not available in this context
    actionGroupId
  );

  const actionNameNode: Node = {
    id: actionNameId,
    type: "actionName",
    position: actionNamePosition, // Use centralized positioning
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
 * Calculates position for new nodes using React Flow's recommended layouting approach
 */
export const calculateNodePosition = (
  nodeCounter: NodeCounter,
  nodeType: string,
  existingNodes: Node[] = [],
  reactFlowInstance?: ReactFlowInstance
): XYPosition => {
  const nodeIndex = nodeCounter[nodeType as keyof NodeCounter] || 0;

  // Use React Flow's recommended layouting service with Dagre
  return LayoutService.calculateNewNodePosition(
    existingNodes,
    nodeType,
    reactFlowInstance,
    nodeIndex
  );
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
  onAddOperatorToGroup: (groupId: string) => void,
  existingNodes: Node[] = [],
  reactFlowInstance?: ReactFlowInstance
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
      setSelectedGroupId,
      existingNodes
    );
  } else if (nodeType === "action") {
    // Create Action group container with resizable functionality
    newNodes = createActionGroup(
      newCounter,
      selectedGroupId,
      setNodeCounter,
      setNodes,
      setSelectedGroupId,
      existingNodes
    );
  } else {
    // For initial, and other nodes
    const position = calculateNodePosition(
      newCounter,
      nodeType,
      existingNodes,
      reactFlowInstance
    );
    const newNode = createSimpleNode(nodeType, newNodeId, position, setNodes);
    newNodes = [newNode];
  }

  setNodes((nds) => [...nds, ...newNodes]);
  return newNodes;
};

/**
 * Handle delete restriction rule using React Flow native methods
 * Returns additional changes to be applied when Rule Name or Action Name nodes are deleted
 */
export const handleDeleteRestrictionRule = (
  changes: any[],
  nodes: Node[]
): any[] => {
  const additionalChanges: any[] = [];

  // Find nodes that are being deleted and check if they are Rule Name or Action Name nodes
  const deletedNodeIds = changes
    .filter((change) => change.type === "remove")
    .map((change) => change.id);

  // Find Rule Name nodes being deleted
  const deletedRuleNameNodes = deletedNodeIds.filter((nodeId) => {
    const node = nodes.find((n) => n.id === nodeId);
    return node && node.type === "ruleName";
  });

  // Find Action Name nodes being deleted
  const deletedActionNameNodes = deletedNodeIds.filter((nodeId) => {
    const node = nodes.find((n) => n.id === nodeId);
    return node && node.type === "actionName";
  });

  // Add changes to delete entire Rule Groups when Rule Name nodes are deleted
  deletedRuleNameNodes.forEach((ruleNameNodeId) => {
    const ruleNameNode = nodes.find((n) => n.id === ruleNameNodeId);
    if (ruleNameNode && ruleNameNode.parentId) {
      const parentGroupId = ruleNameNode.parentId;

      // Find all child nodes of the parent group
      const childNodes = nodes.filter(
        (node) => node.parentId === parentGroupId
      );

      // Add remove changes for parent group and all its children
      additionalChanges.push({
        type: "remove",
        id: parentGroupId,
      });

      childNodes.forEach((childNode) => {
        additionalChanges.push({
          type: "remove",
          id: childNode.id,
        });
      });
    }
  });

  // Add changes to delete entire Action Groups when Action Name nodes are deleted
  deletedActionNameNodes.forEach((actionNameNodeId) => {
    const actionNameNode = nodes.find((n) => n.id === actionNameNodeId);
    if (actionNameNode && actionNameNode.parentId) {
      const parentGroupId = actionNameNode.parentId;

      // Find all child nodes of the parent group
      const childNodes = nodes.filter(
        (node) => node.parentId === parentGroupId
      );

      // Add remove changes for parent group and all its children
      additionalChanges.push({
        type: "remove",
        id: parentGroupId,
      });

      childNodes.forEach((childNode) => {
        additionalChanges.push({
          type: "remove",
          id: childNode.id,
        });
      });
    }
  });

  return additionalChanges;
};
