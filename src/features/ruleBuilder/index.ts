// Rule Builder Feature Module Exports

// Main Component
export { default as RuleBuilder } from "./components/RuleBuilder";

// Sub-components
export { default as WorkflowSidebar } from "./components/WorkflowSidebar";
export { default as RuleGroupComponent } from "./components/RuleGroupComponent";
export { default as ActionGroupComponent } from "./components/ActionGroupComponent";
export { default as DataSourceSelector } from "./components/DataSourceSelector";
export { default as ActionExpressionBuilder } from "./components/ActionExpressionBuilder";

// Node Components
export {
  ConditionNode,
  ValueNode,
  OperatorNode,
  FunctionNode,
  CollectionMethodNode,
} from "./components/nodes";

// Hooks
export { useRuleBuilder } from "./hooks/useRuleBuilder";

// Types
export type {
  WorkflowData,
  ActionGroup,
  RuleGroup,
  RuleBuilderState,
  RuleBuilderProps,
  UseRuleBuilderActions,
  GeneratedWorkflow,
  DataSourceField,
  DataSourceTable,
  ExpressionValidation,
  TableSchemaIntegration,
  ConditionNodeData,
  ValueNodeData,
  OperatorNodeData,
  FunctionNodeData,
  CollectionMethodNodeData,
  ConditionNodeProps,
  ValueNodeProps,
  OperatorNodeProps,
  FunctionNodeProps,
  CollectionMethodNodeProps,
} from "./types";

// Utils
export {
  getDataSources,
  getTableProperties,
  getFieldTypes,
  getOperatorsForType,
  getFieldType,
  validateExpression,
} from "./utils/dataSourceUtils";
