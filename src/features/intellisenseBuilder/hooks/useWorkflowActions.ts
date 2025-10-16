import { useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../Store/StoreConfig";
import {
  useCreateRuleMutation,
  useTestRuleMutation,
} from "../../../Api/rulesApi";
import { updateWorkflowJson } from "../../../Store/slice/TestSlice";
import { WorkflowService } from "../services";
import type { GeneratedWorkflow } from "../types";
import { ERROR_MESSAGES } from "../constants";

export const useWorkflowActions = () => {
  const dispatch = useAppDispatch();
  const testData = useAppSelector((state) => state.testData);
  const [createRuleMutation] = useCreateRuleMutation();
  const [testRuleMutation, { isLoading: isTestLoading }] =
    useTestRuleMutation();

  // Create workflow service instance
  const workflowService = useMemo(
    () =>
      new WorkflowService({
        createRuleMutation: (data) => createRuleMutation(data).unwrap(),
        testRuleMutation: (data) => testRuleMutation(data).unwrap(),
        dispatch,
        updateWorkflowJson,
      }),
    [createRuleMutation, testRuleMutation, dispatch]
  );

  const saveWorkflow = useCallback(
    async (workflow: GeneratedWorkflow[]) => {
      return workflowService.saveWorkflow(workflow);
    },
    [workflowService]
  );

  const testWorkflow = useCallback(
    async (workflow: GeneratedWorkflow[]) => {
      return workflowService.testWorkflow(workflow, testData);
    },
    [workflowService, testData]
  );

  const saveWorkflowWithValidation = useCallback(
    async (workflow: GeneratedWorkflow[], validationErrors: string[]) => {
      if (validationErrors.length > 0) {
        alert(ERROR_MESSAGES.getValidationErrors(validationErrors));
        return;
      }
      return saveWorkflow(workflow);
    },
    [saveWorkflow]
  );

  const generateJSON = useCallback(
    (workflow: GeneratedWorkflow[]) => {
      return workflowService.generateJSON(workflow);
    },
    [workflowService]
  );

  return {
    saveWorkflow,
    testWorkflow,
    saveWorkflowWithValidation,
    generateJSON,
    isTestLoading,
  };
};
