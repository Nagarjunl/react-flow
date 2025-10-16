// Utility functions for generating unique IDs

export const generateRuleId = (): string => {
  return `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateActionId = (): string => {
  return `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateWorkflowId = (): string => {
  return `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
