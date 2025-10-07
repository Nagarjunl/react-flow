import React, { useState, useCallback } from 'react';
import { ReactFlow, Background, Controls, MiniMap, addEdge, useNodesState, useEdgesState, ReactFlowProvider, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { nodeComponents } from './types/nodeTypes';
import SideBar from './components/SideBar';
import JsonDrawer from './components/JsonDrawer';
import { Box, ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// Import services
import { addNode, createConditionNode, createOperatorNode } from './services/nodeManager';
import { saveWorkflow, loadWorkflow, generateFlowJson } from './services/fileOperations';
import { generateRuleEngineJsonString, copyToClipboard, downloadJsonFile } from './services/jsonOperations';
import { getThemeConfig, getMiniMapConfig } from './services/uiUtils';

// Create MUI theme using service
const theme = createTheme(getThemeConfig());

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
        createConditionNode(parentId, nodes, setNodes, setSelectedGroupId);
    }, [setNodes, nodes, setSelectedGroupId]);

    const onAddOperatorToGroup = useCallback((parentId) => {
        createOperatorNode(parentId, nodes, setNodes, setSelectedGroupId);
    }, [setNodes, nodes, setSelectedGroupId]);

    const onAddNode = useCallback((nodeType) => {
        addNode(
            nodeType,
            nodeCounter,
            selectedGroupId,
            setNodeCounter,
            setNodes,
            setSelectedGroupId,
            onAddConditionToGroup,
            onAddOperatorToGroup
        );
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
    }, [setNodes]);

    // Standard React Flow edges change handler
    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );

    const handleGenerateJson = useCallback(() => {
        generateRuleEngineJsonString(
            nodes,
            edges,
            (jsonString) => {
                setGeneratedJson(jsonString);
                setIsJsonDrawerOpen(true);
            },
            (error) => {
                alert(`Error generating JSON: ${error.message}`);
                console.error('JSON Generation Error:', error);
            }
        );
    }, [nodes, edges]);

    const handleCloseJsonDrawer = useCallback(() => {
        setIsJsonDrawerOpen(false);
    }, []);

    const handleJsonCopy = useCallback(() => {
        copyToClipboard(
            generatedJson,
            (message) => {
                console.log(message);
            },
            (error) => {
                console.error('Copy failed:', error);
            }
        );
    }, [generatedJson]);

    const handleJsonDownload = useCallback(() => {
        downloadJsonFile(
            generatedJson,
            'rule-engine.json',
            (message) => {
                console.log(message);
            },
            (error) => {
                console.error('Download failed:', error);
            }
        );
    }, [generatedJson]);

    // View Flow JSON - Shows the raw React Flow JSON in the drawer
    const handleViewFlowJson = useCallback(() => {
        generateFlowJson(
            reactFlowInstance,
            (jsonString) => {
                setGeneratedJson(jsonString);
                setIsJsonDrawerOpen(true);
            },
            (error) => {
                console.error('Error generating flow JSON:', error);
                alert(`Error generating flow JSON: ${error.message}`);
            }
        );
    }, [reactFlowInstance, setGeneratedJson, setIsJsonDrawerOpen]);

    // Save Flow - Downloads combined workflow file (ruleJson + flowJson)
    const handleSaveFlow = useCallback(() => {
        saveWorkflow(
            reactFlowInstance,
            nodes,
            edges,
            (message) => {
                console.log(message);
            },
            (error) => {
                console.error('Error saving workflow:', error);
                alert(`Error saving workflow: ${error.message}`);
            }
        );
    }, [reactFlowInstance, nodes, edges]);

    // Load from JSON - Restores complete workflow from file
    const handleLoadFromJson = useCallback(() => {
        loadWorkflow(
            reactFlowInstance,
            setNodes,
            setEdges,
            (message) => {
                console.log(message);
            },
            (error) => {
                console.error('Error loading workflow:', error);
                alert(`Error loading workflow: ${error.message}`);
            }
        );
    }, [reactFlowInstance, setNodes, setEdges]);

    // Get MiniMap configuration from service
    const miniMapConfig = getMiniMapConfig();

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
                            <MiniMap {...miniMapConfig} />
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