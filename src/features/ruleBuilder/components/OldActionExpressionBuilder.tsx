import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  Functions as FunctionsIcon,
} from "@mui/icons-material";

interface ExpressionPart {
  id: string;
  type: "data" | "operator" | "function" | "value" | "math";
  value: string;
}

interface ActionExpressionBuilderProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
}

const ActionExpressionBuilder: React.FC<ActionExpressionBuilderProps> = ({
  value,
  onChange,
  label,
  placeholder,
}) => {
  const [expressionParts, setExpressionParts] = useState<ExpressionPart[]>([]);
  const [selectedDataSource, setSelectedDataSource] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedOperator, setSelectedOperator] = useState("");
  const [selectedFunction, setSelectedFunction] = useState("");
  const [selectedCollectionMethod, setSelectedCollectionMethod] = useState("");
  const [inputValue, setInputValue] = useState("");

  const DATA_SOURCES = [
    {
      id: "sale",
      label: "Sale Data",
      properties: ["Amount", "Quantity", "Discount", "ProductPrice", "Tax"],
    },
    {
      id: "user",
      label: "User Data",
      properties: ["Id", "StoreId", "Designation", "BrandId"],
    },
    {
      id: "context",
      label: "Context Data",
      properties: ["Target", "Month", "SumOfAllWorkingHours"],
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
      isCollection: true,
    },
    {
      id: "allSales",
      label: "All Sales",
      properties: ["CreatedBy", "CreatedOn", "SaleAmount"],
      isCollection: true,
    },
    {
      id: "allAttendance",
      label: "All Attendance",
      properties: ["UserId", "CreatedOn", "WorkingHours"],
      isCollection: true,
    },
    {
      id: "allLeaveRequests",
      label: "All Leave Requests",
      properties: ["CreatedBy", "LeaveType", "Status"],
      isCollection: true,
    },
  ];

  const OPERATORS = [
    { id: "*", label: "Multiply (*)" },
    { id: "/", label: "Divide (/)" },
    { id: "+", label: "Add (+)" },
    { id: "-", label: "Subtract (-)" },
    { id: "==", label: "Equals (==)" },
    { id: ">", label: "Greater Than (>)" },
    { id: "<", label: "Less Than (<)" },
    { id: ">=", label: "Greater or Equal (>=)" },
    { id: "<=", label: "Less or Equal (<=)" },
  ];

  const FUNCTIONS = [
    {
      id: "Math.min",
      label: "Math.min()",
      template: "Math.min(value1, value2)",
    },
    {
      id: "Math.max",
      label: "Math.max()",
      template: "Math.max(value1, value2)",
    },
    { id: "Math.round", label: "Math.round()", template: "Math.round(value)" },
    { id: "Math.floor", label: "Math.floor()", template: "Math.floor(value)" },
    { id: "Math.ceil", label: "Math.ceil()", template: "Math.ceil(value)" },
  ];

  const COLLECTION_METHODS = [
    {
      id: "where",
      label: ".where()",
      template: ".where(item => item.property == value)",
      description: "Filter collection based on condition",
    },
    {
      id: "sum",
      label: ".sum()",
      template: ".sum(item => item.property)",
      description: "Sum all values in collection",
    },
    {
      id: "average",
      label: ".average()",
      template: ".average(item => item.property)",
      description: "Calculate average of collection",
    },
    {
      id: "count",
      label: ".count()",
      template: ".count()",
      description: "Count items in collection",
    },
    {
      id: "max",
      label: ".max()",
      template: ".max(item => item.property)",
      description: "Find maximum value",
    },
    {
      id: "min",
      label: ".min()",
      template: ".min(item => item.property)",
      description: "Find minimum value",
    },
    {
      id: "first",
      label: ".first()",
      template: ".first()",
      description: "Get first item",
    },
    {
      id: "last",
      label: ".last()",
      template: ".last()",
      description: "Get last item",
    },
    {
      id: "any",
      label: ".any()",
      template: ".any(item => item.property == value)",
      description: "Check if any items match condition",
    },
    {
      id: "all",
      label: ".all()",
      template: ".all(item => item.property == value)",
      description: "Check if all items match condition",
    },
  ];

  const addDataPart = () => {
    if (selectedDataSource && selectedProperty) {
      const newPart: ExpressionPart = {
        id: `part_${Date.now()}`,
        type: "data",
        value: `${selectedDataSource}.${selectedProperty}`,
      };
      const newParts = [...expressionParts, newPart];
      setExpressionParts(newParts);
      updateExpression(newParts);
    }
  };

  const addOperatorPart = () => {
    if (selectedOperator) {
      const newPart: ExpressionPart = {
        id: `part_${Date.now()}`,
        type: "operator",
        value: selectedOperator,
      };
      const newParts = [...expressionParts, newPart];
      setExpressionParts(newParts);
      updateExpression(newParts);
    }
  };

  const addValuePart = () => {
    if (inputValue) {
      const newPart: ExpressionPart = {
        id: `part_${Date.now()}`,
        type: "value",
        value: inputValue,
      };
      const newParts = [...expressionParts, newPart];
      setExpressionParts(newParts);
      updateExpression(newParts);
    }
  };

  const addFunctionPart = () => {
    if (selectedFunction) {
      const func = FUNCTIONS.find((f) => f.id === selectedFunction);
      if (func) {
        const newPart: ExpressionPart = {
          id: `part_${Date.now()}`,
          type: "function",
          value: func.template,
        };
        const newParts = [...expressionParts, newPart];
        setExpressionParts(newParts);
        updateExpression(newParts);
      }
    }
  };

  const addCollectionMethodPart = () => {
    if (selectedCollectionMethod) {
      const method = COLLECTION_METHODS.find(
        (m) => m.id === selectedCollectionMethod
      );
      if (method) {
        const newPart: ExpressionPart = {
          id: `part_${Date.now()}`,
          type: "function",
          value: method.template,
        };
        const newParts = [...expressionParts, newPart];
        setExpressionParts(newParts);
        updateExpression(newParts);
      }
    }
  };

  const removePart = (id: string) => {
    const newParts = expressionParts.filter((part) => part.id !== id);
    setExpressionParts(newParts);
    updateExpression(newParts);
  };

  const updateExpression = (parts: ExpressionPart[]) => {
    const expression = parts.map((part) => part.value).join(" ");
    onChange(expression);
  };

  const insertAtCursor = (text: string) => {
    // Simple implementation - append to current value
    const newValue = value + (value ? " " : "") + text;
    onChange(newValue);
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        {label}
      </Typography>

      {/* Quick Insert Buttons */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          Quick Insert:
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: "wrap" }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => insertAtCursor("sale.Amount")}
          >
            sale.Amount
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => insertAtCursor("user.Designation")}
          >
            user.Designation
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => insertAtCursor("context.Target")}
          >
            context.Target
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => insertAtCursor("* 0.1")}
          >
            * 0.1
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => insertAtCursor("* 0.2")}
          >
            * 0.2
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => insertAtCursor("Math.min(")}
          >
            Math.min(
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => insertAtCursor("Math.max(")}
          >
            Math.max(
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => insertAtCursor("5000")}
          >
            5000
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => insertAtCursor("1000")}
          >
            1000
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => insertAtCursor("500")}
          >
            500
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() =>
              insertAtCursor(".where(item => item.property == value)")
            }
          >
            .where()
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => insertAtCursor(".sum(item => item.property)")}
          >
            .sum()
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => insertAtCursor(".average(item => item.property)")}
          >
            .average()
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => insertAtCursor(".count()")}
          >
            .count()
          </Button>
        </Stack>
      </Box>

      {/* Expression Parts Builder */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          Build Expression:
        </Typography>

        {/* Data Source */}
        <Box sx={{ display: "flex", gap: 1, mb: 1, alignItems: "center" }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
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

          {selectedDataSource && (
            <FormControl size="small" sx={{ minWidth: 120 }}>
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

          <Button
            size="small"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addDataPart}
            disabled={!selectedDataSource || !selectedProperty}
          >
            Add Data
          </Button>
        </Box>

        {/* Operators */}
        <Box sx={{ display: "flex", gap: 1, mb: 1, alignItems: "center" }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
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

          <Button
            size="small"
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addOperatorPart}
            disabled={!selectedOperator}
          >
            Add Operator
          </Button>
        </Box>

        {/* Functions */}
        <Box sx={{ display: "flex", gap: 1, mb: 1, alignItems: "center" }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Function</InputLabel>
            <Select
              value={selectedFunction}
              onChange={(e) => setSelectedFunction(e.target.value)}
            >
              {FUNCTIONS.map((func) => (
                <MenuItem key={func.id} value={func.id}>
                  {func.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            size="small"
            variant="outlined"
            startIcon={<FunctionsIcon />}
            onClick={addFunctionPart}
            disabled={!selectedFunction}
          >
            Add Function
          </Button>
        </Box>

        {/* Collection Methods */}
        <Box sx={{ display: "flex", gap: 1, mb: 1, alignItems: "center" }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Collection Method</InputLabel>
            <Select
              value={selectedCollectionMethod}
              onChange={(e) => setSelectedCollectionMethod(e.target.value)}
            >
              {COLLECTION_METHODS.map((method) => (
                <MenuItem key={method.id} value={method.id}>
                  {method.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            size="small"
            variant="outlined"
            startIcon={<FunctionsIcon />}
            onClick={addCollectionMethodPart}
            disabled={!selectedCollectionMethod}
          >
            Add Collection Method
          </Button>
        </Box>

        {/* Value Input */}
        <Box sx={{ display: "flex", gap: 1, mb: 1, alignItems: "center" }}>
          <TextField
            size="small"
            label="Value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter number or text"
            sx={{ minWidth: 150 }}
          />

          <Button
            size="small"
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addValuePart}
            disabled={!inputValue}
          >
            Add Value
          </Button>
        </Box>

        {/* Expression Parts Display */}
        {expressionParts.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              Expression Parts:
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              {expressionParts.map((part) => (
                <Chip
                  key={part.id}
                  label={part.value}
                  onDelete={() => removePart(part.id)}
                  color={
                    part.type === "data"
                      ? "primary"
                      : part.type === "operator"
                      ? "secondary"
                      : part.type === "function"
                      ? "success"
                      : "default"
                  }
                  size="small"
                />
              ))}
            </Stack>
          </Box>
        )}
      </Box>

      {/* Main Expression Input */}
      <TextField
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
        multiline
        rows={3}
        placeholder={placeholder}
        InputProps={{
          style: { fontFamily: "monospace", fontSize: "14px" },
        }}
      />

      {/* Expression Templates */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          Quick Templates:
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          <Button
            size="small"
            variant="text"
            onClick={() => onChange("sale.Amount * 0.1")}
          >
            Basic Commission
          </Button>
          <Button
            size="small"
            variant="text"
            onClick={() => onChange("Math.min(sale.Amount * 0.2, 5000)")}
          >
            Capped Commission
          </Button>
          <Button
            size="small"
            variant="text"
            onClick={() =>
              onChange("user.Designation == 'Manager' ? 1000 : 500")
            }
          >
            Designation Based
          </Button>
          <Button
            size="small"
            variant="text"
            onClick={() => onChange("Math.max(50, sale.Amount * 0.03)")}
          >
            Minimum Floor
          </Button>
          <Button
            size="small"
            variant="text"
            onClick={() =>
              onChange(
                "allSales.where(s => s.CreatedBy == user.Id).sum(s => s.SaleAmount)"
              )
            }
          >
            Collection Sum
          </Button>
          <Button
            size="small"
            variant="text"
            onClick={() =>
              onChange(
                "storeTarget.where(t => t.StoreId == user.StoreId).average(t => t.StoreTargetAchievement)"
              )
            }
          >
            Collection Average
          </Button>
          <Button
            size="small"
            variant="text"
            onClick={() =>
              onChange("allAttendance.where(a => a.UserId == user.Id).count()")
            }
          >
            Collection Count
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default ActionExpressionBuilder;
