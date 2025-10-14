import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Save as SaveIcon, PlayArrow as PlayIcon } from "@mui/icons-material";
import { useRuleBuilder } from "../hooks/useRuleBuilder";
import WorkflowSidebar from "../components/WorkflowSidebar";
import RuleGroupComponent from "../components/RuleGroupComponent";
import type { RuleBuilderProps } from "../types";

const RuleBuilder: React.FC<RuleBuilderProps> = ({
  onWorkflowSave,
  onWorkflowTest,
  initialWorkflow,
}) => {
  const { state, actions } = useRuleBuilder(initialWorkflow);

  const handleSave = () => {
    const workflow = actions.generateWorkflow();
    onWorkflowSave?.(workflow);
  };

  const handleTest = () => {
    const workflow = actions.generateWorkflow();
    onWorkflowTest?.(workflow);
    actions.testWorkflow();
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Card sx={{ mb: 2 }}>
        <CardHeader
          title="Rule Builder"
          subheader="Build complex workflows with rules and actions"
          action={
            <Stack direction="row" spacing={1}>
              <Tooltip title="Test Workflow">
                <IconButton onClick={handleTest} color="primary">
                  <PlayIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Save Workflow">
                <IconButton onClick={handleSave} color="success">
                  <SaveIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          }
        />
      </Card>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", gap: 2 }}>
        {/* Left Sidebar */}
        <WorkflowSidebar
          workflowData={state.workflowData}
          validationErrors={state.validationErrors}
          onWorkflowChange={actions.updateWorkflowData}
          onAddRule={actions.addRuleGroup}
        />

        {/* Right Content - Rule Groups */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {state.ruleGroups.length === 0 ? (
            <Card
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CardContent>
                <Typography variant="h6" color="text.secondary" align="center">
                  No rules added yet
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  Click "Add Rule" to start building your workflow
                </Typography>
              </CardContent>
            </Card>
          ) : (
            state.ruleGroups.map((ruleGroup) => (
              <RuleGroupComponent
                key={ruleGroup.id}
                ruleGroup={ruleGroup}
                onUpdate={actions.updateRuleGroup}
                onDelete={actions.deleteRuleGroup}
                onAddActionGroup={actions.addActionGroup}
                onUpdateActionGroup={actions.updateActionGroup}
                onDeleteActionGroup={actions.deleteActionGroup}
              />
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default RuleBuilder;
