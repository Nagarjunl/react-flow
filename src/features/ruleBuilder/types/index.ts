// Types for Rule Builder Feature Module

export interface WorkflowData {
  workflowName: string;
  description: string;
}

export interface ActionGroup {
  id: string;
  actionType: string;
  actionName: string;
}

export interface RuleGroup {
  id: string;
  ruleName: string;
  expression: string;
  actionGroups: ActionGroup[];
}

export interface RuleBuilderState {
  workflowData: WorkflowData;
  ruleGroups: RuleGroup[];
  validationErrors: string[];
}

export interface RuleBuilderProps {
  onWorkflowSave?: (workflow: any) => void;
  onWorkflowTest?: (workflow: any) => void;
  initialWorkflow?: Partial<RuleBuilderState>;
}

// Action types for hooks
export interface UseRuleBuilderActions {
  updateWorkflowData: (field: keyof WorkflowData, value: string) => void;
  addRuleGroup: () => void;
  updateRuleGroup: (ruleId: string, updates: Partial<RuleGroup>) => void;
  deleteRuleGroup: (ruleId: string) => void;
  addActionGroup: (ruleId: string) => void;
  updateActionGroup: (
    ruleId: string,
    actionId: string,
    updates: Partial<ActionGroup>
  ) => void;
  deleteActionGroup: (ruleId: string, actionId: string) => void;
  generateWorkflow: () => any;
  testWorkflow: () => void;
  clearValidationErrors: () => void;
}

// Generated workflow structure
export interface GeneratedWorkflow {
  workflowName: string;
  description: string;
  rules: Array<{
    ruleName: string;
    expression: string;
    actions: Array<{
      actionType: string;
      actionName: string;
    }>;
  }>;
}

// Data source related types
export interface DataSourceField {
  name: string;
  type: string;
}

export interface DataSourceTable {
  [tableName: string]: DataSourceField[];
}

// Expression validation
export interface ExpressionValidation {
  isValid: boolean;
  errors: string[];
}

// Table schema integration
export interface TableSchemaIntegration {
  availableTables: string[];
  getTableFields: (tableName: string) => DataSourceField[];
  getFieldType: (tableName: string, fieldName: string) => string | null;
  validateExpression: (expression: string) => ExpressionValidation;
}

// Node component types
export interface ConditionNodeData {
  id: string;
  tableName?: string;
  fieldName?: string;
}

export interface ActionNodeData {
  id: string;
  actionType?: string;
  actionName?: string;
}

export interface RuleNodeData {
  id: string;
  ruleName?: string;
}

export interface ValueNodeData {
  id: string;
  value?: string;
}

export interface OperatorNodeData {
  id: string;
  operator?: string;
  fieldType?: string;
}

export interface FunctionNodeData {
  id: string;
  functionName?: string;
  parameters?: string;
}

export interface CollectionMethodNodeData {
  id: string;
  methodName?: string;
  parameters?: string;
}

// Node component props
export interface ConditionNodeProps {
  id: string;
  tableName?: string;
  fieldName?: string;
  onUpdate: (
    id: string,
    updates: { tableName?: string; fieldName?: string }
  ) => void;
}

export interface ActionNodeProps {
  id: string;
  actionType?: string;
  actionName?: string;
  onUpdate: (
    id: string,
    updates: { actionType?: string; actionName?: string }
  ) => void;
}

export interface RuleNodeProps {
  id: string;
  ruleName?: string;
  onUpdate: (id: string, updates: { ruleName?: string }) => void;
}

export interface ValueNodeProps {
  id: string;
  value?: string;
  onUpdate: (id: string, updates: { value?: string }) => void;
}

export interface OperatorNodeProps {
  id: string;
  operator?: string;
  fieldType?: string;
  onUpdate: (id: string, updates: { operator?: string }) => void;
}

export interface FunctionNodeProps {
  id: string;
  functionName?: string;
  parameters?: string;
  onUpdate: (
    id: string,
    updates: { functionName?: string; parameters?: string }
  ) => void;
}

export interface CollectionMethodNodeProps {
  id: string;
  methodName?: string;
  parameters?: string;
  onUpdate: (
    id: string,
    updates: { methodName?: string; parameters?: string }
  ) => void;
}
