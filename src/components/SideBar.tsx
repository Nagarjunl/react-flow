import React from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Alert,
} from "@mui/material";
import {
  Save as SaveIcon,
  Description as GenerateIcon,
  Upload as LoadIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  Link as LinkIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import type { Node, Edge } from "@xyflow/react";

// Node type definition for the sidebar
interface NodeType {
  type: string;
  label: string;
  icon: string;
  color: string;
}

// Group interface for available groups
interface Group {
  id: string;
  label: string;
}

// Props interface for SideBar component
interface SideBarProps {
  onAddNode: (nodeType: string) => void;
  onAddConditionToGroup: (groupId: string) => void;
  onAddOperatorToGroup: (groupId: string) => void;
  nodes: Node[];
  edges: Edge[];
  selectedGroupId: string | null;
  setSelectedGroupId: (groupId: string | null) => void;
  onGenerateJson: () => void;
  onLoadFromJson: () => void;
  onSaveFlow: () => void;
  onSaveToApi: () => void;
  onViewFlowJson: () => void;
}

const SideBar: React.FC<SideBarProps> = ({
  onAddNode,
  onAddConditionToGroup,
  onAddOperatorToGroup,
  nodes,
  edges,
  selectedGroupId,
  setSelectedGroupId,
  onGenerateJson,
  onLoadFromJson,
  onSaveFlow,
  onSaveToApi,
  onViewFlowJson,
}) => {
  const nodeTypes: NodeType[] = [
    {
      type: "initial",
      label: "Initial Node",
      icon: "🚀",
      color: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    },
    // {
    //     type: 'ruleName',
    //     label: 'Rule Name',
    //     icon: '📋',
    //     color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    // },
    {
      type: "resizableGroup",
      label: "Rule Group",
      icon: "📦",
      color: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    },
    {
      type: "condition",
      label: "Condition",
      icon: "🔍",
      color: "red",
    },
    {
      type: "action",
      label: "Action",
      icon: "⚡",
      color: "#10b981",
    },
    {
      type: "conditionalOperator",
      label: "Operator",
      icon: "🔗",
      color: "orange",
    },
    // {
    //     type: 'actionName',
    //     label: 'Action Name',
    //     icon: '📝',
    //     color: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)'
    // }
  ];

  // Get available groups for selection
  const availableGroups: Group[] = nodes
    .filter((node) => node.type === "resizableGroup")
    .map((node) => ({
      id: node.id,
      label:
        (node.data?.label as string) ||
        (node.id.startsWith("resizableRuleGroup")
          ? "Rule Group"
          : "Action Group"),
    }));

  const selectedGroup = availableGroups.find(
    (group) => group.id === selectedGroupId
  );

  return (
    <Box
      sx={{
        width: 280,
        p: 2.5,
        borderRight: "2px solid #e5e7eb",
        backgroundColor: "#f9fafb",
        height: "100vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* Header */}
      <Typography
        variant="h5"
        sx={{
          color: "#1f2937",
          fontSize: "1.125rem",
          fontWeight: "bold",
          mb: 1,
        }}
      >
        Rule Engine Builder
      </Typography>

      {/* Main Action Buttons */}
      <Paper
        elevation={3}
        sx={{
          p: 2,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: 2,
          border: "2px solid #4f46e5",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "white",
            fontSize: "1rem",
            fontWeight: "bold",
            textAlign: "center",
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          🚀 Workflow Actions
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {/* Save Flow Button */}
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={onSaveFlow}
            sx={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "white",
              fontSize: "0.875rem",
              fontWeight: 600,
              textTransform: "none",
              py: 1.5,
              "&:hover": {
                background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 8px rgba(16, 185, 129, 0.3)",
              },
            }}
          >
            Save Flow
          </Button>

          {/* Generate JSON Button */}
          <Button
            variant="contained"
            startIcon={<GenerateIcon />}
            onClick={onGenerateJson}
            sx={{
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              color: "white",
              fontSize: "0.875rem",
              fontWeight: 600,
              textTransform: "none",
              py: 1.5,
              "&:hover": {
                background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 8px rgba(245, 158, 11, 0.3)",
              },
            }}
          >
            Generate JSON
          </Button>

          {/* Load from JSON Button */}
          <Button
            variant="contained"
            startIcon={<LoadIcon />}
            onClick={onLoadFromJson}
            sx={{
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              color: "white",
              fontSize: "0.875rem",
              fontWeight: 600,
              textTransform: "none",
              py: 1.5,
              "&:hover": {
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 8px rgba(59, 130, 246, 0.3)",
              },
            }}
          >
            Load from JSON
          </Button>

          {/* View Flow JSON Button */}
          <Button
            variant="contained"
            startIcon={<ViewIcon />}
            onClick={onViewFlowJson}
            sx={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
              color: "white",
              fontSize: "0.875rem",
              fontWeight: 600,
              textTransform: "none",
              py: 1.5,
              "&:hover": {
                background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 8px rgba(139, 92, 246, 0.3)",
              },
            }}
          >
            View Flow JSON
          </Button>

          {/* Save to API Button */}
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={onSaveToApi}
            sx={{
              background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
              color: "white",
              fontSize: "0.875rem",
              fontWeight: 600,
              textTransform: "none",
              py: 1.5,
              "&:hover": {
                background: "linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 8px rgba(220, 38, 38, 0.3)",
              },
            }}
          >
            Save to API
          </Button>
        </Box>

        <Typography
          variant="caption"
          sx={{
            display: "block",
            color: "rgba(255, 255, 255, 0.8)",
            textAlign: "center",
            mt: 1,
            fontSize: "0.6875rem",
          }}
        >
          Save: Download | Generate: Show JSON | Load: Restore | View: Flow JSON
          | Save to API: Send to Server
        </Typography>
      </Paper>

      {/* Node Types Section */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          backgroundColor: "#f8fafc",
          borderRadius: 2,
          border: "1px solid #e2e8f0",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            color: "#374151",
            fontSize: "0.875rem",
            fontWeight: "bold",
            mb: 2,
          }}
        >
          Add Nodes:
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {nodeTypes.map((nodeType) => (
            <Button
              key={nodeType.type}
              onClick={() => onAddNode(nodeType.type)}
              variant="contained"
              sx={{
                background: nodeType.color,
                color: "white",
                fontSize: "0.75rem",
                fontWeight: 500,
                textTransform: "none",
                py: 1.25,
                px: 2,
                justifyContent: "flex-start",
                gap: 1,
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              <span style={{ fontSize: "0.875rem" }}>{nodeType.icon}</span>
              {nodeType.label}
            </Button>
          ))}
        </Box>
      </Paper>

      {/* Selected Group Indicator */}
      {selectedGroup && (
        <Alert
          severity="warning"
          sx={{
            backgroundColor: "#fef3c7",
            border: "2px solid #f59e0b",
            "& .MuiAlert-icon": {
              color: "#92400e",
            },
            "& .MuiAlert-message": {
              color: "#92400e",
            },
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: "bold",
              fontSize: "0.875rem",
              color: "#92400e",
              mb: 0.5,
            }}
          >
            Selected Group:
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.75rem",
              color: "#92400e",
              fontWeight: 500,
            }}
          >
            {selectedGroup.label}
          </Typography>
        </Alert>
      )}

      {/* Add Condition to Group Section */}
      {selectedGroup && (
        <Paper
          elevation={1}
          sx={{
            p: 2,
            backgroundColor: "#f0fdf4",
            borderRadius: 2,
            border: "1px solid #bbf7d0",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: "#166534",
              fontSize: "0.875rem",
              fontWeight: "bold",
              mb: 2,
            }}
          >
            Add to Selected Group:
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => onAddConditionToGroup(selectedGroup.id)}
              sx={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "white",
                fontSize: "0.75rem",
                fontWeight: 500,
                textTransform: "none",
                py: 1.25,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #059669 0%, #047857 100%)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 2px 6px rgba(16, 185, 129, 0.3)",
                },
              }}
            >
              Add Condition
            </Button>

            <Button
              variant="contained"
              startIcon={<LinkIcon />}
              onClick={() => onAddOperatorToGroup(selectedGroup.id)}
              sx={{
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                color: "white",
                fontSize: "0.75rem",
                fontWeight: 500,
                textTransform: "none",
                py: 1.25,
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 2px 6px rgba(245, 158, 11, 0.3)",
                },
              }}
            >
              Add Operator
            </Button>
          </Box>
        </Paper>
      )}

      {/* Available Groups Section */}
      {availableGroups.length > 0 && (
        <Paper
          elevation={1}
          sx={{
            p: 2,
            backgroundColor: "#fef7ff",
            borderRadius: 2,
            border: "1px solid #e9d5ff",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: "#7c3aed",
              fontSize: "0.875rem",
              fontWeight: "bold",
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <GroupIcon fontSize="small" />
            Available Groups:
          </Typography>

          <List dense>
            {availableGroups.map((group) => (
              <ListItem key={group.id} disablePadding>
                <ListItemButton
                  onClick={() => setSelectedGroupId(group.id)}
                  selected={selectedGroupId === group.id}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    backgroundColor:
                      selectedGroupId === group.id ? "#7c3aed" : "transparent",
                    color: selectedGroupId === group.id ? "white" : "#374151",
                    "&:hover": {
                      backgroundColor:
                        selectedGroupId === group.id ? "#6d28d9" : "#e5e7eb",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "#7c3aed",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#6d28d9",
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary={group.label}
                    primaryTypographyProps={{
                      fontSize: "0.6875rem",
                      fontWeight: 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Nodes and Edges Count Display */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          backgroundColor: "#f1f5f9",
          borderRadius: 2,
          border: "1px solid #cbd5e1",
          mt: "auto", // Push to bottom
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            color: "#475569",
            fontSize: "0.75rem",
            fontWeight: "bold",
            mb: 1,
            textAlign: "center",
          }}
        >
          📊 Flow Statistics
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
          <Chip
            label={`Nodes: ${nodes.length}`}
            size="small"
            sx={{
              backgroundColor: "#3b82f6",
              color: "white",
              fontSize: "0.6875rem",
              fontWeight: 600,
              "& .MuiChip-label": {
                px: 1,
              },
            }}
          />
          <Chip
            label={`Edges: ${edges.length}`}
            size="small"
            sx={{
              backgroundColor: "#10b981",
              color: "white",
              fontSize: "0.6875rem",
              fontWeight: 600,
              "& .MuiChip-label": {
                px: 1,
              },
            }}
          />
        </Box>

        <Typography
          variant="caption"
          sx={{
            display: "block",
            color: "#64748b",
            textAlign: "center",
            mt: 1,
            fontSize: "0.625rem",
          }}
        >
          Total elements in flow
        </Typography>
      </Paper>
    </Box>
  );
};

export default SideBar;
