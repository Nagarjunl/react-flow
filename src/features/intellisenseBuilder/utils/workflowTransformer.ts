// Utility functions for transforming workflow data

import type { WorkflowData, RuleGroup, GeneratedWorkflow } from "../types";

export const generateWorkflowJSON = (
  workflowData: WorkflowData,
  ruleGroups: RuleGroup[]
): GeneratedWorkflow[] => {
  const workflow: GeneratedWorkflow[] = [
    {
      WorkflowName: workflowData.workflowName,
      Description: workflowData.description,
      Rules: ruleGroups.map((rule) => {
        const baseRule = {
          RuleName: rule.ruleName,
          Expression: rule.expression,
        };

        // Only include Actions if there are action groups
        if (rule.actionGroups.length > 0 && rule.actionGroups[0]?.actionType) {
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

  return workflow;
};

export const stringifyWorkflow = (workflow: GeneratedWorkflow[]): string => {
  return JSON.stringify(workflow, null, 2);
};

export const prepareApiData = (workflow: GeneratedWorkflow[]) => {
  return {
    name: workflow[0].WorkflowName,
    description: workflow[0].Description,
    ruleJson: stringifyWorkflow(workflow),
    isActive: true,
  };
};
