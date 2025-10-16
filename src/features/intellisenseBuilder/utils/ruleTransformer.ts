// Data transformation utilities for rule editing

import type { RuleType } from "../../../Api/rulesApi";
import type {
  RuleBuilderState,
  WorkflowData,
  RuleGroup,
  ActionGroup,
  GeneratedWorkflow,
} from "../types";

/**
 * Transform API rule data to internal RuleBuilderState format
 */
export const transformApiRuleToBuilderState = (
  apiRule: RuleType
): RuleBuilderState => {
  try {
    // Parse the ruleJson string
    const workflowData: GeneratedWorkflow[] = apiRule.ruleJson
      ? JSON.parse(apiRule.ruleJson)
      : [];

    if (workflowData.length === 0) {
      // Return empty state if no workflow data
      return {
        workflowData: {
          workflowName: apiRule.name || "",
          description: apiRule.description || "",
        },
        ruleGroups: [],
        validationErrors: [],
      };
    }

    const firstWorkflow = workflowData[0];

    // Transform workflow data
    const workflowDataTransformed: WorkflowData = {
      workflowName: firstWorkflow.WorkflowName || apiRule.name || "",
      description: firstWorkflow.Description || apiRule.description || "",
    };

    // Transform rules
    const ruleGroups: RuleGroup[] =
      firstWorkflow.Rules?.map((rule, index) => {
        const ruleGroup: RuleGroup = {
          id: `rule_${Date.now()}_${index}`, // Generate new ID for editing
          ruleName: rule.RuleName || "",
          expression: rule.Expression || "",
          actionGroups: [],
        };

        // Transform actions if they exist
        if (rule.Actions?.OnSuccess) {
          const actionGroup: ActionGroup = {
            id: `action_${Date.now()}_${index}`,
            actionType: rule.Actions.OnSuccess.Name || "onSuccess",
            expression: rule.Actions.OnSuccess.Context?.Expression || "",
          };
          ruleGroup.actionGroups.push(actionGroup);
        }

        return ruleGroup;
      }) || [];

    return {
      workflowData: workflowDataTransformed,
      ruleGroups,
      validationErrors: [],
    };
  } catch (error) {
    // Return fallback state
    return {
      workflowData: {
        workflowName: apiRule.name || "",
        description: apiRule.description || "",
      },
      ruleGroups: [],
      validationErrors: [
        "Failed to parse rule data. Please check the rule format.",
      ],
    };
  }
};

/**
 * Transform internal RuleBuilderState back to API format
 */
export const transformBuilderStateToApiRule = (
  builderState: RuleBuilderState,
  originalRuleId?: string | number
): Partial<RuleType> => {
  try {
    // Generate workflow data
    const workflow: GeneratedWorkflow[] = [
      {
        WorkflowName: builderState.workflowData.workflowName,
        Description: builderState.workflowData.description,
        Rules: builderState.ruleGroups.map((ruleGroup) => {
          const baseRule = {
            RuleName: ruleGroup.ruleName,
            Expression: ruleGroup.expression,
          };

          // Add actions if they exist
          if (
            ruleGroup.actionGroups.length > 0 &&
            ruleGroup.actionGroups[0]?.actionType
          ) {
            return {
              ...baseRule,
              Actions: {
                OnSuccess: {
                  Name: ruleGroup.actionGroups[0].actionType,
                  Context: {
                    Expression: ruleGroup.actionGroups[0]?.expression || "",
                  },
                },
              },
            };
          }

          return baseRule;
        }),
      },
    ];

    return {
      id: originalRuleId,
      name: builderState.workflowData.workflowName,
      description: builderState.workflowData.description,
      ruleJson: JSON.stringify(workflow),
      isActive: true, // Default to active when updating
    };
  } catch (error) {
    throw new Error("Failed to transform rule data for API");
  }
};

/**
 * Check if a rule has valid data for editing
 */
export const isValidRuleForEditing = (apiRule: RuleType): boolean => {
  try {
    if (!apiRule.ruleJson) return false;

    const workflowData: GeneratedWorkflow[] = JSON.parse(apiRule.ruleJson);
    return Array.isArray(workflowData) && workflowData.length > 0;
  } catch {
    return false;
  }
};

/**
 * Extract rule ID from URL parameters
 */
export const extractRuleIdFromUrl = (
  searchParams: URLSearchParams
): string | number | null => {
  const ruleId = searchParams.get("editRuleId");
  if (!ruleId) return null;

  // Try to parse as number first, fallback to string
  const numericId = Number(ruleId);
  return isNaN(numericId) ? ruleId : numericId;
};
