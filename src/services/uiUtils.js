/**
 * UI Utilities Service
 * Handles UI styling, theming, and utility functions
 */

/**
 * Gets the color for MiniMap nodes based on node type
 * @param {Object} node - React Flow node
 * @returns {string} Hex color code
 */
export const getMiniMapNodeColor = (node) => {
    switch (node.type) {
        case 'resizableGroup':
            // Rule groups - purple theme
            return '#8b5cf6';
        case 'initial':
            // Initial nodes - blue theme
            return '#3b82f6';
        case 'condition':
            // Condition nodes - red theme
            return '#ef4444';
        case 'action':
            // Action nodes - green theme
            return '#10b981';
        case 'conditionalOperator':
            // Operator nodes - orange theme
            return '#f97316';
        case 'ruleName':
            // Rule name nodes - purple accent
            return '#a855f7';
        case 'actionName':
            // Action name nodes - green accent
            return '#10b981';
        default:
            return '#6b7280';
    }
};

/**
 * Gets the stroke color for MiniMap nodes based on node type
 * @param {Object} node - React Flow node
 * @returns {string} Hex color code
 */
export const getMiniMapNodeStrokeColor = (node) => {
    switch (node.type) {
        case 'resizableGroup':
            return '#6d28d9';
        case 'initial':
            return '#1d4ed8';
        case 'condition':
            return '#dc2626';
        case 'action':
            return '#ea580c';
        case 'conditionalOperator':
            return '#059669';
        case 'ruleName':
            return '#7c3aed';
        case 'actionName':
            return '#b91c1c';
        default:
            return '#374151';
    }
};

/**
 * Gets the background color for MiniMap
 * @returns {string} CSS background color
 */
export const getMiniMapBackgroundColor = () => {
    return 'rgba(17, 24, 39, 0.8)';
};

/**
 * Gets the border style for MiniMap
 * @returns {string} CSS border style
 */
export const getMiniMapBorderStyle = () => {
    return '1px solid #374151';
};

/**
 * Gets the border radius for MiniMap nodes
 * @returns {number} Border radius in pixels
 */
export const getMiniMapNodeBorderRadius = () => {
    return 3;
};

/**
 * Gets the stroke width for MiniMap nodes
 * @returns {number} Stroke width in pixels
 */
export const getMiniMapNodeStrokeWidth = () => {
    return 2;
};

/**
 * Gets the background color for the main flow area
 * @returns {string} Hex color code
 */
export const getFlowBackgroundColor = () => {
    return '#f0f0f0';
};

/**
 * Gets the MiniMap style object
 * @returns {Object} Style object for MiniMap
 */
export const getMiniMapStyle = () => {
    return {
        backgroundColor: getMiniMapBackgroundColor(),
        border: getMiniMapBorderStyle()
    };
};

/**
 * Gets the MiniMap configuration object
 * @returns {Object} MiniMap configuration
 */
export const getMiniMapConfig = () => {
    return {
        nodeColor: getMiniMapNodeColor,
        nodeStrokeColor: getMiniMapNodeStrokeColor,
        nodeBorderRadius: getMiniMapNodeBorderRadius(),
        nodeStrokeWidth: getMiniMapNodeStrokeWidth(),
        zoomable: true,
        pannable: true,
        style: getMiniMapStyle()
    };
};

/**
 * Gets the color for different node types in the main flow
 * @param {string} nodeType - Type of node
 * @returns {Object} Color configuration object
 */
export const getNodeTypeColors = (nodeType) => {
    const colorMap = {
        resizableGroup: {
            background: 'rgba(139, 92, 246, 0.05)',
            border: '2px solid #8b5cf6',
            selectedBorder: '3px solid #22c55e',
            selectedShadow: '0 0 10px rgba(34, 197, 94, 0.5)'
        },
        action: {
            background: 'rgba(239, 68, 68, 0.05)',
            border: '2px solid #ef4444'
        },
        initial: {
            background: '#3b82f6',
            color: 'white'
        },
        condition: {
            background: '#ef4444',
            color: 'white'
        },
        conditionalOperator: {
            background: '#f97316',
            color: 'white'
        }
    };

    return colorMap[nodeType] || {};
};

/**
 * Gets the theme configuration for Material-UI
 * @returns {Object} MUI theme configuration
 */
export const getThemeConfig = () => {
    return {
        palette: {
            mode: 'dark',
            primary: {
                main: '#3b82f6',
            },
            secondary: {
                main: '#8b5cf6',
            },
            background: {
                // default: '#f9fafb',
            },
        },
        typography: {
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                    },
                },
            },
        },
    };
};

/**
 * Gets the MiniMap node color configuration for different variants
 * @param {string} variant - Color variant ('light', 'dark', 'colorful')
 * @returns {Function} Node color function
 */
export const getMiniMapNodeColorVariant = (variant = 'default') => {
    const variants = {
        light: (node) => {
            const lightColors = {
                resizableGroup: '#e0e7ff',
                initial: '#dbeafe',
                condition: '#fecaca',
                action: '#bbf7d0',
                conditionalOperator: '#fed7aa',
                ruleName: '#e9d5ff',
                actionName: '#bbf7d0'
            };
            return lightColors[node.type] || '#f3f4f6';
        },
        dark: (node) => {
            const darkColors = {
                resizableGroup: '#4c1d95',
                initial: '#1e40af',
                condition: '#dc2626',
                action: '#059669',
                conditionalOperator: '#ea580c',
                ruleName: '#7c3aed',
                actionName: '#059669'
            };
            return darkColors[node.type] || '#374151';
        },
        colorful: (node) => {
            const colorfulColors = {
                resizableGroup: '#ff6b6b',
                initial: '#4ecdc4',
                condition: '#45b7d1',
                action: '#96ceb4',
                conditionalOperator: '#feca57',
                ruleName: '#ff9ff3',
                actionName: '#54a0ff'
            };
            return colorfulColors[node.type] || '#a4b0be';
        },
        default: getMiniMapNodeColor
    };

    return variants[variant] || variants.default;
};

/**
 * Validates if a color is a valid hex color
 * @param {string} color - Color string to validate
 * @returns {boolean} True if valid hex color
 */
export const isValidHexColor = (color) => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

/**
 * Converts hex color to RGB
 * @param {string} hex - Hex color string
 * @returns {Object} RGB object with r, g, b properties
 */
export const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

/**
 * Gets contrasting text color (black or white) for a given background color
 * @param {string} backgroundColor - Background color in hex format
 * @returns {string} '#000000' or '#ffffff'
 */
export const getContrastingTextColor = (backgroundColor) => {
    const rgb = hexToRgb(backgroundColor);
    if (!rgb) return '#000000';

    // Calculate luminance
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
};
