import { getIncomers, getOutgoers } from "@xyflow/react";
import { Node, Edge } from "@xyflow/react";

// Validation error types
export interface ValidationError {
  type:
    | "cycle"
    | "disconnected"
    | "operator_input"
    | "operator_single"
    | "invalid_connection"
    // Initial Node Restrictions
    | "initial_multiple"
    | "initial_no_connection"
    | "initial_in_group"
    | "initial_action_connection"
    | "initial_multiple_connections"
    // Rule Group Node Restrictions
    | "rule_group_nested"
    | "rule_group_no_handles"
    | "rule_group_zero_conditions"
    // Action Group Node Restrictions
    | "action_group_zero_conditions"
    | "action_group_external_connection"
    | "action_group_connection"
    // Connection Restrictions
    | "connection_forbidden"
    | "connection_missing_handles"
    | "connection_condition_direct"
    | "connection_operator_reversed"
    | "connection_branching"
    // Field Restrictions
    | "field_incomplete"
    | "field_required"
    // Grouping Logic
    | "grouping_invalid"
    | "grouping_default_and"
    | "grouping_operator_direct"
    // Delete Restrictions
    | "delete_rule_name"
    | "delete_action_name";
  message: string;
  nodeId?: string;
  edgeId?: string;
  ruleGroupId?: string;
  actionGroupId?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

// Validation rules based on your requirements
// export const validateRuleGroup = (
//   ruleGroupId: string,
//   nodes: Node[],
//   edges: Edge[]
// ): ValidationResult => {
//   const errors: ValidationError[] = [];
//   const warnings: ValidationError[] = [];

//   try {
//     // Get all condition and operator nodes in this rule group
//     const conditionNodes = nodes.filter(
//       (node) => node.type === "condition" && node.parentId === ruleGroupId
//     );

//     const conditionalOperatorNodes = findConditionalOperatorsForGroup(
//       ruleGroupId,
//       nodes,
//       edges
//     );

//     // Special case: Single condition node with no operators (valid)
//     if (conditionNodes.length === 1 && conditionalOperatorNodes.length === 0) {
//       return { isValid: true, errors: [], warnings: [] };
//     }

//     // Validate graph structure
//     const structureErrors = validateRuleGroupStructure(
//       ruleGroupId,
//       nodes,
//       edges,
//       conditionNodes,
//       conditionalOperatorNodes
//     );

//     errors.push(...structureErrors);

//     return {
//       isValid: errors.length === 0,
//       errors,
//       warnings,
//     };
//   } catch (error) {
//     return {
//       isValid: false,
//       errors: [
//         {
//           type: "invalid_connection",
//           message: `Validation error in rule group ${ruleGroupId}: ${
//             error instanceof Error ? error.message : "Unknown error"
//           }`,
//           ruleGroupId,
//         },
//       ],
//       warnings: [],
//     };
//   }
// };

export const validateRuleGroup = (
  ruleGroupId: string,
  nodes: Node[],
  edges: Edge[]
): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = []; // Now actively used

