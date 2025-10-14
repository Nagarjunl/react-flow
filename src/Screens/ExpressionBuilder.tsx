import React, { useState, useCallback, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  Alert,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayIcon,
  Save as SaveIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import ActionExpressionBuilder from "../features/ruleBuilder/components/ActionExpressionBuilder";

// Types for expression building
interface ExpressionNode {
  id: string;
  type: "data" | "operator" | "function" | "value" | "condition" | "logic";
  value: string;
  children?: ExpressionNode[];
  parameters?: any[];
}

interface RuleTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  expression: string;
  onSuccess: string;
  onFailure: string;
  complexity: "simple" | "intermediate" | "advanced" | "expert";
}

interface ExpressionBuilderProps {
  onExpressionChange?: (expression: string) => void;
  onRuleComplete?: (rule: any) => void;
  initialExpression?: string;
  mode?: "builder" | "editor" | "hybrid";
}

// Predefined data sources and functions
const DATA_SOURCES = [
  {
    id: "sale",
    label: "Sale Data",
    properties: [
      "Amount",
      "Quantity",
      "Discount",
      "ProductPrice",
      "Tax",
      "CategoryId",
      "BrandId",
      "CreatedOn",
    ],
  },
  {
    id: "user",
    label: "User Data",
    properties: [
      "Id",
      "StoreId",
      "CountryCode",
      "RetailCountryCode",
      "Designation",
      "DateJoined",
      "IsActive",
      "BrandId",
    ],
  },
  {
    id: "context",
    label: "Context Data",
    properties: [
      "Target",
      "Month",
      "SumOfAllWorkingHours",
      "OverallSalesByStore",
      "TotalMonthlySales",
    ],
  },
  {
    id: "storeTarget",
    label: "Store Target",
    properties: [
      "StoreId",
      "Month",
      "StoreKPIAchievementBraPenetration",
      "StoreTargetAchievement",
    ],
  },
  {
    id: "allSales",
    label: "All Sales",
    properties: ["CreatedBy", "CreatedOn", "SaleAmount"],
  },
  {
    id: "allAttendance",
    label: "All Attendance",
    properties: ["UserId", "CreatedOn", "WorkingHours"],
  },
  {
    id: "allLeaveRequests",
    label: "All Leave Requests",
    properties: ["CreatedBy", "LeaveType", "Status"],
  },
  { id: "leave", label: "Leave Data", properties: ["Unpaid"] },
];

const OPERATORS = [
  { id: ">", label: "Greater Than", type: "comparison" },
  { id: "<", label: "Less Than", type: "comparison" },
  { id: ">=", label: "Greater or Equal", type: "comparison" },
  { id: "<=", label: "Less or Equal", type: "comparison" },
  { id: "==", label: "Equals", type: "comparison" },
  { id: "!=", label: "Not Equals", type: "comparison" },
  { id: "&&", label: "AND", type: "logic" },
  { id: "||", label: "OR", type: "logic" },
  { id: "!", label: "NOT", type: "logic" },
];

