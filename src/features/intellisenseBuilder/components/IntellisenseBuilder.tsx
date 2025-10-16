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
  TextField,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Save as SaveIcon,
  PlayArrow as PlayIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Add as AddIcon,
  Description as GenerateIcon,
} from "@mui/icons-material";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useRuleBuilder } from "../hooks/useRuleBuilder";
import { useWorkflowActions } from "../hooks/useWorkflowActions";
import RuleGroupComponent from "./RuleGroupComponent";
import TestData from "./TestData";
import JsonDrawer from "../../../components/JsonDrawer";
import type { RuleBuilderProps } from "../types";
import { GradientButton, ValidationAlert, EmptyState } from "../ui";
import { OUTLINED_BUTTON_STYLES } from "../constants";

const IntellisenseBuilder: React.FC<RuleBuilderProps> = ({
  onWorkflowSave,
  onWorkflowTest,
  initialWorkflow,
}) => {
  const { state, actions } = useRuleBuilder(initialWorkflow);
  const {
    saveWorkflowWithValidation,
    testWorkflow,
    generateJSON,
    isTestLoading,
  } = useWorkflowActions();

  const [isJsonDrawerOpen, setIsJsonDrawerOpen] = useState(false);
  const [generatedJson, setGeneratedJson] = useState("");
  const [editorTheme, setEditorTheme] = useState<"light" | "dark">("light");
  const [activeTab, setActiveTab] = useState(0);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleTheme = () => {
    setEditorTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleSave = () => {
    const workflow = actions.generateWorkflow();
    onWorkflowSave?.(workflow);
  };

  const handleTest = async () => {
    const workflow = actions.generateWorkflow();
    await testWorkflow(workflow);
    onWorkflowTest?.(workflow);
  };

  const handleGenerateJson = () => {
    const workflow = actions.generateWorkflow();
    const jsonString = generateJSON(workflow);
    setGeneratedJson(jsonString);
    setIsJsonDrawerOpen(true);
  };

  const handleCloseJsonDrawer = () => {
    setIsJsonDrawerOpen(false);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Check if validation passes for enabling/disabling buttons
  const isValidationPassing = () => {
    const validationErrors = actions.validateWorkflow();
    return validationErrors.length === 0;
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = state.ruleGroups.findIndex(
        (rule) => rule.id === active.id
      );
      const newIndex = state.ruleGroups.findIndex(
        (rule) => rule.id === over?.id
      );

      actions.reorderRuleGroups(oldIndex, newIndex);
    }
  };

  const handleSaveToApi = async () => {
    const workflow = actions.generateWorkflow();
    const validationErrors = actions.validateWorkflow();
    await saveWorkflowWithValidation(workflow, validationErrors);
  };

  return (
    <Box>
      {/* Header */}
      <Card sx={{ mb: 2 }}>
        <CardHeader
          title="Intellisense Rule Builder"
          subheader="Build complex workflows with rules and actions"
          action={
            <Stack direction="row" spacing={1}>
              <Tooltip
                title={
                  editorTheme === "light"
                    ? "Switch to Dark Mode"
                    : "Switch to Light Mode"
                }
              >
                <IconButton onClick={toggleTheme} color="default">
                  {editorTheme === "light" ? (
                    <DarkModeIcon />
                  ) : (
                    <LightModeIcon />
                  )}
                </IconButton>
              </Tooltip>
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

      {/* Tabs */}
      <Card sx={{ mb: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Rule Builder" />
            <Tab label="Test Data" />
          </Tabs>
        </Box>
      </Card>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Box>
          {/* Workflow Details - Top Section */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Workflow Details
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Box sx={{ flex: "1 1 300px", minWidth: "300px" }}>
                  <TextField
                    label="Workflow Name *"
                    value={state.workflowData.workflowName}
                    onChange={(e) =>
                      actions.updateWorkflowData("workflowName", e.target.value)
                    }
                    fullWidth
                    size="small"
                    required
                  />
                </Box>
                <Box sx={{ flex: "1 1 300px", minWidth: "300px" }}>
                  <TextField
                    label="Description"
                    value={state.workflowData.description}
                    onChange={(e) =>
                      actions.updateWorkflowData("description", e.target.value)
                    }
                    fullWidth
                    size="small"
                  />
                </Box>
              </Box>

              {/* Validation Errors */}
              <ValidationAlert errors={state.validationErrors} />
            </CardContent>
          </Card>

          {/* Main Content - Rule Groups */}
          <Box
            sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}
          >
            {state.ruleGroups.length === 0 ? (
              <EmptyState
                title="No rules added yet"
                message='Click "Add Rule" to start building your workflow'
              />
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={state.ruleGroups.map((rule) => rule.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {state.ruleGroups.map((ruleGroup) => (
                    <RuleGroupComponent
                      key={ruleGroup.id}
                      ruleGroup={ruleGroup}
                      onUpdate={actions.updateRuleGroup}
                      onDelete={actions.deleteRuleGroup}
                      onAddActionGroup={actions.addActionGroup}
                      onUpdateActionGroup={actions.updateActionGroup}
                      onDeleteActionGroup={actions.deleteActionGroup}
                      editorTheme={editorTheme}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </Box>

          {/* Action Buttons - Bottom Section */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Stack direction="row" spacing={2} justifyContent="center">
                <GradientButton
                  gradientVariant="green"
                  startIcon={<AddIcon />}
                  onClick={actions.addRuleGroup}
                  disabled={!isValidationPassing()}
                >
                  Add Rule
                </GradientButton>

                <GradientButton
                  gradientVariant="orange"
                  startIcon={<GenerateIcon />}
                  onClick={handleGenerateJson}
                  disabled={!isValidationPassing()}
                >
                  Generate JSON
                </GradientButton>

                <GradientButton
                  gradientVariant="red"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveToApi}
                  disabled={!isValidationPassing()}
                >
                  Save to API
                </GradientButton>

                <GradientButton
                  gradientVariant="green"
                  startIcon={<PlayIcon />}
                  onClick={handleTest}
                  disabled={!isValidationPassing() || isTestLoading}
                  sx={OUTLINED_BUTTON_STYLES.green}
                >
                  {isTestLoading ? "Testing..." : "Test API"}
                </GradientButton>
              </Stack>
            </CardContent>
          </Card>

          {/* JSON Drawer */}
          <JsonDrawer
            isOpen={isJsonDrawerOpen}
            onClose={handleCloseJsonDrawer}
            jsonData={generatedJson}
          />
        </Box>
      )}

      {/* Test Data Tab */}
      {activeTab === 1 && (
        <TestData workflowJson={actions.generateWorkflow()} />
      )}
    </Box>
  );
};

export default IntellisenseBuilder;
