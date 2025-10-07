/**
 * File Operations Service
 * Handles file save, load, and download operations
 */

import { generateRuleEngineJson } from './jsonGenerator';

/**
 * Downloads a file with the given content and filename
 * @param {string} content - File content
 * @param {string} filename - Name of the file to download
 * @param {string} mimeType - MIME type of the file
 */
export const downloadFile = (content, filename, mimeType = 'application/json') => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * Creates a file input element and triggers file selection
 * @param {Function} onFileSelect - Callback function when file is selected
 * @param {string} accept - File types to accept
 */
export const createFileInput = (onFileSelect, accept = '.json') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.style.display = 'none';

    input.onchange = (e) => {
        const file = e.target.files[0];
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
 * @param {File} file - File to read
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const readFileAsText = (file, onSuccess, onError) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const content = e.target.result;
            onSuccess(content);
        } catch (error) {
            onError(error);
        }
    };
    reader.onerror = onError;
    reader.readAsText(file);
};

/**
 * Saves a workflow file (combined ruleJson + flowJson)
 * @param {Object} reactFlowInstance - React Flow instance
 * @param {Array} nodes - Current nodes
 * @param {Array} edges - Current edges
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const saveWorkflow = (reactFlowInstance, nodes, edges, onSuccess, onError) => {
    if (!reactFlowInstance) {
        onError(new Error('Flow instance not available'));
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
            flowJson: flowJson
        };

        // 4. Download file
        const content = JSON.stringify(combinedData, null, 2);
        downloadFile(content, 'workflow.json');

        onSuccess('Workflow saved successfully');
    } catch (error) {
        onError(error);
    }
};

/**
 * Loads a workflow from a JSON file
 * @param {Object} reactFlowInstance - React Flow instance
 * @param {Function} setNodes - Function to update nodes
 * @param {Function} setEdges - Function to update edges
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const loadWorkflow = (reactFlowInstance, setNodes, setEdges, onSuccess, onError) => {
    createFileInput((file) => {
        readFileAsText(
            file,
            (content) => {
                try {
                    const data = JSON.parse(content);

                    if (data.ruleJson && data.flowJson) {
                        // Combined file format - restore using core React Flow methods
                        console.log('Loading workflow file');

                        const { x = 0, y = 0, zoom = 1 } = data.flowJson.viewport || {};
                        setNodes(data.flowJson.nodes || []);
                        setEdges(data.flowJson.edges || []);

                        // Restore viewport using core method
                        setTimeout(() => {
                            if (reactFlowInstance) {
                                reactFlowInstance.setViewport({ x, y, zoom });
                            }
                        }, 100);

                        onSuccess('Workflow loaded successfully');
                    } else if (data.WorkflowName && data.Rules) {
                        // Rule Engine JSON format - show error since we only support combined files now
                        console.log('Rule engine JSON detected');
                        onError(new Error('This file contains only rule engine JSON. Please use a combined workflow file (with both ruleJson and flowJson) for full restoration.'));
                    } else {
                        onError(new Error('Invalid file format. Please select a valid workflow file.'));
                    }
                } catch (error) {
                    onError(error);
                }
            },
            onError
        );
    });
};

/**
 * Generates and downloads React Flow JSON
 * @param {Object} reactFlowInstance - React Flow instance
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const downloadFlowJson = (reactFlowInstance, onSuccess, onError) => {
    if (!reactFlowInstance) {
        onError(new Error('Flow instance not available'));
        return;
    }

    try {
        const flowJson = reactFlowInstance.toObject();
        const content = JSON.stringify(flowJson, null, 2);
        downloadFile(content, 'flow.json');
        onSuccess('Flow JSON downloaded successfully');
    } catch (error) {
        onError(error);
    }
};

/**
 * Generates React Flow JSON for display
 * @param {Object} reactFlowInstance - React Flow instance
 * @param {Function} onSuccess - Success callback with JSON string
 * @param {Function} onError - Error callback
 */
export const generateFlowJson = (reactFlowInstance, onSuccess, onError) => {
    if (!reactFlowInstance) {
        onError(new Error('Flow instance not available'));
        return;
    }

    try {
        const flowJson = reactFlowInstance.toObject();
        const jsonString = JSON.stringify(flowJson, null, 2);
        onSuccess(jsonString);
    } catch (error) {
        onError(error);
    }
};