// Predefined rule templates
const RULE_TEMPLATES: RuleTemplate[] = [
  {
    id: "sales-target",
    name: "Sales Target Check",
    description: "Basic sales amount comparison with target",
    category: "Sales",
    complexity: "simple",
    expression: "sale.Amount > context.Target",
    onSuccess: "sale.Amount * 0.1",
    onFailure: "100",
  },
  {
    id: "tiered-commission",
    name: "Tiered Commission with Cap",
    description: "Commission with tiered rates and maximum cap",
    category: "Commission",
    complexity: "intermediate",
    expression:
      "(sale.Amount > context.Target) && (storeTarget.where(t => t.StoreId == user.StoreId && t.Month == context.Month).StoreKPIAchievementBraPenetration.average() >= 1)",
    onSuccess:
      "user.Designation == 'Manager' ? Math.min(sale.Amount * 0.2, 5000) : Math.min(sale.Amount * 0.15, 2500)",
    onFailure: "sale.Amount * 0.05",
  },
  {
    id: "recent-joiner",
    name: "Recent Joiner Bonus",
    description: "Bonus for employees who joined within 90 days",
    category: "Bonus",
    complexity: "intermediate",
    expression: "DateDiff('day', user.DateJoined, Now()) <= 90",
    onSuccess: "Math.max(50, sale.Amount * 0.03 + 200)",
    onFailure: "sale.Amount * 0.03",
  },
  {
    id: "quarterly-aggregation",
    name: "Quarterly Sales Aggregation",
    description: "Complex aggregation with designation-based bonus",
    category: "Aggregation",
    complexity: "advanced",
    expression:
      "allSales.where(s => s.CreatedBy == user.Id && DateDiff('day', s.CreatedOn, Now()) <= 90).sum(s => s.SaleAmount) > 15000",
    onSuccess: "user.Designation == 'Senior' ? 1000 : 500",
    onFailure: "0",
  },
  {
    id: "attendance-consistency",
    name: "Attendance Consistency Bonus",
    description: "Attendance-based bonus with working hours check",
    category: "Attendance",
    complexity: "advanced",
    expression:
      "allAttendance.where(a => a.UserId == user.Id && a.CreatedOn.Month == context.Month).average(a => a.WorkingHours) >= 7.5",
    onSuccess:
      "context.SumOfAllWorkingHours > 160 ? sale.Amount * 0.15 : sale.Amount * 0.1",
    onFailure: "sale.Amount * 0.02",
  },
  {
    id: "nested-tiers",
    name: "Nested Sale Amount Tiers",
    description: "Complex nested ternary operators for tiered calculations",
    category: "Tiers",
    complexity: "expert",
    expression: "sale.Amount > 50",
    onSuccess:
      "sale.Amount <= 200 ? sale.Amount * 0.05 : (sale.Amount <= 1000 ? sale.Amount * 0.12 : (sale.Amount <= 5000 ? sale.Amount * 0.20 : 1500))",
    onFailure: "sale.Amount * 0.01",
  },
];

