import React, { useState, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  applyNodeChanges,
  applyEdgeChanges,
  ReactFlowInstance,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  NodeMouseHandler,
  EdgeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodeComponents } from "./types/nodeTypes";
import SideBar from "./components/SideBar";
import JsonDrawer from "./components/JsonDrawer";
import ValidationPanel from "./components/ValidationPanel";
import ValidationIndicator from "./components/ValidationIndicator";
import { Box, ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { useValidation } from "./hooks/useValidation";

// Import services
import {
  addNode,
  createConditionNode,
  createOperatorNode,
} from "./services/nodeManager";
import {
  saveWorkflow,
  loadWorkflow,
  generateFlowJson,
} from "./services/fileOperations";
import {
  generateRuleEngineJsonString,
  copyToClipboard,
  downloadJsonFile,
} from "./services/jsonOperations";
import { getThemeConfig, getMiniMapConfig } from "./services/uiUtils";

// Node counter interface
interface NodeCounter {
  initial: number;
  resizableGroup: number;
  condition: number;
  action: number;
  conditionalOperator: number;
  ruleName: number;
  actionName: number;
}

// Create MUI theme using service
const theme = createTheme(getThemeConfig());

const App: React.FC = () => {
  const [nodes, setNodes] = useNodesState<Node>([]);
  const [edges, setEdges] = useEdgesState<Edge>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isJsonDrawerOpen, setIsJsonDrawerOpen] = useState<boolean>(false);
  const [generatedJson, setGeneratedJson] = useState<string>("");
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const [nodeCounter, setNodeCounter] = useState<NodeCounter>({
    initial: 0,
    resizableGroup: 0,
    condition: 0,
    action: 0,
    conditionalOperator: 0,
    ruleName: 0,
    actionName: 0,
  });

  // Validation hook
  const { validationState, validateConnection, getNodeErrors, hasNodeErrors } =
    useValidation(nodes, edges);

  const onConnect = useCallback(
    (params: Connection) => {
      // Validate connection before adding
      const validation = validateConnection(params);

      if (!validation.isValid) {
        // Show error message
        const errorMessages = validation.errors
          .map((error) => error.message)
          .join("\n");
        alert(`Invalid connection:\n${errorMessages}`);
        return;
      }

      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges, validateConnection]
  );

  const onAddConditionToGroup = useCallback(
    (parentId: string) => {
      createConditionNode(parentId, nodes, setNodes, setSelectedGroupId);
    },
    [setNodes, nodes, setSelectedGroupId]
  );

  const onAddOperatorToGroup = useCallback(
    (parentId: string) => {
      createOperatorNode(parentId, nodes, setNodes, setSelectedGroupId);
    },
    [setNodes, nodes, setSelectedGroupId]
  );

  const onAddNode = useCallback(
    (nodeType: string) => {
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
    },
    [
      nodeCounter,
      setNodes,
      selectedGroupId,
      onAddConditionToGroup,
      onAddOperatorToGroup,
    ]
  );

  const onNodeClick: NodeMouseHandler = useCallback((_event, node) => {
    // Handle group selection
    if (node.type === "resizableGroup") {
      setSelectedGroupId(node.id);
      console.log("Group selected:", node.id);
    } else {
      console.log("Node clicked:", node);
    }
  }, []);

  const onEdgeClick: EdgeMouseHandler = useCallback((_event, edge) => {
    // Handle edge click if needed
    console.log("Edge clicked:", edge);
  }, []);

  const onPaneClick = useCallback((_event: React.MouseEvent) => {
    // Deselect group when clicking on pane
    setSelectedGroupId(null);
    console.log("Pane clicked, group deselected");
  }, []);

  // React Flow nodes change handler
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => {
        // Apply React Flow changes
        let updatedNodes = applyNodeChanges(changes, nds);

        // Clear selectedGroupId if the selected group was deleted
        const deletedNodeIds = changes
          .filter((change) => change.type === "remove")
          .map((change) => change.id);

        if (selectedGroupId && deletedNodeIds.includes(selectedGroupId)) {
          setSelectedGroupId(null);
        }

        return updatedNodes;
      });
    },
    [setNodes, selectedGroupId, setSelectedGroupId]
  );

  // Standard React Flow edges change handler
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const handleGenerateJson = useCallback(() => {
    generateRuleEngineJsonString(
      nodes,
      edges,
      (jsonString: string) => {
        setGeneratedJson(jsonString);
        setIsJsonDrawerOpen(true);
      },
      (error: Error) => {
        alert(`Error generating JSON: ${error.message}`);
        console.error("JSON Generation Error:", error);
      }
    );
  }, [nodes, edges]);

  const handleCloseJsonDrawer = useCallback(() => {
    setIsJsonDrawerOpen(false);
  }, []);

  const handleJsonCopy = useCallback(() => {
    copyToClipboard(
      generatedJson,
      (message: string) => {
        console.log(message);
      },
      (error: Error) => {
        console.error("Copy failed:", error);
      }
    );
  }, [generatedJson]);

  const handleJsonDownload = useCallback(() => {
    downloadJsonFile(
      generatedJson,
      "rule-engine.json",
      (message: string) => {
        console.log(message);
      },
      (error: Error) => {
        console.error("Download failed:", error);
      }
    );
  }, [generatedJson]);

  // View Flow JSON - Shows the raw React Flow JSON in the drawer
  const handleViewFlowJson = useCallback(() => {
    generateFlowJson(
      reactFlowInstance,
      (jsonString: string) => {
        setGeneratedJson(jsonString);
        setIsJsonDrawerOpen(true);
      },
      (error: Error) => {
        console.error("Error generating flow JSON:", error);
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
      (message: string) => {
        console.log(message);
      },
      (error: Error) => {
        console.error("Error saving workflow:", error);
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
      (message: string) => {
        console.log(message);
      },
      (error: Error) => {
        console.error("Error loading workflow:", error);
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
            height: "100vh",
            width: "100vw",
            display: "flex",
            overflow: "hidden",
          }}
        >
          <SideBar
            onAddNode={onAddNode}
            onAddConditionToGroup={onAddConditionToGroup}
            onAddOperatorToGroup={onAddOperatorToGroup}
            nodes={nodes}
            edges={edges}
            selectedGroupId={selectedGroupId}
            setSelectedGroupId={setSelectedGroupId}
            onGenerateJson={handleGenerateJson}
            onLoadFromJson={handleLoadFromJson}
            onSaveFlow={handleSaveFlow}
            onViewFlowJson={handleViewFlowJson}
          />

          {/* Validation Panel */}
          <Box
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              width: 400,
              zIndex: 1000,
            }}
          >
            <ValidationPanel
              errors={validationState.errors}
              warnings={validationState.warnings}
              isValid={validationState.isValid}
              summary={validationState.summary}
              isValidationInProgress={validationState.isValidationInProgress}
              onErrorClick={(error) => {
                console.log("Error clicked:", error);
                // You can add logic to highlight the specific node or edge
              }}
            />
          </Box>

          <Box
            sx={{
              flex: 1,
              position: "relative",
              // backgroundColor: '#f0f0f0'
            }}
          >
            <ReactFlow
              nodes={nodes.map((node) => {
                // Add visual highlighting for selected groups
                if (
                  node.type === "resizableGroup" &&
                  node.id === selectedGroupId
                ) {
                  return {
                    ...node,
                    data: {
                      ...node.data,
                      border: "3px solid #22c55e",
                      boxShadow: "0 0 10px rgba(34, 197, 94, 0.5)",
                    },
                  };
                }

                // Add validation error highlighting
                if (hasNodeErrors(node.id)) {
                  return {
                    ...node,
                    data: {
                      ...node.data,
                      border: "2px solid #ef4444",
                      boxShadow: "0 0 8px rgba(239, 68, 68, 0.5)",
                    },
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

              {/* Validation Indicators Overlay */}
              {nodes.map((node) => {
                const nodeErrors = getNodeErrors(node.id);
                if (nodeErrors.length === 0) return null;

                return (
                  <ValidationIndicator
                    key={`validation-${node.id}`}
                    nodeId={node.id}
                    errors={nodeErrors}
                    warnings={[]}
                    position="top-right"
                    size="small"
                    onErrorClick={(error) => {
                      console.log("Validation error clicked:", error);
                    }}
                  />
                );
              })}
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
};

export default App;
