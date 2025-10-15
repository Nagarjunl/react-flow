import React, { useState } from "react";
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
import JsonDrawer from "../../../components/JsonDrawer";
import { useCreateRuleMutation } from "../../../Api/rulesApi";
import type { RuleBuilderProps } from "../types";

const RuleBuilder: React.FC<RuleBuilderProps> = ({
  onWorkflowSave,
  onWorkflowTest,
  initialWorkflow,
}) => {
  const { state, actions } = useRuleBuilder(initialWorkflow);
  const [isJsonDrawerOpen, setIsJsonDrawerOpen] = useState(false);
  const [generatedJson, setGeneratedJson] = useState("");
  const [createRuleMutation] = useCreateRuleMutation();

  const handleSave = () => {
    const workflow = actions.generateWorkflow();
    onWorkflowSave?.(workflow);
  };

  const handleTest = () => {
    const workflow = actions.generateWorkflow();
    onWorkflowTest?.(workflow);
    actions.testWorkflow();
  };

  const handleGenerateJson = () => {
    const workflow = actions.generateWorkflow();
    const jsonString = JSON.stringify(workflow, null, 2);
    setGeneratedJson(jsonString);
    setIsJsonDrawerOpen(true);
  };

  const handleCloseJsonDrawer = () => {
    setIsJsonDrawerOpen(false);
  };

  const handleSaveToApi = async () => {
    try {
      if (!state.workflowData.workflowName.trim()) {
        alert("Please enter a workflow name first.");
        return;
      }

      // Generate workflow data
      const workflow = actions.generateWorkflow();

      // Prepare API data similar to the main ReactFlow component
      const apiData = {
        name: workflow.workflowName,
        description: workflow.description,
        ruleJson: JSON.stringify(workflow),
        flowJson: JSON.stringify({
          nodes: [],
          edges: [],
          viewport: { x: 0, y: 0, zoom: 1 },
        }),
        isActive: true,
      };

      // Send to API
      const result = await createRuleMutation({
        data: apiData,
      }).unwrap();

      console.log("Workflow saved successfully:", result);
      alert("Workflow saved successfully to API!");
    } catch (error) {
      console.error("Failed to save workflow to API:", error);
      alert("Failed to save workflow to API. Please try again.");
    }
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
          onGenerateJson={handleGenerateJson}
          onSaveToApi={handleSaveToApi}
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

      {/* JSON Drawer */}
      <JsonDrawer
        isOpen={isJsonDrawerOpen}
        onClose={handleCloseJsonDrawer}
        jsonData={generatedJson}
      />
    </Box>
  );
};

export default RuleBuilder;