const ExpressionBuilder: React.FC<ExpressionBuilderProps> = ({
  onExpressionChange,
  onRuleComplete,
  initialExpression = "",
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<RuleTemplate | null>(
    null
  );
  const [expression, setExpression] = useState(initialExpression);
  const [ruleName, setRuleName] = useState("");
  const [description, setDescription] = useState("");
  const [onSuccess, setOnSuccess] = useState("");
  const [onFailure, setOnFailure] = useState("");
  const [builderMode, setBuilderMode] = useState<
    "template" | "builder" | "editor"
  >("template");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [testData, setTestData] = useState<any>({});

  // Expression building state
  const [expressionNodes, setExpressionNodes] = useState<ExpressionNode[]>([]);
  const [selectedDataSource, setSelectedDataSource] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedOperator, setSelectedOperator] = useState("");
  const [inputValue, setInputValue] = useState("");

  // Handle template selection
  const handleTemplateSelect = useCallback((template: RuleTemplate) => {
    setSelectedTemplate(template);
    setRuleName(template.name);
    setDescription(template.description);
    setExpression(template.expression);
    setOnSuccess(template.onSuccess);
    setOnFailure(template.onFailure);
    setBuilderMode("editor");
  }, []);

  // Handle expression change
  const handleExpressionChange = useCallback(
    (newExpression: string) => {
      setExpression(newExpression);
      onExpressionChange?.(newExpression);

      // Basic validation
      const errors: string[] = [];
      if (newExpression.trim() === "") {
        errors.push("Expression cannot be empty");
      }
      if (newExpression.includes("undefined")) {
        errors.push("Expression contains undefined values");
      }
      setValidationErrors(errors);
    },
    [onExpressionChange]
  );

  // Add expression node
  const addExpressionNode = useCallback(
    (type: ExpressionNode["type"]) => {
      const newNode: ExpressionNode = {
        id: `node_${Date.now()}`,
        type,
        value: "",
      };

      if (type === "data" && selectedDataSource && selectedProperty) {
        newNode.value = `${selectedDataSource}.${selectedProperty}`;
      } else if (type === "operator" && selectedOperator) {
        newNode.value = selectedOperator;
      } else if (type === "value") {
        newNode.value = inputValue;
      }

      setExpressionNodes((prev) => [...prev, newNode]);

      // Update expression
      const newExpression = [...expressionNodes, newNode]
        .map((node) => node.value)
        .join(" ");
      handleExpressionChange(newExpression);
    },
    [
      selectedDataSource,
      selectedProperty,
      selectedOperator,
      inputValue,
      expressionNodes,
      handleExpressionChange,
    ]
  );

  // Remove expression node
  const removeExpressionNode = useCallback(
    (nodeId: string) => {
      const newNodes = expressionNodes.filter((node) => node.id !== nodeId);
      setExpressionNodes(newNodes);

      const newExpression = newNodes.map((node) => node.value).join(" ");
      handleExpressionChange(newExpression);
    },
    [expressionNodes, handleExpressionChange]
  );

  // Generate final rule
  const generateRule = useCallback(() => {
    if (!ruleName.trim() || !expression.trim()) {
      setValidationErrors(["Rule name and expression are required"]);
      return;
    }

    const rule = {
      RuleName: ruleName,
      Description: description,
      Expression: expression,
      OnSuccess: onSuccess,
      OnFailure: onFailure,
    };

    onRuleComplete?.(rule);
  }, [ruleName, description, expression, onSuccess, onFailure, onRuleComplete]);

  // Test expression with sample data
  const testExpression = useCallback(() => {
    setTestDialogOpen(true);
    // In a real implementation, you would evaluate the expression here
  }, []);

  // Export rule as JSON
  const exportRule = useCallback(() => {
    const rule = {
      RuleName: ruleName,
      Description: description,
      Expression: expression,
      OnSuccess: onSuccess,
      OnFailure: onFailure,
    };

    const dataStr = JSON.stringify([rule], null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${ruleName.replace(/\s+/g, "_")}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [ruleName, description, expression, onSuccess, onFailure]);

  // Filter templates by complexity
  const filteredTemplates = useMemo(() => {
    return RULE_TEMPLATES.reduce((acc, template) => {
      if (!acc[template.category]) {
        acc[template.category] = [];
      }
      acc[template.category].push(template);
      return acc;
    }, {} as Record<string, RuleTemplate[]>);
  }, []);

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Card sx={{ mb: 2 }}>
        <CardHeader
          title="Expression Builder"
          subheader="Build complex business rules with visual interface"
          action={
            <Stack direction="row" spacing={1}>
              <Tooltip title="Test Expression">
                <IconButton onClick={testExpression} color="primary">
                  <PlayIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Export Rule">
                <IconButton onClick={exportRule} color="primary">
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Generate Rule">
                <IconButton onClick={generateRule} color="success">
                  <SaveIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          }
        />
      </Card>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: "flex", gap: 2 }}>
        {/* Left Panel - Templates & Builder */}
        <Box
          sx={{ width: 400, display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* Mode Selector */}
          <Card>
            <CardContent>
              <FormControl fullWidth>
                <InputLabel>Builder Mode</InputLabel>
                <Select
                  value={builderMode}
                  onChange={(e) => setBuilderMode(e.target.value as any)}
                >
                  <MenuItem value="template">Template Based</MenuItem>
                  <MenuItem value="builder">Visual Builder</MenuItem>
                  <MenuItem value="editor">Code Editor</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>

          {/* Templates */}
          {builderMode === "template" && (
            <Card sx={{ flex: 1 }}>
              <CardHeader title="Rule Templates" />
              <CardContent sx={{ maxHeight: 400, overflow: "auto" }}>
                {Object.entries(filteredTemplates).map(
                  ([category, templates]) => (
                    <Accordion key={category}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">{category}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Stack spacing={1}>
                          {templates.map((template) => (
                            <Card
                              key={template.id}
                              sx={{
                                cursor: "pointer",
                                "&:hover": { bgcolor: "action.hover" },
                                border:
                                  selectedTemplate?.id === template.id ? 2 : 1,
                                borderColor:
                                  selectedTemplate?.id === template.id
                                    ? "primary.main"
                                    : "divider",
                              }}
                              onClick={() => handleTemplateSelect(template)}
                            >
                              <CardContent>
                                <Typography variant="subtitle1">
                                  {template.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {template.description}
                                </Typography>
                                <Box sx={{ mt: 1 }}>
                                  <Chip
                                    label={template.complexity}
                                    size="small"
                                    color={
                                      template.complexity === "simple"
                                        ? "success"
                                        : template.complexity === "intermediate"
                                        ? "warning"
                                        : template.complexity === "advanced"
                                        ? "error"
                                        : "info"
                                    }
                                  />
                                </Box>
                              </CardContent>
                            </Card>
                          ))}
                        </Stack>
                      </AccordionDetails>
                    </Accordion>
                  )
                )}
              </CardContent>
            </Card>
          )}

          {/* Visual Builder */}
          {builderMode === "builder" && (
            <Card sx={{ flex: 1 }}>
              <CardHeader title="Visual Builder" />
              <CardContent>
                <Stack spacing={2}>
                  {/* Data Source Selection */}
                  <FormControl fullWidth>
                    <InputLabel>Data Source</InputLabel>
                    <Select
                      value={selectedDataSource}
                      onChange={(e) => setSelectedDataSource(e.target.value)}
                    >
                      {DATA_SOURCES.map((source) => (
                        <MenuItem key={source.id} value={source.id}>
                          {source.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Property Selection */}
                  {selectedDataSource && (
                    <FormControl fullWidth>
                      <InputLabel>Property</InputLabel>
                      <Select
                        value={selectedProperty}
                        onChange={(e) => setSelectedProperty(e.target.value)}
                      >
                        {DATA_SOURCES.find(
                          (s) => s.id === selectedDataSource
                        )?.properties.map((prop) => (
                          <MenuItem key={prop} value={prop}>
                            {prop}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}

                  {/* Operator Selection */}
                  <FormControl fullWidth>
                    <InputLabel>Operator</InputLabel>
                    <Select
                      value={selectedOperator}
                      onChange={(e) => setSelectedOperator(e.target.value)}
                    >
                      {OPERATORS.map((op) => (
                        <MenuItem key={op.id} value={op.id}>
                          {op.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Value Input */}
                  <TextField
                    label="Value"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    fullWidth
                  />

                  {/* Add Node Button */}
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => addExpressionNode("data")}
                    disabled={!selectedDataSource || !selectedProperty}
                  >
                    Add Data Node
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => addExpressionNode("operator")}
                    disabled={!selectedOperator}
                  >
                    Add Operator
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => addExpressionNode("value")}
                    disabled={!inputValue}
                  >
                    Add Value
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          )}
        </Box>

        {/* Right Panel - Rule Editor */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Rule Details */}
          <Card>
            <CardHeader title="Rule Details" />
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Rule Name"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Expression Editor */}
          <Card sx={{ flex: 1 }}>
            <CardHeader title="Expression" />
            <CardContent sx={{ height: "100%" }}>
              <TextField
                label="Expression"
                value={expression}
                onChange={(e) => handleExpressionChange(e.target.value)}
                fullWidth
                multiline
                rows={6}
                placeholder="Enter your expression here..."
                sx={{ height: "100%" }}
                InputProps={{
                  style: { fontFamily: "monospace", fontSize: "14px" },
                }}
              />

              {/* Expression Nodes Display */}
              {builderMode === "builder" && expressionNodes.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Expression Nodes:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {expressionNodes.map((node) => (
                      <Chip
                        key={node.id}
                        label={node.value}
                        onDelete={() => removeExpressionNode(node.id)}
                        color={
                          node.type === "data"
                            ? "primary"
                            : node.type === "operator"
                            ? "secondary"
                            : "default"
                        }
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {validationErrors.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Success/Failure Actions */}
          <Card>
            <CardHeader title="Actions" />
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* On Success Section */}
                <ActionExpressionBuilder
                  value={onSuccess}
                  onChange={setOnSuccess}
                  label="On Success (When condition is true)"
                  placeholder="Enter expression for when condition is true..."
                />

                {/* On Failure Section */}
                <ActionExpressionBuilder
                  value={onFailure}
                  onChange={setOnFailure}
                  label="On Failure (When condition is false)"
                  placeholder="Enter expression for when condition is false..."
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Test Dialog */}
      <Dialog
        open={testDialogOpen}
        onClose={() => setTestDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Test Expression</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter sample data to test your expression:
          </Typography>
          <TextField
            label="Sample Data (JSON)"
            value={JSON.stringify(testData, null, 2)}
            onChange={(e) => {
              try {
                setTestData(JSON.parse(e.target.value));
              } catch (error) {
                // Handle invalid JSON
              }
            }}
            fullWidth
            multiline
            rows={8}
            placeholder='{"sale": {"Amount": 1000}, "user": {"CountryCode": "US"}}'
            InputProps={{
              style: { fontFamily: "monospace", fontSize: "12px" },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestDialogOpen(false)}>Cancel</Button>
          <Button onClick={testExpression} variant="contained">
            Test
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExpressionBuilder;
