// Validation utility functions

import type { WorkflowData, RuleGroup } from "../types";
import { VALIDATION_MESSAGES } from "../constants/messages";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateWorkflowData = (
  workflowData: WorkflowData
): ValidationResult => {
  const errors: string[] = [];

  if (!workflowData.workflowName.trim()) {
    errors.push(VALIDATION_MESSAGES.WORKFLOW_NAME_REQUIRED);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateRuleGroup = (
  rule: RuleGroup,
  ruleIndex: number
): ValidationResult => {
  const errors: string[] = [];

  if (!rule.ruleName.trim()) {
    errors.push(VALIDATION_MESSAGES.getRuleError(ruleIndex, "Rule name"));
  }

  if (!rule.expression.trim()) {
    errors.push(VALIDATION_MESSAGES.getRuleError(ruleIndex, "Rule expression"));
  }

  // Validate action groups
  rule.actionGroups.forEach((action, actionIndex) => {
    if (!action.actionType.trim()) {
      errors.push(
        VALIDATION_MESSAGES.getActionError(
          ruleIndex,
          actionIndex,
          "Action type"
        )
      );
    }
    if (!action.expression?.trim()) {
      errors.push(
        VALIDATION_MESSAGES.getActionError(
          ruleIndex,
          actionIndex,
          "Action expression"
        )
      );
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateWorkflow = (
  workflowData: WorkflowData,
  ruleGroups: RuleGroup[]
): ValidationResult => {
  const errors: string[] = [];

  // Validate workflow data
  const workflowValidation = validateWorkflowData(workflowData);
  errors.push(...workflowValidation.errors);

  // Validate each rule group
  ruleGroups.forEach((rule, index) => {
    const ruleValidation = validateRuleGroup(rule, index);
    errors.push(...ruleValidation.errors);
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};
