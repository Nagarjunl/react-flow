/**
 * JSON Operations Service
 * Handles JSON generation, manipulation, and clipboard operations
 */

import { generateRuleEngineJson } from "./jsonGenerator";

/**
 * Generates rule engine JSON from nodes and edges
 */
export const generateRuleEngineJsonString = (
  nodes: any[],
  edges: any[],
  onSuccess: (jsonString: string) => void,
  onError: (error: Error) => void
): void => {
  try {
    const jsonData = generateRuleEngineJson(nodes, edges);
    const jsonString = JSON.stringify(jsonData, null, 2);
    onSuccess(jsonString);
  } catch (error) {
    onError(error as Error);
  }
};

/**
 * Copies text to clipboard
 */
export const copyToClipboard = (
  text: string,
  onSuccess: (message: string) => void,
  onError: (error: Error) => void
): void => {
  if (navigator.clipboard && window.isSecureContext) {
    // Use modern clipboard API
    navigator.clipboard
      .writeText(text)
      .then(() => {
        onSuccess("Text copied to clipboard");
      })
      .catch((error) => {
        onError(error);
      });
  } else {
    // Fallback for older browsers
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (successful) {
        onSuccess("Text copied to clipboard");
      } else {
        onError(new Error("Failed to copy text"));
      }
    } catch (error) {
      onError(error as Error);
    }
  }
};

/**
 * Downloads JSON content as a file
 */
export const downloadJsonFile = (
  jsonString: string,
  filename: string = "data.json",
  onSuccess: (message: string) => void,
  onError: (error: Error) => void
): void => {
  try {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onSuccess(`JSON file downloaded as ${filename}`);
  } catch (error) {
    onError(error as Error);
  }
};

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

/**
 * Validates JSON string
 */
export const validateJson = (jsonString: string): ValidationResult => {
  try {
    JSON.parse(jsonString);
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: (error as Error).message };
  }
};

/**
 * Formats JSON string with proper indentation
 */
export const formatJson = (jsonString: string, indent: number = 2): string => {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed, null, indent);
  } catch (error) {
    return jsonString; // Return original if parsing fails
  }
};

/**
 * Minifies JSON string
 */
export const minifyJson = (jsonString: string): string => {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed);
  } catch (error) {
    return jsonString; // Return original if parsing fails
  }
};

/**
 * Gets file size in human readable format
 */
export const getFileSize = (content: string): string => {
  const bytes = new Blob([content]).size;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
};

/**
 * Creates a JSON preview with truncated content
 */
export const createJsonPreview = (
  jsonString: string,
  maxLength: number = 200
): string => {
  if (jsonString.length <= maxLength) {
    return jsonString;
  }
  return jsonString.substring(0, maxLength) + "...";
};
