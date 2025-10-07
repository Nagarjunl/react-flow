/**
 * JSON Operations Service
 * Handles JSON generation, manipulation, and clipboard operations
 */

import { generateRuleEngineJson } from './jsonGenerator';

/**
 * Generates rule engine JSON from nodes and edges
 * @param {Array} nodes - Current nodes
 * @param {Array} edges - Current edges
 * @param {Function} onSuccess - Success callback with JSON string
 * @param {Function} onError - Error callback
 */
export const generateRuleEngineJsonString = (nodes, edges, onSuccess, onError) => {
    try {
        const jsonData = generateRuleEngineJson(nodes, edges);
        const jsonString = JSON.stringify(jsonData, null, 2);
        onSuccess(jsonString);
    } catch (error) {
        onError(error);
    }
};

/**
 * Copies text to clipboard
 * @param {string} text - Text to copy
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const copyToClipboard = (text, onSuccess, onError) => {
    if (navigator.clipboard && window.isSecureContext) {
        // Use modern clipboard API
        navigator.clipboard.writeText(text)
            .then(() => {
                onSuccess('Text copied to clipboard');
            })
            .catch((error) => {
                onError(error);
            });
    } else {
        // Fallback for older browsers
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);

            if (successful) {
                onSuccess('Text copied to clipboard');
            } else {
                onError(new Error('Failed to copy text'));
            }
        } catch (error) {
            onError(error);
        }
    }
};

/**
 * Downloads JSON content as a file
 * @param {string} jsonString - JSON string to download
 * @param {string} filename - Name of the file (default: 'data.json')
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const downloadJsonFile = (jsonString, filename = 'data.json', onSuccess, onError) => {
    try {
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        onSuccess(`JSON file downloaded as ${filename}`);
    } catch (error) {
        onError(error);
    }
};

/**
 * Validates JSON string
 * @param {string} jsonString - JSON string to validate
 * @returns {Object} Validation result with isValid and error properties
 */
export const validateJson = (jsonString) => {
    try {
        JSON.parse(jsonString);
        return { isValid: true, error: null };
    } catch (error) {
        return { isValid: false, error: error.message };
    }
};

/**
 * Formats JSON string with proper indentation
 * @param {string} jsonString - JSON string to format
 * @param {number} indent - Number of spaces for indentation (default: 2)
 * @returns {string} Formatted JSON string
 */
export const formatJson = (jsonString, indent = 2) => {
    try {
        const parsed = JSON.parse(jsonString);
        return JSON.stringify(parsed, null, indent);
    } catch (error) {
        return jsonString; // Return original if parsing fails
    }
};

/**
 * Minifies JSON string
 * @param {string} jsonString - JSON string to minify
 * @returns {string} Minified JSON string
 */
export const minifyJson = (jsonString) => {
    try {
        const parsed = JSON.parse(jsonString);
        return JSON.stringify(parsed);
    } catch (error) {
        return jsonString; // Return original if parsing fails
    }
};

/**
 * Gets file size in human readable format
 * @param {string} content - Content to measure
 * @returns {string} Human readable file size
 */
export const getFileSize = (content) => {
    const bytes = new Blob([content]).size;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Creates a JSON preview with truncated content
 * @param {string} jsonString - JSON string to preview
 * @param {number} maxLength - Maximum length for preview (default: 200)
 * @returns {string} Truncated JSON string
 */
export const createJsonPreview = (jsonString, maxLength = 200) => {
    if (jsonString.length <= maxLength) {
        return jsonString;
    }
    return jsonString.substring(0, maxLength) + '...';
};
