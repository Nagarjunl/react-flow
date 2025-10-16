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
  Button,
  Alert,
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
import RuleGroupComponent from "./RuleGroupComponent";
import TestData from "./TestData";
import JsonDrawer from "../../../components/JsonDrawer";
import {
  useCreateRuleMutation,
  useTestRuleMutation,
} from "../../../Api/rulesApi";
import { useAppDispatch, useAppSelector } from "../../../Store/StoreConfig";
import { updateWorkflowJson } from "../../../Store/slice/TestSlice";
import type { RuleBuilderProps } from "../types";

const IntellisenseBuilder: React.FC<RuleBuilderProps> = ({
  onWorkflowSave,
  onWorkflowTest,
  initialWorkflow,
}) => {
  const { state, actions } = useRuleBuilder(initialWorkflow);
  const [isJsonDrawerOpen, setIsJsonDrawerOpen] = useState(false);
  const [generatedJson, setGeneratedJson] = useState("");
  const [editorTheme, setEditorTheme] = useState<"light" | "dark">("light");
  const [activeTab, setActiveTab] = useState(0);
  const [createRuleMutation] = useCreateRuleMutation();
  const [testRuleMutation, { isLoading: isTestLoading }] =
    useTestRuleMutation();
  const dispatch = useAppDispatch();
  const testData = useAppSelector((state) => state.testData);

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
    try {
      const workflow = actions.generateWorkflow();
      const workflowJson = JSON.stringify(workflow, null, 2);

      // Dispatch the current workflowJson to store
      dispatch(updateWorkflowJson(workflowJson));

      // Get the current test data (excluding workflowJson)
      const { workflowJson: _, ...testDataWithoutWorkflow } = testData;

      // Prepare the test data with the generated workflowJson
      const testPayload = {
        ...testDataWithoutWorkflow,
        workflowJson: workflowJson,
      };

      console.log("Testing with payload:", testPayload);

      const result = await testRuleMutation({ data: testPayload }).unwrap();
      console.log("Test API result:", result);
      alert("Test API called successfully! Check console for results.");

      // Call the original onWorkflowTest callback
      onWorkflowTest?.(workflow);
    } catch (error) {
      console.error("Test API error:", error);
      alert("Failed to call test API. Check console for details.");
    }
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
    try {
      // Validate workflow before saving
      const validationErrors = actions.validateWorkflow();

      if (validationErrors.length > 0) {
        alert(
          `Please fix the following errors before saving:\n\n${validationErrors.join(
            "\n"
          )}`
        );
        return;
      }

      // Generate workflow data
      const workflow = actions.generateWorkflow();

      // Prepare API data
      const apiData = {
        name: workflow[0].WorkflowName,
        description: workflow[0].Description,
        ruleJson: JSON.stringify(workflow),
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
              {state.validationErrors.length > 0 && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {state.validationErrors.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Main Content - Rule Groups */}
          <Box
            sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}
          >
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
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    align="center"
                  >
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
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={actions.addRuleGroup}
                  disabled={!isValidationPassing()}
                  sx={{
                    background:
                      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: "white",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    textTransform: "none",
                    py: 1.5,
                    px: 3,
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #059669 0%, #047857 100%)",
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
                  onClick={handleGenerateJson}
                  disabled={!isValidationPassing()}
                  sx={{
                    background:
                      "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    color: "white",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    textTransform: "none",
                    py: 1.5,
                    px: 3,
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 8px rgba(245, 158, 11, 0.3)",
                    },
                  }}
                >
                  Generate JSON
                </Button>

                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveToApi}
                  disabled={!isValidationPassing()}
                  sx={{
                    background:
                      "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                    color: "white",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    textTransform: "none",
                    py: 1.5,
                    px: 3,
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 8px rgba(220, 38, 38, 0.3)",
                    },
                  }}
                >
                  Save to API
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<PlayIcon />}
                  onClick={handleTest}
                  disabled={!isValidationPassing() || isTestLoading}
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    textTransform: "none",
                    py: 1.5,
                    px: 3,
                    borderColor: "#10b981",
                    color: "#10b981",
                    "&:hover": {
                      borderColor: "#059669",
                      backgroundColor: "#f0fdf4",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 8px rgba(16, 185, 129, 0.3)",
                    },
                  }}
                >
                  {isTestLoading ? "Testing..." : "Test API"}
                </Button>
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
