// Types for Rule Builder Feature Module

export interface WorkflowData {
  workflowName: string;
  description: string;
}

export interface ActionGroup {
  id: string;
  actionType: string;
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

// Action type enum for better type safety
export enum ActionTypeEnum {
  OnSuccess = "onSuccess",
  OnFailure = "onFailure",
  OnError = "onError",
}

export interface ActionType {
  value: ActionTypeEnum;
  label: string;
}

export const actionTypes: ActionType[] = [
  { value: ActionTypeEnum.OnSuccess, label: "On Success" },
  { value: ActionTypeEnum.OnFailure, label: "On Failure" },
  { value: ActionTypeEnum.OnError, label: "On Error" },
];
