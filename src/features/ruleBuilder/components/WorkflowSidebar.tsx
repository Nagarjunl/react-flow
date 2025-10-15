import React from "react";
import { Paper, Typography, TextField, Button, Alert } from "@mui/material";
import {
  Add as AddIcon,
  Description as GenerateIcon,
} from "@mui/icons-material";
import type { WorkflowData } from "../types";

interface WorkflowSidebarProps {
  workflowData: WorkflowData;
  validationErrors: string[];
  onWorkflowChange: (field: keyof WorkflowData, value: string) => void;
  onAddRule: () => void;
  onGenerateJson: () => void;
}

const WorkflowSidebar: React.FC<WorkflowSidebarProps> = ({
  workflowData,
  validationErrors,
  onWorkflowChange,
  onAddRule,
  onGenerateJson,
}) => {
  return (
    <Paper
      sx={{
        width: 350,
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Workflow Details
      </Typography>

      <TextField
        label="Workflow Name *"
        value={workflowData.workflowName}
        onChange={(e) => onWorkflowChange("workflowName", e.target.value)}
        fullWidth
        size="small"
        required
      />

      <TextField
        label="Description"
        value={workflowData.description}
        onChange={(e) => onWorkflowChange("description", e.target.value)}
        fullWidth
        multiline
        rows={3}
        size="small"
      />

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAddRule}
        disabled={!workflowData.workflowName.trim()}
        fullWidth
        sx={{
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          color: "white",
          fontSize: "0.875rem",
          fontWeight: 600,
          textTransform: "none",
          py: 1.5,
          mb: 1,
          "&:hover": {
            background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
            transform: "translateY(-1px)",
            boxShadow: "0 4px 8px rgba(16, 185, 129, 0.3)",
          },
        }}
      >
        Add Rule
      </Button>

      <Button
        variant="contained"
        startIcon={<GenerateIcon />}
        onClick={onGenerateJson}
        disabled={!workflowData.workflowName.trim()}
        fullWidth
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

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {validationErrors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </Alert>
      )}
    </Paper>
  );
};

export default WorkflowSidebar;
