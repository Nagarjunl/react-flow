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

  // Validate all rules
  const validateRules = useCallback((): string[] => {
    const errors: string[] = [];

    // Check if workflow name is provided
    if (!state.workflowData.workflowName.trim()) {
      errors.push("Workflow name is required");
    }

    // Check each rule group
    state.ruleGroups.forEach((rule, index) => {
      if (!rule.ruleName.trim()) {
        errors.push(`Rule ${index + 1}: Rule name is required`);
      }
      if (!rule.expression.trim()) {
        errors.push(`Rule ${index + 1}: Rule expression is required`);
      }

      // Check each action group within the rule
      rule.actionGroups.forEach((action, actionIndex) => {
        if (!action.actionType.trim()) {
          errors.push(
            `Rule ${index + 1}, Action ${
              actionIndex + 1
            }: Action type is required`
          );
        }
        if (!action.expression?.trim()) {
          errors.push(
            `Rule ${index + 1}, Action ${
              actionIndex + 1
            }: Action expression is required`
          );
        }
      });
    });

    return errors;
  }, [state.workflowData.workflowName, state.ruleGroups]);

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
      id: `action_${Date.now()}`,
      actionType: "",
      actionName: "",
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

  // Generate workflow JSON
  const generateWorkflow = useCallback((): GeneratedWorkflow[] => {
    const workflow: GeneratedWorkflow[] = [
      {
        WorkflowName: state.workflowData.workflowName,
        Description: state.workflowData.description,
        Rules: state.ruleGroups.map((rule) => {
          const baseRule = {
            RuleName: rule.ruleName,
            Expression: rule.expression,
          };

          // Only include Actions if there are action groups
          if (
            rule.actionGroups.length > 0 &&
            rule.actionGroups[0]?.actionType
          ) {
            return {
              ...baseRule,
              Actions: {
                OnSuccess: {
                  Name: rule.actionGroups[0].actionType,
                  Context: {
                    Expression: rule.actionGroups[0]?.expression || "",
                  },
                },
              },
            };
          }

          return baseRule;
        }),
      },
    ];

    console.log("Generated Workflow:", workflow);
    return workflow;
  }, [state.workflowData, state.ruleGroups]);

  // Validate workflow before saving
  const validateWorkflow = useCallback((): string[] => {
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
    validateWorkflow,
  };

  return {
    state,
    actions,
  };
};