  try {
    const conditionNodes = nodes.filter(
      (node) => node.type === "condition" && node.parentId === ruleGroupId
    );

    const conditionalOperatorNodes = findConditionalOperatorsForGroup(
      ruleGroupId,
      nodes,
      edges
    );

    if (conditionNodes.length === 1 && conditionalOperatorNodes.length === 0) {
      return { isValid: true, errors: [], warnings: [] };
    }

    // Validate graph structure (now returns errors; extend if warnings added)
    const structureErrors = validateRuleGroupStructure(
      ruleGroupId,
      edges,
      conditionNodes,
      conditionalOperatorNodes
    );

    errors.push(...structureErrors);

    // Example: Add custom warnings (e.g., if no deep nesting error, but could expand)
    if (conditionalOperatorNodes.length > 5) {
      warnings.push({
        type: "disconnected", // Reuse or add "complexity"
        message: `High number of operators in rule group ${ruleGroupId} – may affect performance`,
        ruleGroupId,
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  } catch (error) {
    return {
      isValid: false,
      errors: [
        {
          type: "invalid_connection",
          message: `Validation error in rule group ${ruleGroupId}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          ruleGroupId,
        },
      ],
      warnings: [],
    };
  }
};

// Validate individual edge connection
// export const validateEdgeConnection = (
//   connection: { source: string; target: string },
//   nodes: Node[],
//   edges: Edge[]
// ): ValidationResult => {
//   const errors: ValidationError[] = [];
//   const warnings: ValidationError[] = [];

//   const sourceNode = nodes.find((n) => n.id === connection.source);
//   const targetNode = nodes.find((n) => n.id === connection.target);

//   if (!sourceNode || !targetNode) {
//     errors.push({
//       type: "invalid_connection",
//       message: "Source or target node not found",
//       nodeId: connection.source || connection.target,
//     });
//     return { isValid: false, errors, warnings };
//   }

//   // Rule 1: Condition nodes cannot connect to other condition nodes
//   if (sourceNode.type === "condition" && targetNode.type === "condition") {
//     errors.push({
//       type: "invalid_connection",
//       message: "Condition nodes cannot connect to other condition nodes",
//       nodeId: sourceNode.id,
//     });
//   }

//   // Rule 2: Operator nodes must have exactly 2 inputs
//   if (targetNode.type === "conditionalOperator") {
//     const existingIncomers = getIncomers(targetNode, nodes, edges);
//     const newIncomers = [...existingIncomers, sourceNode];

//     if (newIncomers.length > 2) {
//       errors.push({
//         type: "operator_input",
//         message: "Operator nodes can have at most 2 inputs",
//         nodeId: targetNode.id,
//       });
//     }
//   }

//   // Rule 3: Check for cycles (simplified check)
//   if (wouldCreateCycle(connection, nodes, edges)) {
//     errors.push({
//       type: "cycle",
//       message: "This connection would create a cycle",
//       nodeId: sourceNode.id,
//     });
//   }

//   return {
//     isValid: errors.length === 0,
//     errors,
//     warnings,
//   };
// };

export const validateEdgeConnection = (
  connection: { source: string; target: string },
  nodes: Node[],
  edges: Edge[]
): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  const sourceNode = nodes.find((n) => n.id === connection.source);
  const targetNode = nodes.find((n) => n.id === connection.target);

  if (!sourceNode || !targetNode) {
    errors.push({
      type: "invalid_connection",
      message: "Source or target node not found",
      nodeId: connection.source || connection.target,
    });
    return { isValid: false, errors, warnings };
  }

  // Rule 1: Condition nodes cannot connect to other condition nodes
  if (sourceNode.type === "condition" && targetNode.type === "condition") {
    errors.push({
      type: "invalid_connection",
      message: "Condition nodes cannot connect to other condition nodes",
      nodeId: sourceNode.id,
    });
  }

  // Rule 2: Prevent reversed flow (operator -> condition)
  if (
    sourceNode.type === "conditionalOperator" &&
    targetNode.type === "condition"
  ) {
    errors.push({
      type: "invalid_connection",
      message:
        "Operators cannot connect directly to conditions (reversed flow not allowed)",
      nodeId: sourceNode.id,
    });
  }

  // Rule 3: Prevent fan-out (>1 outgoer per node)
  const existingOutgoers = getOutgoers(sourceNode, nodes, edges);
  console.log("sourceNode", sourceNode);
  if (existingOutgoers.length >= 1 && sourceNode.type !== "initial") {
    errors.push({
      type: "invalid_connection",
      message:
        "Branching out not allowed—each node can connect to only one downstream node",
      nodeId: sourceNode.id,
    });
  }

  // Rule 5: Check for cycles
  if (wouldCreateCycle(connection, edges)) {
    errors.push({
      type: "cycle",
      message: "This connection would create a cycle",
      nodeId: sourceNode.id,
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

// Validate all rule groups in the flow
export const validateAllRuleGroups = (
  nodes: Node[],
  edges: Edge[]
): ValidationResult => {
  const allErrors: ValidationError[] = [];
  const allWarnings: ValidationError[] = [];

  // Find all rule groups
  const ruleGroups = nodes.filter((node) => node.type === "resizableGroup");

  for (const ruleGroup of ruleGroups) {
    const result = validateRuleGroup(ruleGroup.id, nodes, edges);
    allErrors.push(...result.errors);
    allWarnings.push(...result.warnings);
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
};

// Helper function to find conditional operators for a group
const findConditionalOperatorsForGroup = (
  ruleGroupId: string,
  nodes: Node[],
  edges: Edge[]
): Node[] => {
  const conditionalOperators: Node[] = [];

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

// Validate rule group structure (same logic as jsonGenerator)
// const validateRuleGroupStructure = (
//   ruleGroupId: string,
//   nodes: Node[],
//   edges: Edge[],
//   conditionNodes: Node[],
//   conditionalOperatorNodes: Node[]
// ): ValidationError[] => {
//   const errors: ValidationError[] = [];
//   const allNodes = [...conditionNodes, ...conditionalOperatorNodes];
//   const processedNodes = new Set<string>();
//   const visited = new Set<string>();

//   // Check for cycles and disconnected nodes using DFS
//   const checkNode = (nodeId: string) => {
//     if (visited.has(nodeId)) {
//       if (processedNodes.has(nodeId)) return; // Back edge, cycle detected
//       errors.push({
//         type: "cycle",
//         message: `Cycle detected in rule group ${ruleGroupId} at node ${nodeId}`,
//         nodeId,
//         ruleGroupId,
//       });
//       return;
//     }
//     visited.add(nodeId);
//     processedNodes.add(nodeId);

//     const node = allNodes.find((n) => n.id === nodeId);
//     if (!node) return;

//     const outgoers = getOutgoers(node, allNodes, edges);
//     for (const outgoer of outgoers) {
//       checkNode(outgoer.id);
//     }

//     const incomers = getIncomers(node, allNodes, edges);
//     if (node.type === "conditionalOperator" && incomers.length < 1) {
//       errors.push({
//         type: "operator_input",
//         message: `Operator at ID ${node.id} in rule group ${ruleGroupId} has no incoming conditions`,
//         nodeId: node.id,
//         ruleGroupId,
//       });
//     }
//     if (node.type === "conditionalOperator" && incomers.length === 1) {
//       const outgoerConditions = getOutgoers(node, allNodes, edges).filter(
//         (n) => n.type === "condition"
//       );
//       if (outgoerConditions.length === 0) {
//         errors.push({
//           type: "operator_single",
//           message: `Operator at ID ${node.id} in rule group ${ruleGroupId} has only one condition and no further connections`,
//           nodeId: node.id,
//           ruleGroupId,
//         });
//       }
//     }
//   };

//   // Start DFS from each condition node
//   for (const condition of conditionNodes) {
//     if (!processedNodes.has(condition.id)) {
//       checkNode(condition.id);
//     }
//   }

//   // Check for unprocessed nodes (disconnected)
//   const groupNodes = allNodes.filter((n) => n.parentId === ruleGroupId);
//   for (const node of groupNodes) {
//     if (!processedNodes.has(node.id)) {
//       errors.push({
//         type: "disconnected",
//         message: `Disconnected node ${node.id} found in rule group ${ruleGroupId}`,
//         nodeId: node.id,
//         ruleGroupId,
//       });
//     }
//   }

//   return errors;
// };

const validateRuleGroupStructure = (
  ruleGroupId: string,
  edges: any[],
  conditionNodes: any[],
  conditionalOperatorNodes: any[]
): ValidationError[] => {
  const errors: ValidationError[] = [];
  const allNodes = [...conditionNodes, ...conditionalOperatorNodes];
  const processedNodes = new Set<string>();

  // Iterative DFS for cycle detection and structure validation
  const stack: { nodeId: string }[] = [];
  const visited = new Set<string>();
  const recursionStack = new Set<string>(); // For cycle detection
  let depthMap: { [nodeId: string]: number } = {}; // Track depth for warnings

  // Initialize stack with starting conditions
  for (const condition of conditionNodes) {
    if (getIncomers(condition, allNodes, edges).length === 0) {
      stack.push({ nodeId: condition.id });
      depthMap[condition.id] = 0;
    }
  }

  while (stack.length > 0) {
    const { nodeId } = stack.pop()!;
    const currentDepth = depthMap[nodeId] || 0;

    if (recursionStack.has(nodeId)) {
      errors.push({
        type: "cycle",
        message: `Cycle detected in rule group ${ruleGroupId} at node ${nodeId}`,
        nodeId,
        ruleGroupId,
      });
      continue;
    }

    if (visited.has(nodeId)) continue;

    visited.add(nodeId);
    recursionStack.add(nodeId);
    processedNodes.add(nodeId);

    const node = allNodes.find((n) => n.id === nodeId);
    if (!node) continue;

    // Validate operator: At least 2 effective operands
    if (node.type === "conditionalOperator") {
      const incomers = getIncomers(node, allNodes, edges);
      const outgoers = getOutgoers(node, allNodes, edges).filter(
        (n) => n.type === "condition"
      );
      const effectiveOperands = incomers.length + outgoers.length;
      if (effectiveOperands < 2) {
        errors.push({
          type: "operator_single",
          message: `Operator at ID ${node.id} in rule group ${ruleGroupId} has fewer than 2 effective conditions`,
          nodeId: node.id,
          ruleGroupId,
        });
      }
    }

    // Check depth warning
    if (currentDepth > 5) {
      // Note: Warnings are collected in validateRuleGroup, but here's the logic
      // You'll need to adjust validateRuleGroup to return warnings too
      // For now, add as error or move to warnings array if implemented
      errors.push({
        // Placeholder; change to warnings.push if separating
        type: "disconnected", // Reuse type or add new "deep_nesting"
        message: `Deep nesting detected at node ${node.id} in rule group ${ruleGroupId} (depth ${currentDepth} > 5) – consider simplifying`,
        nodeId: node.id,
        ruleGroupId,
      });
    }

    const outgoers = getOutgoers(node, allNodes, edges);
    for (const outgoer of outgoers) {
      depthMap[outgoer.id] = currentDepth + 1;
      stack.push({ nodeId: outgoer.id });
    }

    recursionStack.delete(nodeId);
  }

  // Check disconnected nodes
  const groupNodes = allNodes.filter((n) => n.parentId === ruleGroupId);
  for (const node of groupNodes) {
    if (!processedNodes.has(node.id)) {
      errors.push({
        type: "disconnected",
        message: `Disconnected node ${node.id} found in rule group ${ruleGroupId}`,
        nodeId: node.id,
        ruleGroupId,
      });
    }
  }

  return errors;
};

// Check if a connection would create a cycle
const wouldCreateCycle = (
  connection: { source: string; target: string },
  edges: Edge[]
): boolean => {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  const hasCycle = (nodeId: string): boolean => {
    if (recursionStack.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;

    visited.add(nodeId);
    recursionStack.add(nodeId);

    // Get all outgoing edges from this node
    const outgoingEdges = edges.filter((edge) => edge.source === nodeId);

    // Add the new connection if it starts from this node
    if (connection.source === nodeId) {
      outgoingEdges.push({
        id: "temp-connection",
        source: connection.source,
        target: connection.target,
      } as Edge);
    }

    for (const edge of outgoingEdges) {
      if (hasCycle(edge.target)) return true;
    }

    recursionStack.delete(nodeId);
    return false;
  };

  return hasCycle(connection.source);
};

// ============================================================================
// NEW VALIDATION FUNCTIONS - COMPREHENSIVE RULE ENGINE VALIDATION
// ============================================================================

// 1. INITIAL NODE VALIDATION
export const validateInitialNode = (
  nodes: Node[],
  edges: Edge[]
): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  try {
    const initialNodes = nodes.filter((node) => node.type === "initial");

    // Rule 1: Only one Initial Node allowed
    if (initialNodes.length === 0) {
      errors.push({
        type: "initial_no_connection",
        message: "No Initial Node found. Please add an Initial Node first.",
      });
      return { isValid: false, errors, warnings };
    }

    if (initialNodes.length > 1) {
      errors.push({
        type: "initial_multiple",
        message: "Only one Initial Node is allowed for the whole flow chart.",
        nodeId: initialNodes[1].id,
      });
    }

    const initialNode = initialNodes[0];

    // Rule 4: Initial Node cannot be inside any ResizableGroup
    if (initialNode.parentId) {
      errors.push({
        type: "initial_in_group",
        message: "Initial Node cannot be placed inside any ResizableGroup.",
        nodeId: initialNode.id,
      });
    }

    // Rule 2 & 3: Initial must connect to all RuleName nodes
    const ruleNameNodes = nodes.filter((node) => node.type === "ruleName");
    const connectedRuleNames = getOutgoers(initialNode, nodes, edges).filter(
      (node) => node.type === "ruleName"
    );

    // Check if all RuleName nodes are connected to Initial
    for (const ruleNameNode of ruleNameNodes) {
      if (
        !connectedRuleNames.some(
          (connected) => connected.id === ruleNameNode.id
        )
      ) {
        errors.push({
          type: "initial_no_connection",
          message: `RuleName node "${
            ruleNameNode.data?.ruleName || ruleNameNode.id
          }" is not connected to Initial Node.`,
          nodeId: ruleNameNode.id,
        });
      }
    }

    // Rule 5: No connection between Action Group and Initial Node
    const actionGroups = nodes.filter(
      (node) =>
        node.type === "resizableGroup" && node.data?.label === "Action Group"
    );

    for (const actionGroup of actionGroups) {
      const actionGroupOutgoers = getOutgoers(actionGroup, nodes, edges);
      if (actionGroupOutgoers.some((node) => node.id === initialNode.id)) {
        errors.push({
          type: "initial_action_connection",
          message:
            "Connection between Action Group and Initial Node is not allowed.",
          nodeId: actionGroup.id,
        });
      }
    }

    // Rule 6: Only Initial node allowed multiple connections (but only to RuleName nodes)
    const initialOutgoers = getOutgoers(initialNode, nodes, edges);
    const nonRuleNameConnections = initialOutgoers.filter(
      (node) => node.type !== "ruleName"
    );

    if (nonRuleNameConnections.length > 0) {
      errors.push({
        type: "initial_multiple_connections",
        message: "Initial Node can only connect to RuleName nodes.",
        nodeId: initialNode.id,
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  } catch (error) {
    return {
      isValid: false,
      errors: [
        {
          type: "invalid_connection",
          message: `Initial Node validation failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        },
      ],
      warnings: [],
    };
  }
};

// 2. RULE GROUP VALIDATION
export const validateRuleGroups = (
  nodes: Node[],
  edges: Edge[]
): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  try {
    const ruleGroups = nodes.filter(
      (node) =>
        node.type === "resizableGroup" && node.data?.label !== "Action Group"
    );

    for (const ruleGroup of ruleGroups) {
      // Rule 4: No nested Rule Groups
      const nestedRuleGroups = nodes.filter(
        (node) =>
          node.type === "resizableGroup" &&
          node.parentId === ruleGroup.id &&
          node.data?.label !== "Action Group"
      );

      if (nestedRuleGroups.length > 0) {
        errors.push({
          type: "rule_group_nested",
          message: "Rule Group within another Rule Group is not allowed.",
          nodeId: ruleGroup.id,
          ruleGroupId: ruleGroup.id,
        });
      }

      // Rule 2 & 3: Must have one or more Condition Nodes
      const conditionNodes = nodes.filter(
        (node) => node.type === "condition" && node.parentId === ruleGroup.id
      );

      if (conditionNodes.length === 0) {
        errors.push({
          type: "rule_group_zero_conditions",
          message: "Rule Group must have at least one Condition Node.",
          nodeId: ruleGroup.id,
          ruleGroupId: ruleGroup.id,
        });
      }

      // Rule 6: Rule Groups have no bottom handles
      const ruleGroupOutgoers = getOutgoers(ruleGroup, nodes, edges);
      const nonInitialConnections = ruleGroupOutgoers.filter(
        (node) => node.type !== "initial"
      );

      if (nonInitialConnections.length > 0) {
        errors.push({
          type: "rule_group_no_handles",
          message:
            "Rule Group cannot have external connections except to Initial Node.",
          nodeId: ruleGroup.id,
          ruleGroupId: ruleGroup.id,
        });
      }

      // Validate complex grouping logic
      const groupingErrors = validateGroupingLogic(ruleGroup.id, nodes, edges);
      errors.push(...groupingErrors);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  } catch (error) {
    return {
      isValid: false,
      errors: [
        {
          type: "invalid_connection",
          message: `Rule Group validation failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        },
      ],
      warnings: [],
    };
  }
};

// 3. ACTION GROUP VALIDATION
export const validateActionGroups = (
  nodes: Node[],
  edges: Edge[]
): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  try {
    const actionGroups = nodes.filter(
      (node) =>
        node.type === "resizableGroup" && node.data?.label === "Action Group"
    );

    for (const actionGroup of actionGroups) {
      // Rule 1: Must have one or more Condition Nodes (zero not allowed)
      const conditionNodes = nodes.filter(
        (node) => node.type === "condition" && node.parentId === actionGroup.id
      );

      if (conditionNodes.length === 0) {
        errors.push({
          type: "action_group_zero_conditions",
          message: "Action Group must have at least one Condition Node.",
          nodeId: actionGroup.id,
          actionGroupId: actionGroup.id,
        });
      }

      // Rule 3: No connections between Action Groups
      const otherActionGroups = actionGroups.filter(
        (ag) => ag.id !== actionGroup.id
      );
      for (const otherActionGroup of otherActionGroups) {
        const actionGroupOutgoers = getOutgoers(actionGroup, nodes, edges);
        if (
          actionGroupOutgoers.some((node) => node.id === otherActionGroup.id)
        ) {
          errors.push({
            type: "action_group_connection",
            message: "Connection between Action Groups is not allowed.",
            nodeId: actionGroup.id,
            actionGroupId: actionGroup.id,
          });
        }
      }

      // Rule 4: No external connections to/from Action Groups
      const actionGroupOutgoers = getOutgoers(actionGroup, nodes, edges);
      const externalConnections = actionGroupOutgoers.filter(
        (node) => node.parentId !== actionGroup.id
      );

      if (externalConnections.length > 0) {
        errors.push({
          type: "action_group_external_connection",
          message: "Action Group cannot have external connections.",
          nodeId: actionGroup.id,
          actionGroupId: actionGroup.id,
        });
      }

      // Validate complex grouping logic (same as Rule Groups)
      const groupingErrors = validateGroupingLogic(
        actionGroup.id,
        nodes,
        edges
      );
      errors.push(...groupingErrors);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  } catch (error) {
    return {
      isValid: false,
      errors: [
        {
          type: "invalid_connection",
          message: `Action Group validation failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        },
      ],
      warnings: [],
    };
  }
};

// 4. CONNECTION VALIDATION
export const validateConnections = (
  nodes: Node[],
  edges: Edge[]
): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  try {
    for (const edge of edges) {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);

      if (!sourceNode || !targetNode) {
        errors.push({
          type: "connection_forbidden",
          message: "Source or target node not found",
          nodeId: edge.source || edge.target,
          edgeId: edge.id,
        });
        continue;
      }

      // Rule 1: No connection between Action Group Nodes and Rule Group Nodes
      if (
        sourceNode.type === "resizableGroup" &&
        targetNode.type === "resizableGroup"
      ) {
        const sourceIsActionGroup = sourceNode.data?.label === "Action Group";
        const targetIsActionGroup = targetNode.data?.label === "Action Group";

        if (sourceIsActionGroup && !targetIsActionGroup) {
          errors.push({
            type: "connection_forbidden",
            message:
              "Connection between Action Group and Rule Group is not allowed.",
            nodeId: sourceNode.id,
            edgeId: edge.id,
          });
        }
      }

      // Rule 2: No connection between Action Group Node and Initial Node
      if (
        (sourceNode.type === "resizableGroup" &&
          sourceNode.data?.label === "Action Group" &&
          targetNode.type === "initial") ||
        (targetNode.type === "resizableGroup" &&
          targetNode.data?.label === "Action Group" &&
          sourceNode.type === "initial")
      ) {
        errors.push({
          type: "connection_forbidden",
          message:
            "Connection between Action Group and Initial Node is not allowed.",
          nodeId: sourceNode.id,
          edgeId: edge.id,
        });
      }

      // Rule 4 & 5: No direct connection between two condition nodes
      if (sourceNode.type === "condition" && targetNode.type === "condition") {
        errors.push({
          type: "connection_condition_direct",
          message:
            "Direct connection between two condition nodes is not allowed.",
          nodeId: sourceNode.id,
          edgeId: edge.id,
        });
      }

      // Rule 2 (from existing): Prevent reversed flow (operator -> condition)
      if (
        sourceNode.type === "conditionalOperator" &&
        targetNode.type === "condition"
      ) {
        errors.push({
          type: "connection_operator_reversed",
          message:
            "Operators cannot connect directly to conditions (reversed flow not allowed).",
          nodeId: sourceNode.id,
          edgeId: edge.id,
        });
      }

      // Rule 3 (from existing): Prevent fan-out (>1 outgoer per node)
      const existingOutgoers = getOutgoers(sourceNode, nodes, edges);
      if (existingOutgoers.length > 1 && sourceNode.type !== "initial") {
        errors.push({
          type: "connection_branching",
          message:
            "Branching out not allowed—each node can connect to only one downstream node.",
          nodeId: sourceNode.id,
          edgeId: edge.id,
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  } catch (error) {
    return {
      isValid: false,
      errors: [
        {
          type: "invalid_connection",
          message: `Connection validation failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        },
      ],
      warnings: [],
    };
  }
};

// 5. FIELD VALIDATION
export const validateRequiredFields = (nodes: Node[]): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  try {
    for (const node of nodes) {
      const fieldErrors = validateNodeFields(node);
      errors.push(...fieldErrors);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  } catch (error) {
    return {
      isValid: false,
      errors: [
        {
          type: "field_incomplete",
          message: `Field validation failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        },
      ],
      warnings: [],
    };
  }
};

// Helper function to validate individual node fields
const validateNodeFields = (node: Node): ValidationError[] => {
  const errors: ValidationError[] = [];
  const data = node.data || {};

  switch (node.type) {
    case "initial":
      if (
        !data.workflowName ||
        (typeof data.workflowName === "string" &&
          data.workflowName.trim() === "")
      ) {
        errors.push({
          type: "field_required",
          message: "Workflow Name is required in Initial Node.",
          nodeId: node.id,
        });
      }
      break;

    case "ruleName":
      if (
        !data.ruleName ||
        (typeof data.ruleName === "string" && data.ruleName.trim() === "")
      ) {
        errors.push({
          type: "field_required",
          message: "Rule Name is required in RuleName Node.",
          nodeId: node.id,
        });
      }
      break;

    case "condition":
      if (
        !data.selectedTable ||
        (typeof data.selectedTable === "string" &&
          data.selectedTable.trim() === "")
      ) {
        errors.push({
          type: "field_required",
          message: "Table is required in Condition Node.",
          nodeId: node.id,
        });
      }
      if (
        !data.selectedField ||
        (typeof data.selectedField === "string" &&
          data.selectedField.trim() === "")
      ) {
        errors.push({
          type: "field_required",
          message: "Field is required in Condition Node.",
          nodeId: node.id,
        });
      }
      if (
        !data.expression ||
        (typeof data.expression === "string" && data.expression.trim() === "")
      ) {
        errors.push({
          type: "field_required",
          message: "Expression is required in Condition Node.",
          nodeId: node.id,
        });
      }
      if (
        !data.value ||
        (typeof data.value === "string" && data.value.trim() === "")
      ) {
        errors.push({
          type: "field_required",
          message: "Value is required in Condition Node.",
          nodeId: node.id,
        });
      }
      break;

    case "actionName":
      if (
        !data.actionType ||
        (typeof data.actionType === "string" && data.actionType.trim() === "")
      ) {
        errors.push({
          type: "field_required",
          message: "Action Type is required in ActionName Node.",
          nodeId: node.id,
        });
      }
      if (
        !data.actionName ||
        (typeof data.actionName === "string" && data.actionName.trim() === "")
      ) {
        errors.push({
          type: "field_required",
          message: "Action Name is required in ActionName Node.",
          nodeId: node.id,
        });
      }
      break;

    case "conditionalOperator":
      if (
        !data.operator ||
        (typeof data.operator === "string" && data.operator.trim() === "")
      ) {
        errors.push({
          type: "field_required",
          message: "Operator is required in ConditionalOperator Node.",
          nodeId: node.id,
        });
      }
      break;
  }

  return errors;
};

// 6. COMPLEX GROUPING LOGIC VALIDATION
export const validateGroupingLogic = (
  groupId: string,
  nodes: Node[],
  edges: Edge[]
): ValidationError[] => {
  const errors: ValidationError[] = [];

  try {
    const operatorNodes = nodes.filter(
      (node) => node.type === "conditionalOperator" && node.parentId === groupId
    );

    // Detect valid groups
    const validGroups = detectValidGroups(groupId, nodes, edges);

    // Validate each group
    for (const group of validGroups) {
      if (!group.isValid) {
        errors.push({
          type: "grouping_invalid",
          message: `Invalid group detected: ${group.reason}`,
          nodeId: group.id,
          ruleGroupId: groupId,
        });
      }
    }

    // Check for default AND operator between valid groups
    if (validGroups.length === 2) {
      const hasConnectingOperator = checkForConnectingOperator(
        validGroups,
        operatorNodes,
        edges
      );
      if (!hasConnectingOperator) {
        // This is valid - default AND will be applied
        // No error needed, just a note that default AND will be used
      }
    }

    // Validate operator restrictions
    const operatorErrors = validateOperatorRestrictions(groupId, nodes, edges);
    errors.push(...operatorErrors);

    return errors;
  } catch (error) {
    return [
      {
        type: "grouping_invalid",
        message: `Grouping logic validation failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        nodeId: groupId,
        ruleGroupId: groupId,
      },
    ];
  }
};

// Helper function to detect valid groups
const detectValidGroups = (
  groupId: string,
  nodes: Node[],
  edges: Edge[]
): Group[] => {
  const groups: Group[] = [];
  const processedNodes = new Set<string>();

  // Find starting conditions (no incoming edges)
  const startingConditions = nodes.filter(
    (node) =>
      node.type === "condition" &&
      node.parentId === groupId &&
      getIncomers(node, nodes, edges).length === 0
  );

  // Build groups from starting conditions
  for (const condition of startingConditions) {
    if (!processedNodes.has(condition.id)) {
      const group = buildGroupFromCondition(
        condition,
        groupId,
        nodes,
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

// Helper function to build group from condition
const buildGroupFromCondition = (
  startCondition: Node,
  groupId: string,
  nodes: Node[],
  edges: Edge[],
  processedNodes: Set<string>
): Group | null => {
  const groupNodes: Node[] = [startCondition];
  processedNodes.add(startCondition.id);

  // Follow the flow to build the group
  let currentNode = startCondition;
  while (true) {
    const outgoers = getOutgoers(currentNode, nodes, edges);
    const operatorNode = outgoers.find(
      (node) =>
        node.type === "conditionalOperator" &&
        node.parentId === groupId &&
        !processedNodes.has(node.id)
    );

    if (operatorNode) {
      groupNodes.push(operatorNode);
      processedNodes.add(operatorNode.id);

      // Check if this operator has multiple inputs (fan-in pattern)
      const incomers = getIncomers(operatorNode, nodes, edges);
      const conditionInputs = incomers.filter(
        (node) => node.type === "condition"
      );

      if (conditionInputs.length >= 2) {
        // Valid fan-in pattern
        groupNodes.push(...conditionInputs);
        conditionInputs.forEach((node) => processedNodes.add(node.id));
      }

      // Continue to next operator if exists
      const nextOutgoers = getOutgoers(operatorNode, nodes, edges);
      const nextOperator = nextOutgoers.find(
        (node) =>
          node.type === "conditionalOperator" &&
          node.parentId === groupId &&
          !processedNodes.has(node.id)
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

  // Validate the group
  const isValid = validateGroup(groupNodes, edges);

  return {
    id: `group_${startCondition.id}`,
    nodes: groupNodes,
    isValid: isValid.isValid,
    reason: isValid.reason,
  };
};

// Helper function to validate a group
const validateGroup = (
  groupNodes: Node[],
  edges: Edge[]
): { isValid: boolean; reason?: string } => {
  const operators = groupNodes.filter(
    (node) => node.type === "conditionalOperator"
  );
  console.log("groupNodes", groupNodes);
  // Check if group has at least 2 effective operands
  for (const operator of operators) {
    const incomers = getIncomers(operator, groupNodes, edges);
    const outgoers = getOutgoers(operator, groupNodes, edges);
    console.log("operator", operator);
    console.log("incomers", incomers);
    console.log("outgoers", outgoers);
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

// Helper function to check for connecting operator between groups
const checkForConnectingOperator = (
  groups: Group[],
  operatorNodes: Node[],
  edges: Edge[]
): boolean => {
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
        return true;
      }
    }
  }
  return false;
};

// 7. OPERATOR RESTRICTION VALIDATION
export const validateOperatorRestrictions = (
  groupId: string,
  nodes: Node[],
  edges: Edge[]
): ValidationError[] => {
  const errors: ValidationError[] = [];

  try {
    const operatorNodes = nodes.filter(
      (node) => node.type === "conditionalOperator" && node.parentId === groupId
    );

    for (const operator of operatorNodes) {
      const incomers = getIncomers(operator, nodes, edges);
      const operatorIncomers = incomers.filter(
        (node) => node.type === "conditionalOperator"
      );

      // Check for direct operator-to-operator connections that are NOT part of valid groups
      for (const operatorIncomer of operatorIncomers) {
        // Check if this is a valid fan-in pattern (multiple operators from valid groups)
        const isValidFanIn = checkValidFanInPattern(operator, operatorIncomer);

        if (!isValidFanIn) {
          errors.push({
            type: "grouping_operator_direct",
            message:
              "Direct operator-to-operator connection not allowed unless part of valid fan-in pattern.",
            nodeId: operator.id,
            ruleGroupId: groupId,
          });
        }
      }
    }

    return errors;
  } catch (error) {
    return [
      {
        type: "grouping_operator_direct",
        message: `Operator restriction validation failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        nodeId: groupId,
        ruleGroupId: groupId,
      },
    ];
  }
};

// Helper function to check valid fan-in pattern
const checkValidFanInPattern = (
  targetOperator: Node,
  sourceOperator: Node
): boolean => {
  // Check if the source operator is part of a valid group
  const sourceGroup = findGroupContainingOperator(sourceOperator);
  const targetGroup = findGroupContainingOperator(targetOperator);

  // Valid fan-in: multiple operators from valid groups feeding into one operator
  return !!(sourceGroup && targetGroup && sourceGroup.isValid);
};

// Helper function to find group containing an operator
const findGroupContainingOperator = (operator: Node): Group | null => {
  // This is a simplified implementation - in practice, you'd need to trace back
  // to find the group that contains this operator
  return {
    id: `group_${operator.id}`,
    nodes: [operator],
    isValid: true,
  };
};

// 8. COMPREHENSIVE VALIDATION FUNCTION
export const validateAll = (nodes: Node[], edges: Edge[]): ValidationResult => {
  const allErrors: ValidationError[] = [];
  const allWarnings: ValidationError[] = [];

  try {
    // Validation Priority: Field validation first, Grouping validation second, Connection validation third

    // 1. Field validation first
    const fieldResult = validateRequiredFields(nodes);
    allErrors.push(...fieldResult.errors);
    allWarnings.push(...fieldResult.warnings);

    // 2. Grouping validation second
    const initialResult = validateInitialNode(nodes, edges);
    allErrors.push(...initialResult.errors);
    allWarnings.push(...initialResult.warnings);

    const ruleGroupResult = validateRuleGroups(nodes, edges);
    allErrors.push(...ruleGroupResult.errors);
    allWarnings.push(...ruleGroupResult.warnings);

    const actionGroupResult = validateActionGroups(nodes, edges);
    allErrors.push(...actionGroupResult.errors);
    allWarnings.push(...actionGroupResult.warnings);

    // 3. Connection validation third
    const connectionResult = validateConnections(nodes, edges);
    allErrors.push(...connectionResult.errors);
    allWarnings.push(...connectionResult.warnings);

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
    };
  } catch (error) {
    return {
      isValid: false,
      errors: [
        {
          type: "invalid_connection",
          message: `Comprehensive validation failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        },
      ],
      warnings: [],
    };
  }
};

// Helper interfaces for grouping logic
interface Group {
  id: string;
  nodes: Node[];
  isValid: boolean;
  reason?: string;
}

// Get validation summary for UI display
export const getValidationSummary = (result: ValidationResult): string => {
  if (result.isValid) {
    return "All validations passed";
  }

  const errorCount = result.errors.length;
  const warningCount = result.warnings.length;

  if (errorCount > 0 && warningCount > 0) {
    return `${errorCount} error(s) and ${warningCount} warning(s) found`;
  } else if (errorCount > 0) {
    return `${errorCount} error(s) found`;
  } else {
    return `${warningCount} warning(s) found`;
  }
};
