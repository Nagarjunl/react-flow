/**
 * File Operations Service
 * Handles file save, load, and download operations
 */

import type { ReactFlowInstance } from "@xyflow/react";
import { generateRuleEngineJson } from "./jsonGenerator";

/**
 * Downloads a file with the given content and filename
 */
export const downloadFile = (
  content: string,
  filename: string,
  mimeType: string = "application/json"
): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Creates a file input element and triggers file selection
 */
export const createFileInput = (
  onFileSelect: (file: File) => void,
  accept: string = ".json"
): void => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = accept;
  input.style.display = "none";

  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  document.body.appendChild(input);
  input.click();
  document.body.removeChild(input);
};

/**
 * Reads a file as text
 */
export const readFileAsText = (
  file: File,
  onSuccess: (content: string) => void,
  onError: (error: Error) => void
): void => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
      onSuccess(content);
    } catch (error) {
      onError(error as Error);
    }
  };
  reader.onerror = () => onError(new Error("Failed to read file"));
  reader.readAsText(file);
};

/**
 * Saves a workflow file (combined ruleJson + flowJson)
 */
export const saveWorkflow = (
  reactFlowInstance: ReactFlowInstance | null,
  nodes: any[],
  edges: any[],
  onSuccess: (message: string) => void,
  onError: (error: Error) => void
): void => {
  if (!reactFlowInstance) {
    onError(new Error("Flow instance not available"));
    return;
  }

  try {
    // 1. Generate Rule Engine JSON
    const ruleJson = generateRuleEngineJson(nodes, edges);

    // 2. Generate React Flow JSON using core method
    const flowJson = reactFlowInstance.toObject();

    // 3. Create combined data structure
    const combinedData = {
      ruleJson: ruleJson,
      flowJson: flowJson,
    };

    // 4. Download file
    const content = JSON.stringify(combinedData, null, 2);
    downloadFile(content, "workflow.json");

    onSuccess("Workflow saved successfully");
  } catch (error) {
    onError(error as Error);
  }
};

/**
 * Loads a workflow from a JSON file
 */
export const loadWorkflow = (
  reactFlowInstance: ReactFlowInstance | null,
  setNodes: (nodes: any[]) => void,
  setEdges: (edges: any[]) => void,
  onSuccess: (message: string) => void,
  onError: (error: Error) => void
): void => {
  createFileInput((file: File) => {
    readFileAsText(
      file,
      (content: string) => {
        try {
          const data = JSON.parse(content);

          if (data.ruleJson && data.flowJson) {
            // Combined file format - restore using core React Flow methods
            console.log("Loading workflow file");

            const { x = 0, y = 0, zoom = 1 } = data.flowJson.viewport || {};
            setNodes(data.flowJson.nodes || []);
            setEdges(data.flowJson.edges || []);

            // Restore viewport using core method
            setTimeout(() => {
              if (reactFlowInstance) {
                reactFlowInstance.setViewport({ x, y, zoom });
              }
            }, 100);

            onSuccess("Workflow loaded successfully");
          } else if (data.WorkflowName && data.Rules) {
            // Rule Engine JSON format - show error since we only support combined files now
            console.log("Rule engine JSON detected");
            onError(
              new Error(
                "This file contains only rule engine JSON. Please use a combined workflow file (with both ruleJson and flowJson) for full restoration."
              )
            );
          } else {
            onError(
              new Error(
                "Invalid file format. Please select a valid workflow file."
              )
            );
          }
        } catch (error) {
          onError(error as Error);
        }
      },
      onError
    );
  });
};

/**
 * Generates and downloads React Flow JSON
 */
export const downloadFlowJson = (
  reactFlowInstance: ReactFlowInstance | null,
  onSuccess: (message: string) => void,
  onError: (error: Error) => void
): void => {
  if (!reactFlowInstance) {
    onError(new Error("Flow instance not available"));
    return;
  }

  try {
    const flowJson = reactFlowInstance.toObject();
    const content = JSON.stringify(flowJson, null, 2);
    downloadFile(content, "flow.json");
    onSuccess("Flow JSON downloaded successfully");
  } catch (error) {
    onError(error as Error);
  }
};

/**
 * Generates React Flow JSON for display
 */
export const generateFlowJson = (
  reactFlowInstance: ReactFlowInstance | null,
  onSuccess: (jsonString: string) => void,
  onError: (error: Error) => void
): void => {
  if (!reactFlowInstance) {
    onError(new Error("Flow instance not available"));
    return;
  }

  try {
    const flowJson = reactFlowInstance.toObject();
    const jsonString = JSON.stringify(flowJson, null, 2);
    onSuccess(jsonString);
  } catch (error) {
    onError(error as Error);
  }
};
