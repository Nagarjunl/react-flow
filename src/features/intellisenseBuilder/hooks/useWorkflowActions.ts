import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../Store/StoreConfig";
import {
  useCreateRuleMutation,
  useUpdateRuleMutation,
  useTestRuleMutation,
} from "../../../Api/rulesApi";
import { updateWorkflowJson } from "../../../Store/slice/TestSlice";
import { WorkflowService } from "../services";
import type { GeneratedWorkflow } from "../types";

export const useWorkflowActions = () => {
  const dispatch = useAppDispatch();
  const testData = useAppSelector((state) => state.testData);
  const [createRuleMutation] = useCreateRuleMutation();
  const [updateRuleMutation] = useUpdateRuleMutation();
  const [testRuleMutation, { isLoading: isTestLoading }] =
    useTestRuleMutation();

  // Create workflow service instance
  const workflowService = useMemo(
    () =>
      new WorkflowService({
        createRuleMutation: (data) => createRuleMutation(data).unwrap(),
        updateRuleMutation: (data) => updateRuleMutation(data).unwrap(),
        testRuleMutation: (data) => testRuleMutation(data).unwrap(),
        dispatch,
        updateWorkflowJson,
      }),
    [createRuleMutation, updateRuleMutation, testRuleMutation, dispatch]
  );

  const saveWorkflow = async (workflow: GeneratedWorkflow[]) => {
    return workflowService.saveWorkflow(workflow);
  };

  const updateWorkflow = async (
    workflow: GeneratedWorkflow[],
    ruleId: string | number
  ) => {
    return workflowService.updateWorkflow(workflow, ruleId);
  };

  const testWorkflow = async (workflow: GeneratedWorkflow[]) => {
    return workflowService.testWorkflow(workflow, testData);
  };

  const generateJSON = (workflow: GeneratedWorkflow[]) => {
    return workflowService.generateJSON(workflow);
  };

  return {
    saveWorkflow,
    updateWorkflow,
    testWorkflow,
    generateJSON,
    isTestLoading,
  };
};
