// Types for Rule Builder Feature Module

export interface WorkflowData {
  workflowName: string;
  description: string;
}

export interface ActionGroup {
  id: string;
  actionType: string;
  actionName: string;
  expression?: string;
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
  onSaveToApi?: (workflow: any) => void;
  initialWorkflow?: Partial<RuleBuilderState>;
}

// Action types for hooks
export interface UseRuleBuilderActions {
  updateWorkflowData: (field: keyof WorkflowData, value: string) => void;
  addRuleGroup: () => void;
  updateRuleGroup: (ruleId: string, updates: Partial<RuleGroup>) => void;
  deleteRuleGroup: (ruleId: string) => void;
  reorderRuleGroups: (startIndex: number, endIndex: number) => void;
  addActionGroup: (ruleId: string) => void;
  updateActionGroup: (
    ruleId: string,
    actionId: string,
    updates: Partial<ActionGroup>
  ) => void;
  deleteActionGroup: (ruleId: string, actionId: string) => void;
  generateWorkflow: () => GeneratedWorkflow[];
  validateWorkflow: () => string[];
}

// Generated workflow structure
export interface GeneratedWorkflow {
  WorkflowName: string;
  Description: string;
  Rules: Array<{
    RuleName: string;
    Expression: string;
    Actions?: {
      OnSuccess: {
        Name: string;
        Context: {
          Expression: string;
        };
      };
    };
  }>;
}

export interface ActionType {
  value: string;
  label: string;
}

export const actionTypes: ActionType[] = [
  { value: "onSuccess", label: "On Success" },
  { value: "onFailure", label: "On Failure" },
  { value: "onError", label: "On Error" },
];
