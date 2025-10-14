import React from "react";
import { Paper, Typography, TextField, Button, Alert } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import type { WorkflowData } from "../types";

interface WorkflowSidebarProps {
  workflowData: WorkflowData;
  validationErrors: string[];
  onWorkflowChange: (field: keyof WorkflowData, value: string) => void;
  onAddRule: () => void;
}

const WorkflowSidebar: React.FC<WorkflowSidebarProps> = ({
  workflowData,
  validationErrors,
  onWorkflowChange,
  onAddRule,
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
      >
        Add Rule
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
