import { useState, useEffect, useCallback } from "react";
import { Node, Edge } from "@xyflow/react";
import {
  validateAllRuleGroups,
  validateEdgeConnection,
  validateRuleGroup,
  validateAll,
  validateInitialNode,
  validateRuleGroups,
  validateActionGroups,
  validateConnections,
  validateRequiredFields,
  validateGroupingLogic,
  validateOperatorRestrictions,
  ValidationResult,
  ValidationError,
} from "../services/validationService";

export interface ValidationState {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  summary: string;
  isValidationInProgress: boolean;
}

export const useValidation = (nodes: Node[], edges: Edge[]) => {
  const [validationState, setValidationState] = useState<ValidationState>({
    isValid: true,
    errors: [],
    warnings: [],
    summary: "All validations passed",
    isValidationInProgress: false,
  });

  // Validate all rule groups
  // const validateAll = useCallback(async () => {
  //   setValidationState((prev) => ({ ...prev, isValidationInProgress: true }));

  //   try {
  //     const result = validateAllRuleGroups(nodes, edges);
  //     const summary = getValidationSummary(result);

  //     setValidationState({
  //       isValid: result.isValid,
  //       errors: result.errors,
  //       warnings: result.warnings,
  //       summary,
  //       isValidationInProgress: false,
  //     });
  //   } catch (error) {
  //     setValidationState({
  //       isValid: false,
  //       errors: [
  //         {
  //           type: "invalid_connection",
  //           message: `Validation failed: ${
  //             error instanceof Error ? error.message : "Unknown error"
  //           }`,
  //         },
  //       ],
  //       warnings: [],
  //       summary: "Validation failed",
  //       isValidationInProgress: false,
  //     });
  //   }
  // }, [nodes, edges]);

  // Comprehensive validation using all new validation functions
  const validateAllComprehensive = useCallback(async () => {
    setValidationState((prev) => ({ ...prev, isValidationInProgress: true }));

    try {
      const result = validateAll(nodes, edges);
      const summary = getValidationSummary(result);

      setValidationState({
        isValid: result.isValid,
        errors: result.errors,
        warnings: result.warnings,
        summary,
        isValidationInProgress: false,
      });
    } catch (error) {
      setValidationState({
        isValid: false,
        errors: [
          {
            type: "invalid_connection",
            message: `Validation failed: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          },
        ],
        warnings: [],
        summary: "Validation failed",
        isValidationInProgress: false,
      });
    }
  }, [nodes, edges]);

  // Individual validation functions
  const validateInitialNodeOnly = useCallback(async () => {
    try {
      return validateInitialNode(nodes, edges);
    } catch (error) {
      return {
        isValid: false,
        errors: [
          {
            type: "invalid_connection",
            message: `Initial Node validation failed: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          },
        ],
        warnings: [],
      };
    }
  }, [nodes, edges]);

  const validateRuleGroupsOnly = useCallback(async () => {
    try {
      return validateRuleGroups(nodes, edges);
    } catch (error) {
      return {
        isValid: false,
        errors: [
          {
            type: "invalid_connection",
            message: `Rule Groups validation failed: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          },
        ],
        warnings: [],
      };
    }
  }, [nodes, edges]);

  const validateActionGroupsOnly = useCallback(async () => {
    try {
      return validateActionGroups(nodes, edges);
    } catch (error) {
      return {
        isValid: false,
        errors: [
          {
            type: "invalid_connection",
            message: `Action Groups validation failed: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          },
        ],
        warnings: [],
      };
    }
  }, [nodes, edges]);

  const validateConnectionsOnly = useCallback(async () => {
    try {
      return validateConnections(nodes, edges);
    } catch (error) {
      return {
        isValid: false,
        errors: [
          {
            type: "invalid_connection",
            message: `Connections validation failed: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          },
        ],
        warnings: [],
      };
    }
  }, [nodes, edges]);

  const validateFieldsOnly = useCallback(async () => {
    try {
      return validateRequiredFields(nodes);
    } catch (error) {
      return {
        isValid: false,
        errors: [
          {
            type: "field_incomplete",
            message: `Fields validation failed: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
          },
        ],
        warnings: [],
      };
    }
  }, [nodes]);

  // Pre-add node validation
  const validateBeforeAddingNode = useCallback(
    (newNodeType: string) => {
      try {
        const fieldResult = validateRequiredFields(nodes);
        if (!fieldResult.isValid) {
          return {
            isValid: false,
            errors: fieldResult.errors,
            warnings: fieldResult.warnings,
          };
        }
        return { isValid: true, errors: [], warnings: [] };
      } catch (error) {
        return {
          isValid: false,
          errors: [
            {
              type: "field_incomplete",
              message: `Pre-add validation failed: ${
                error instanceof Error ? error.message : "Unknown error"
              }`,
            },
          ],
          warnings: [],
        };
      }
    },
    [nodes]
  );

  // Validate specific rule group
  const validateRuleGroupById = useCallback(
    async (ruleGroupId: string) => {
      try {
        const result = validateRuleGroup(ruleGroupId, nodes, edges);
        return result;
      } catch (error) {
        return {
          isValid: false,
          errors: [
            {
              type: "invalid_connection",
              message: `Validation failed for rule group ${ruleGroupId}: ${
                error instanceof Error ? error.message : "Unknown error"
              }`,
              ruleGroupId,
            },
          ],
          warnings: [],
        };
      }
    },
    [nodes, edges]
  );

  // Validate edge connection before it's created
  const validateConnection = useCallback(
    (connection: { source: string; target: string }) => {
      return validateEdgeConnection(connection, nodes, edges);
    },
    [nodes, edges]
  );

  // Get errors for a specific node
  const getNodeErrors = useCallback(
    (nodeId: string): ValidationError[] => {
      return validationState.errors.filter((error) => error.nodeId === nodeId);
    },
    [validationState.errors]
  );

  // Get errors for a specific rule group
  const getRuleGroupErrors = useCallback(
    (ruleGroupId: string): ValidationError[] => {
      return validationState.errors.filter(
        (error) => error.ruleGroupId === ruleGroupId
      );
    },
    [validationState.errors]
  );

  // Check if a specific node has errors
  const hasNodeErrors = useCallback(
    (nodeId: string): boolean => {
      return getNodeErrors(nodeId).length > 0;
    },
    [getNodeErrors]
  );

  // Check if a specific rule group has errors
  const hasRuleGroupErrors = useCallback(
    (ruleGroupId: string): boolean => {
      return getRuleGroupErrors(ruleGroupId).length > 0;
    },
    [getRuleGroupErrors]
  );

  // Auto-validate when nodes or edges change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      validateAllComprehensive();
    }, 1000); // Increased debounce time to allow node data to update

    return () => clearTimeout(timeoutId);
  }, [validateAllComprehensive]);

  return {
    validationState,
    validateAll: validateAllComprehensive,
    validateInitialNodeOnly,
    validateRuleGroupsOnly,
    validateActionGroupsOnly,
    validateConnectionsOnly,
    validateFieldsOnly,
    validateBeforeAddingNode,
    validateRuleGroupById,
    validateConnection,
    getNodeErrors,
    getRuleGroupErrors,
    hasNodeErrors,
    hasRuleGroupErrors,
  };
};

// Helper function to get validation summary
const getValidationSummary = (result: ValidationResult): string => {
  if (result.isValid) {
    return "All validations passed";
  }

  const errorCount = result.errors.length;
  const warningCount = result.warnings.length;

  if (errorCount > 0 && warningCount > 0) {
    return `${errorCount} error(s) and ${warningCount} warning(s) found`;
  } else if (errorCount > 0) {
    return `${errorCount} error(s) found`;
  } else {
    return `${warningCount} warning(s) found`;
  }
};
