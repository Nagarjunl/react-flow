import type { Node, NodeProps } from "@xyflow/react";

// Node types for the rule engine
export const nodeTypes = {
  initial: "initial",
  rule: "rule",
  condition: "condition",
  action: "action",
  conditionalOperator: "conditionalOperator",
  resizableGroup: "resizableGroup", // Resizable group node type
} as const;

// Type definitions for node data
export interface InitialNodeData extends Record<string, unknown> {
  workflowName: string;
  isValid: boolean;
}

export interface RuleNameNodeData extends Record<string, unknown> {
  ruleName: string;
  isValid: boolean;
}

export interface ConditionNodeData extends Record<string, unknown> {
  selectedTable: string;
  selectedField: string;
  expression: string;
  value: string;
  isValid: boolean;
}

export interface ActionNameNodeData extends Record<string, unknown> {
  actionType: string;
  actionName: string;
  isValid: boolean;
}

export interface ConditionalOperatorNodeData extends Record<string, unknown> {
  operator: string;
  isValid: boolean;
}

export interface ResizableGroupNodeData extends Record<string, unknown> {
  label: string;
  backgroundColor?: string;
  border?: string;
}

// Custom node types following React Flow documentation structure
export type InitialNode = Node<InitialNodeData, "initial">;
export type RuleNameNode = Node<RuleNameNodeData, "ruleName">;
export type ConditionNode = Node<ConditionNodeData, "condition">;
export type ActionNameNode = Node<ActionNameNodeData, "actionName">;
export type ConditionalOperatorNode = Node<
  ConditionalOperatorNodeData,
  "conditionalOperator"
>;
export type ResizableGroupNode = Node<ResizableGroupNodeData, "resizableGroup">;

// Union type for all custom nodes
export type CustomNodeType =
  | InitialNode
  | RuleNameNode
  | ConditionNode
  | ActionNameNode
  | ConditionalOperatorNode
  | ResizableGroupNode;

// Node component props types
export type InitialNodeProps = NodeProps<InitialNode>;
export type RuleNameNodeProps = NodeProps<RuleNameNode>;
export type ConditionNodeProps = NodeProps<ConditionNode>;
export type ActionNameNodeProps = NodeProps<ActionNameNode>;
export type ConditionalOperatorNodeProps = NodeProps<ConditionalOperatorNode>;
export type ResizableGroupNodeProps = NodeProps<ResizableGroupNode>;

// Expression symbols based on field types
export interface ExpressionSymbol {
  value: string;
  label: string;
}

export const expressionSymbols: Record<string, ExpressionSymbol[]> = {
  numeric: [
    { value: ">=", label: "Greater than or equal" },
    { value: "<=", label: "Less than or equal" },
    { value: "=", label: "Equal to" },
    { value: ">", label: "Greater than" },
    { value: "<", label: "Less than" },
    { value: "!=", label: "Not equal to" },
    { value: "+", label: "Addition" },
    { value: "-", label: "Subtraction" },
    { value: "*", label: "Multiplication" },
    { value: "/", label: "Division" },
  ],
  integer: [
    { value: ">=", label: "Greater than or equal" },
    { value: "<=", label: "Less than or equal" },
    { value: "=", label: "Equal to" },
    { value: ">", label: "Greater than" },
    { value: "<", label: "Less than" },
    { value: "!=", label: "Not equal to" },
    { value: "+", label: "Addition" },
    { value: "-", label: "Subtraction" },
    { value: "*", label: "Multiplication" },
    { value: "/", label: "Division" },
  ],
  varchar: [
    { value: "contains", label: "Contains" },
    { value: "equals", label: "Equals" },
    { value: "starts with", label: "Starts with" },
    { value: "ends with", label: "Ends with" },
    { value: "!=", label: "Not equal to" },
  ],
  date: [
    { value: ">=", label: "Greater than or equal" },
    { value: "<=", label: "Less than or equal" },
    { value: "=", label: "Equal to" },
    { value: ">", label: "After" },
    { value: "<", label: "Before" },
    { value: "!=", label: "Not equal to" },
  ],
};

// Action types
export interface ActionType {
  value: string;
  label: string;
}

export const actionTypes: ActionType[] = [
  { value: "onTarget", label: "On Target" },
  { value: "onSuccess", label: "On Success" },
  { value: "onFailure", label: "On Failure" },
  { value: "onError", label: "On Error" },
  { value: "onComplete", label: "On Complete" },
];

// Conditional operators
export interface ConditionalOperator {
  value: string;
  label: string;
}

export const conditionalOperators: ConditionalOperator[] = [
  { value: "AND", label: "AND" },
  { value: "OR", label: "OR" },
  { value: "NOT", label: "NOT" },
];

// Node colors
export const nodeColors = {
  initial: "#3b82f6", // Blue
  rule: "#8b5cf6", // Purple
  condition: "#ef4444", // Red
  action: "#14b8a6", // Teal
  conditionalOperator: "#f59e0b", // Amber
} as const;

// Import node components
import InitialNode from "../components/nodes/InitialNode";
import ConditionNode from "../components/nodes/ConditionNode";
import ConditionalOperatorNode from "../components/nodes/ConditionalOperatorNode";
import RuleNameNode from "../components/nodes/RuleNameNode";
import ActionNameNode from "../components/nodes/ActionNameNode";
import ResizableGroupNode from "../components/nodes/ResizableGroupNode";

// Export node components for React Flow
export const nodeComponents = {
  initial: InitialNode,
  condition: ConditionNode,
  conditionalOperator: ConditionalOperatorNode,
  ruleName: RuleNameNode,
  actionName: ActionNameNode,
  resizableGroup: ResizableGroupNode,
};
