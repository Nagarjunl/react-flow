// Service layer for workflow operations

import type { GeneratedWorkflow } from "../types";
import { prepareApiData, stringifyWorkflow } from "../utils";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../constants";

export interface WorkflowServiceDependencies {
  createRuleMutation: (data: { data: any }) => Promise<any>;
  testRuleMutation: (data: { data: any }) => Promise<any>;
  dispatch: (action: any) => void;
  updateWorkflowJson: (json: string) => any;
}

export class WorkflowService {
  private deps: WorkflowServiceDependencies;

  constructor(dependencies: WorkflowServiceDependencies) {
    this.deps = dependencies;
  }

  async saveWorkflow(workflow: GeneratedWorkflow[]): Promise<void> {
    try {
      const apiData = prepareApiData(workflow);
      const result = await this.deps.createRuleMutation({ data: apiData });

      console.log("Workflow saved successfully:", result);
      alert(SUCCESS_MESSAGES.WORKFLOW_SAVED);
    } catch (error) {
      console.error("Failed to save workflow to API:", error);
      alert(ERROR_MESSAGES.SAVE_API_FAILED);
      throw error;
    }
  }

  async testWorkflow(
    workflow: GeneratedWorkflow[],
    testData: any
  ): Promise<void> {
    try {
      const workflowJson = stringifyWorkflow(workflow);

      // Dispatch the current workflowJson to store
      this.deps.dispatch(this.deps.updateWorkflowJson(workflowJson));

      // Get the current test data (excluding workflowJson)
      const { workflowJson: _, ...testDataWithoutWorkflow } = testData;

      // Prepare the test data with the generated workflowJson
      const testPayload = {
        ...testDataWithoutWorkflow,
        workflowJson: workflowJson,
      };

      console.log("Testing with payload:", testPayload);

      const result = await this.deps.testRuleMutation({ data: testPayload });
      console.log("Test API result:", result);
      alert(SUCCESS_MESSAGES.TEST_API_SUCCESS);

      return result;
    } catch (error) {
      console.error("Test API error:", error);
      alert(ERROR_MESSAGES.TEST_API_FAILED);
      throw error;
    }
  }

  generateJSON(workflow: GeneratedWorkflow[]): string {
    return stringifyWorkflow(workflow);
  }
}
