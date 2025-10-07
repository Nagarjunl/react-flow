import React, { useState, useCallback } from 'react';
import { ReactFlow, Background, Controls, MiniMap, addEdge, useNodesState, useEdgesState, ReactFlowProvider, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { nodeComponents } from './types/nodeTypes';
import SideBar from './components/SideBar';
import JsonDrawer from './components/JsonDrawer';
import { generateRuleEngineJson } from './services/jsonGenerator';
import { Box, ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// Create MUI theme
const theme = createTheme({
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
});

export default function App() {
    const [nodes, setNodes] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [isJsonDrawerOpen, setIsJsonDrawerOpen] = useState(false);
    const [generatedJson, setGeneratedJson] = useState('');
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [nodeCounter, setNodeCounter] = useState({
        initial: 0,
        resizableGroup: 0,
        condition: 0,
        action: 0,
        conditionalOperator: 0
    });

    const onConnect = useCallback((params) => {
        setEdges((eds) => addEdge(params, eds));
    }, [setEdges]);

    const onAddConditionToGroup = useCallback((parentId) => {
        // Validate that the parent group still exists
        const parentExists = nodes.some(node => node.id === parentId && node.type === 'resizableGroup');
        if (!parentExists) {
            alert('The selected group no longer exists. Please select a valid group first.');
            setSelectedGroupId(null);
            return;
        }

        const conditionId = `condition-${Date.now()}`;
        const conditionNode = {
            id: conditionId,
            type: 'condition',
            position: { x: 20, y: 80 }, // Relative to parent group
            parentId: parentId,
            extent: 'parent',
            data: {
                onChange: (newData) => {
                    setNodes((nds) =>
                        nds.map((node) =>
                            node.id === conditionId
                                ? { ...node, data: { ...node.data, ...newData } }
                                : node
                        )
                    );
                },
                selectedTable: '',
                selectedField: '',
                expression: '',
                value: '',
                isValid: false
            }
        };

        setNodes((nds) => [...nds, conditionNode]);
    }, [setNodes, nodes, setSelectedGroupId]);

    const onAddOperatorToGroup = useCallback((parentId) => {
        // Validate that the parent group still exists
        const parentExists = nodes.some(node => node.id === parentId && node.type === 'resizableGroup');
        if (!parentExists) {
            alert('The selected group no longer exists. Please select a valid group first.');
            setSelectedGroupId(null);
            return;
        }

        const operatorId = `conditionalOperator-${Date.now()}`;
        const operatorNode = {
            id: operatorId,
            type: 'conditionalOperator',
            position: { x: 20, y: 120 }, // Position below conditions
            parentId: parentId,
            extent: 'parent',
            data: {
                onChange: (newData) => {
                    setNodes((nds) =>
                        nds.map((node) =>
                            node.id === operatorId
                                ? { ...node, data: { ...node.data, ...newData } }
                                : node
                        )
                    );
                },
                operator: '',
                isValid: false
            }
        };

        setNodes((nds) => [...nds, operatorNode]);
    }, [setNodes, nodes, setSelectedGroupId]);

    const onAddNode = useCallback((nodeType) => {
        // Handle condition node with context awareness
        if (nodeType === 'condition') {
            if (!selectedGroupId) {
                alert('Please select a group first by clicking on a Rule or Action group, then add a condition.');
                return;
            }
            // Add condition to selected group
            onAddConditionToGroup(selectedGroupId);
            return;
        }

        // Handle conditional operator node with context awareness
        if (nodeType === 'conditionalOperator') {
            if (!selectedGroupId) {
                alert('Please select a group first by clicking on a Rule or Action group, then add an operator.');
                return;
            }
            // Add operator to selected group
            onAddOperatorToGroup(selectedGroupId);
            return;
        }

        const newNodeId = `${nodeType}-${nodeCounter[nodeType] + 1}`;
        const newCounter = { ...nodeCounter, [nodeType]: nodeCounter[nodeType] + 1 };
        setNodeCounter(newCounter);

        // Calculate position (20px spacing)
        const baseX = 400; // Moved further right to avoid overlap with Rule Groups
        const baseY = 100;
        const nodeIndex = newCounter[nodeType] - 1;

        const position = {
            x: baseX + (nodeIndex * 320),
            y: baseY + (nodeIndex * 120)
        };

        let newNodes = [];

        if (nodeType === 'resizableGroup') {
            // Create Rule group container with resizable functionality
            const ruleGroupId = `resizableRuleGroup-${nodeCounter.resizableGroup + 1}`;
            const newCounter = { ...nodeCounter, resizableGroup: nodeCounter.resizableGroup + 1 };
            setNodeCounter(newCounter);
            const ruleGroup = {
                id: ruleGroupId,
                type: 'resizableGroup',
                position: { x: 50, y: 50 }, // Fixed position to avoid covering viewport
                parentId: selectedGroupId || undefined, // Nest under selected group if available
                extent: selectedGroupId ? 'parent' : undefined, // Set extent if nested
                style: {
                    width: 300,
                    height: 200
                },
                data: {
                    label: 'Rule Group',
                    backgroundColor: 'rgba(139, 92, 246, 0.05)',
                    border: '2px solid #8b5cf6'
                }
            };

            // Create Rule Name child node
            const ruleNameId = `${ruleGroupId}-name`;
            const ruleNameNode = {
                id: ruleNameId,
                type: 'ruleName',
                position: { x: 10, y: 10 }, // Relative to parent
                parentId: ruleGroupId,
                extent: 'parent',
                data: {
                    ruleName: '',
                    isValid: false,
                    onChange: (newData) => {
                        setNodes((nds) =>
                            nds.map((node) =>
                                node.id === ruleGroupId
                                    ? { ...node, data: { ...node.data, ...newData } }
                                    : node
                            )
                        );
                    }
                }
            };

            newNodes = [ruleGroup, ruleNameNode];
            setSelectedGroupId(ruleGroupId); // Auto-select the new group
        } else if (nodeType === 'action') {
            // Create Action group container with resizable functionality
            const actionGroupId = `resizableActionGroup-${nodeCounter.resizableGroup + 1}`;
            const newCounter = { ...nodeCounter, resizableGroup: nodeCounter.resizableGroup + 1 };
            setNodeCounter(newCounter);

            const actionGroup = {
                id: actionGroupId,
                type: 'resizableGroup',
                position: { x: 20, y: 150 }, // Position within parent if selected
                parentId: selectedGroupId || undefined, // Nest under selected group if available
                extent: selectedGroupId ? 'parent' : undefined, // Set extent if nested
                style: {
                    width: 300,
                    height: 200
                },
                data: {
                    label: 'Action Group',
                    backgroundColor: 'rgba(239, 68, 68, 0.05)',
                    border: '2px solid #ef4444'
                }
            };

            // Create Action Name child node
            const actionNameId = `${actionGroupId}-name`;
            const actionNameNode = {
                id: actionNameId,
                type: 'actionName',
                position: { x: 10, y: 10 }, // Relative to parent
                parentId: actionGroupId,
                extent: 'parent', // This is crucial for proper parent-child relationship
                data: {
                    actionType: 'onSuccess', // Fixed case to match actionTypes
                    actionName: '',
                    isValid: false,
                    onChange: (newData) => {
                        setNodes((nds) =>
                            nds.map((node) =>
                                node.id === actionGroupId
                                    ? { ...node, data: { ...node.data, ...newData } }
                                    : node
                            )
                        );
                    }
                }
            };

            newNodes = [actionGroup, actionNameNode];
            setSelectedGroupId(actionGroupId); // Auto-select the new group
        } else {
            // For initial, conditionalOperator, and other nodes
            const newNode = {
                id: newNodeId,
                type: nodeType,
                position,
                data: {
                    onChange: (newData) => {
                        setNodes((nds) =>
                            nds.map((node) =>
                                node.id === newNodeId
                                    ? { ...node, data: { ...node.data, ...newData } }
                                    : node
                            )
                        );
                    }
                }
            };

            newNodes = [newNode];
        }

        setNodes((nds) => [...nds, ...newNodes]);
    }, [nodeCounter, setNodes, selectedGroupId, onAddConditionToGroup, onAddOperatorToGroup]);

    const onNodeClick = useCallback((event, node) => {
        // Handle group selection
        if (node.type === 'resizableGroup') {
            setSelectedGroupId(node.id);
            console.log('Group selected:', node.id);
        } else {
            console.log('Node clicked:', node);
        }
    }, []);

    const onEdgeClick = useCallback((event, edge) => {
        // Handle edge click if needed
        console.log('Edge clicked:', edge);
    }, []);

    const onPaneClick = useCallback(() => {
        // Deselect group when clicking on pane
        setSelectedGroupId(null);
        console.log('Pane clicked, group deselected');
    }, []);

    // Standard React Flow nodes change handler with orphaned node cleanup
    const onNodesChange = useCallback((changes) => {
        setNodes((nds) => {
            // First apply the standard React Flow changes
            let updatedNodes = applyNodeChanges(changes, nds);
            return updatedNodes;
        });
    }, [setNodes, setSelectedGroupId]);

    // Standard React Flow edges change handler
    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );

    const handleGenerateJson = useCallback(() => {
        try {
            const jsonData = generateRuleEngineJson(nodes, edges);
            const jsonString = JSON.stringify(jsonData, null, 2);
            setGeneratedJson(jsonString);
            setIsJsonDrawerOpen(true);
        } catch (error) {
            alert(`Error generating JSON: ${error.message}`);
            console.error('JSON Generation Error:', error);
        }
    }, [nodes, edges]);

    const handleCloseJsonDrawer = useCallback(() => {
        setIsJsonDrawerOpen(false);
    }, []);

    const handleJsonCopy = useCallback(() => {
        console.log('JSON copied to clipboard');
    }, []);

    const handleJsonDownload = useCallback(() => {
        console.log('JSON downloaded');
    }, []);

    // View Flow JSON - Shows the raw React Flow JSON in the drawer
    const handleViewFlowJson = useCallback(() => {
        if (reactFlowInstance) {
            try {
                const flowJson = reactFlowInstance.toObject();
                const jsonString = JSON.stringify(flowJson, null, 2);
                setGeneratedJson(jsonString);
                setIsJsonDrawerOpen(true);
            } catch (error) {
                console.error('Error generating flow JSON:', error);
                alert(`Error generating flow JSON: ${error.message}`);
            }
        } else {
            alert('Flow instance not available. Please try again.');
        }
    }, [reactFlowInstance, setGeneratedJson, setIsJsonDrawerOpen]);

    // Save Flow - Downloads combined workflow file (ruleJson + flowJson)
    const handleSaveFlow = useCallback(() => {
        if (reactFlowInstance) {
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
                const blob = new Blob([JSON.stringify(combinedData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'workflow.json';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                console.log('Workflow saved successfully');
            } catch (error) {
                console.error('Error saving workflow:', error);
                alert(`Error saving workflow: ${error.message}`);
            }
        }
    }, [reactFlowInstance, nodes, edges]);

    // Load from JSON - Restores complete workflow from file
    const handleLoadFromJson = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.style.display = 'none';

        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);

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

                        console.log('Workflow loaded successfully');
                    } else if (data.WorkflowName && data.Rules) {
                        // Rule Engine JSON format - show error since we only support combined files now
                        console.log('Rule engine JSON detected');
                        alert('This file contains only rule engine JSON. Please use a combined workflow file (with both ruleJson and flowJson) for full restoration.');
                    } else {
                        alert('Invalid file format. Please select a valid workflow file.');
                    }
                } catch (error) {
                    console.error('Error loading workflow:', error);
                    alert(`Error loading workflow: ${error.message}`);
                }
            };

            reader.readAsText(file);
        };

        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    }, [reactFlowInstance, setNodes, setEdges]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ReactFlowProvider>
                <Box
                    sx={{
                        height: '100vh',
                        width: '100vw',
                        display: 'flex',
                        overflow: 'hidden'
                    }}
                >
                    <SideBar
                        onAddNode={onAddNode}
                        onAddConditionToGroup={onAddConditionToGroup}
                        onAddOperatorToGroup={onAddOperatorToGroup}
                        nodes={nodes}
                        selectedGroupId={selectedGroupId}
                        setSelectedGroupId={setSelectedGroupId}
                        onGenerateJson={handleGenerateJson}
                        onLoadFromJson={handleLoadFromJson}
                        onSaveFlow={handleSaveFlow}
                        onViewFlowJson={handleViewFlowJson}
                    />

                    <Box
                        sx={{
                            flex: 1,
                            position: 'relative',
                            // backgroundColor: '#f0f0f0'
                        }}
                    >
                        <ReactFlow
                            nodes={nodes.map(node => {
                                // Add visual highlighting for selected groups
                                if (node.type === 'resizableGroup' && node.id === selectedGroupId) {
                                    return {
                                        ...node,
                                        data: {
                                            ...node.data,
                                            border: '3px solid #22c55e',
                                            boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)'
                                        }
                                    };
                                }
                                return node;
                            })}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onNodeClick={onNodeClick}
                            onEdgeClick={onEdgeClick}
                            onPaneClick={onPaneClick}
                            onInit={setReactFlowInstance}
                            nodeTypes={nodeComponents}
                            nodesDraggable={true}
                            nodesConnectable={true}
                            elementsSelectable={true}
                            fitView
                            attributionPosition="bottom-left"
                        >
                            <Background color="#f0f0f0" />
                            <Controls />
                            <MiniMap
                                nodeColor={(n) => {
                                    switch (n.type) {
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
                                            // Action name nodes - red accent
                                            return '#10b981';
                                        default:
                                            return '#6b7280';
                                    }
                                }}
                                nodeStrokeColor={(n) => {
                                    switch (n.type) {
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
                                }}
                                nodeBorderRadius={3}
                                nodeStrokeWidth={2}
                                zoomable
                                pannable
                                style={{
                                    backgroundColor: 'rgba(17, 24, 39, 0.8)',
                                    border: '1px solid #374151'
                                }}
                            />
                        </ReactFlow>
                    </Box>

                    {/* JSON Drawer */}
                    <JsonDrawer
                        isOpen={isJsonDrawerOpen}
                        onClose={handleCloseJsonDrawer}
                        jsonData={generatedJson}
                        onCopy={handleJsonCopy}
                        onDownload={handleJsonDownload}
                    />
                </Box>
            </ReactFlowProvider>
        </ThemeProvider>
    );
}