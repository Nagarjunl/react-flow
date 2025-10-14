import { useState, useCallback } from "react";
import type {
  WorkflowData,
  RuleGroup,
  ActionGroup,
  RuleBuilderState,
  UseRuleBuilderActions,
  GeneratedWorkflow,
} from "../types";

const initialWorkflowData: WorkflowData = {
  workflowName: "",
  description: "",
};

const defaultState: RuleBuilderState = {
  workflowData: initialWorkflowData,
  ruleGroups: [],
  validationErrors: [],
};

export const useRuleBuilder = (initialState?: Partial<RuleBuilderState>) => {
  const [state, setState] = useState<RuleBuilderState>({
    ...initialState,
    workflowData: initialState?.workflowData || initialWorkflowData,
    ruleGroups: initialState?.ruleGroups || [],
    validationErrors: initialState?.validationErrors || [],
  });

  // Handle workflow data changes
  const updateWorkflowData = useCallback(
    (field: keyof WorkflowData, value: string) => {
      setState((prev) => ({
        ...prev,
        workflowData: {
          ...prev.workflowData,
          [field]: value,
        },
      }));
    },
    []
  );

  // Add new rule group
  const addRuleGroup = useCallback(() => {
    if (!state.workflowData.workflowName.trim()) {
      setState((prev) => ({
        ...prev,
        validationErrors: ["Workflow name is required to add rules"],
      }));
      return;
    }

    const newRuleGroup: RuleGroup = {
      id: `rule_${Date.now()}`,
      ruleName: "",
      expression: "",
      actionGroups: [],
    };

    setState((prev) => ({
      ...prev,
      ruleGroups: [...prev.ruleGroups, newRuleGroup],
      validationErrors: [],
    }));
  }, [state.workflowData.workflowName]);

  // Update rule group
  const updateRuleGroup = useCallback(
    (ruleId: string, updates: Partial<RuleGroup>) => {
      setState((prev) => ({
        ...prev,
        ruleGroups: prev.ruleGroups.map((rule) =>
          rule.id === ruleId ? { ...rule, ...updates } : rule
        ),
      }));
    },
    []
  );

  // Delete rule group
  const deleteRuleGroup = useCallback((ruleId: string) => {
    setState((prev) => ({
      ...prev,
      ruleGroups: prev.ruleGroups.filter((rule) => rule.id !== ruleId),
    }));
  }, []);

  // Add action group to rule
  const addActionGroup = useCallback((ruleId: string) => {
    const newActionGroup: ActionGroup = {
      id: `action_${Date.now()}`,
      actionType: "",
      actionName: "",
    };

    setState((prev) => ({
      ...prev,
      ruleGroups: prev.ruleGroups.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              actionGroups: [...rule.actionGroups, newActionGroup],
            }
          : rule
      ),
    }));
  }, []);

  // Update action group
  const updateActionGroup = useCallback(
    (ruleId: string, actionId: string, updates: Partial<ActionGroup>) => {
      setState((prev) => ({
        ...prev,
        ruleGroups: prev.ruleGroups.map((rule) =>
          rule.id === ruleId
            ? {
                ...rule,
                actionGroups: rule.actionGroups.map((action) =>
                  action.id === actionId ? { ...action, ...updates } : action
                ),
              }
            : rule
        ),
      }));
    },
    []
  );

  // Delete action group
  const deleteActionGroup = useCallback((ruleId: string, actionId: string) => {
    setState((prev) => ({
      ...prev,
      ruleGroups: prev.ruleGroups.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              actionGroups: rule.actionGroups.filter(
                (action) => action.id !== actionId
              ),
            }
          : rule
      ),
    }));
  }, []);

  // Generate workflow JSON
  const generateWorkflow = useCallback((): GeneratedWorkflow => {
    const workflow: GeneratedWorkflow = {
      workflowName: state.workflowData.workflowName,
      description: state.workflowData.description,
      rules: state.ruleGroups.map((rule) => ({
        ruleName: rule.ruleName,
        expression: rule.expression,
        actions: rule.actionGroups.map((action) => ({
          actionType: action.actionType,
          actionName: action.actionName,
        })),
      })),
    };

    console.log("Generated Workflow:", workflow);
    return workflow;
  }, [state.workflowData, state.ruleGroups]);

  // Test workflow
  const testWorkflow = useCallback(() => {
    const workflow = generateWorkflow();
    console.log("Testing Workflow:", workflow);
    // In a real implementation, you would send this to a test endpoint
  }, [generateWorkflow]);

  // Clear validation errors
  const clearValidationErrors = useCallback(() => {
    setState((prev) => ({
      ...prev,
      validationErrors: [],
    }));
  }, []);

  // Reset state
  const resetState = useCallback(() => {
    setState(defaultState);
  }, []);

  const actions: UseRuleBuilderActions = {
    updateWorkflowData,
    addRuleGroup,
    updateRuleGroup,
    deleteRuleGroup,
    addActionGroup,
    updateActionGroup,
    deleteActionGroup,
    generateWorkflow,
    testWorkflow,
    clearValidationErrors,
  };

  return {
    state,
    actions,
    resetState,
  };
};
