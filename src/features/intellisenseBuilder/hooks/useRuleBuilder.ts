import { useState, useCallback } from "react";
import type {
  WorkflowData,
  RuleGroup,
  ActionGroup,
  RuleBuilderState,
  UseRuleBuilderActions,
  GeneratedWorkflow,
} from "../types";
import { generateRuleId, generateActionId } from "../utils/idGenerator";
import { generateWorkflowJSON } from "../utils/workflowTransformer";
import { validateWorkflow } from "../utils/validator";

const initialWorkflowData: WorkflowData = {
  workflowName: "",
  description: "",
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

  // Validate all rules using the validator utility
  const validateRules = useCallback((): string[] => {
    const result = validateWorkflow(state.workflowData, state.ruleGroups);
    return result.errors;
  }, [state.workflowData, state.ruleGroups]);

  // Add new rule group
  const addRuleGroup = useCallback(() => {
    const validationErrors = validateRules();

    if (validationErrors.length > 0) {
      setState((prev) => ({
        ...prev,
        validationErrors,
      }));
      return;
    }

    const newRuleGroup: RuleGroup = {
      id: generateRuleId(),
      ruleName: "",
      expression: "",
      actionGroups: [],
    };

    setState((prev) => ({
      ...prev,
      ruleGroups: [...prev.ruleGroups, newRuleGroup],
      validationErrors: [],
    }));
  }, [validateRules]);

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

  // Reorder rule groups
  const reorderRuleGroups = useCallback(
    (startIndex: number, endIndex: number) => {
      setState((prev) => {
        const newRuleGroups = Array.from(prev.ruleGroups);
        const [removed] = newRuleGroups.splice(startIndex, 1);
        newRuleGroups.splice(endIndex, 0, removed);

        return {
          ...prev,
          ruleGroups: newRuleGroups,
        };
      });
    },
    []
  );

  // Add action group to rule
  const addActionGroup = useCallback((ruleId: string) => {
    const newActionGroup: ActionGroup = {
      id: generateActionId(),
      actionType: "",
      expression: "",
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

  // Generate workflow JSON using the transformer utility
  const generateWorkflow = useCallback((): GeneratedWorkflow[] => {
    const workflow = generateWorkflowJSON(state.workflowData, state.ruleGroups);
    console.log("Generated Workflow:", workflow);
    return workflow;
  }, [state.workflowData, state.ruleGroups]);

  // Validate workflow before saving
  const validateWorkflowFn = useCallback((): string[] => {
    return validateRules();
  }, [validateRules]);

  const actions: UseRuleBuilderActions = {
    updateWorkflowData,
    addRuleGroup,
    updateRuleGroup,
    deleteRuleGroup,
    reorderRuleGroups,
    addActionGroup,
    updateActionGroup,
    deleteActionGroup,
    generateWorkflow,
    validateWorkflow: validateWorkflowFn,
  };

  return {
    state,
    actions,
  };
};
