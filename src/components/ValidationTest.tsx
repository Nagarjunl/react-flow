import React from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import { useValidation } from "../hooks/useValidation";
import { Node, Edge } from "@xyflow/react";

// Test data for validation
// const testNodes: Node[] = [
//   {
//     id: "condition-1",
//     type: "condition",
//     position: { x: 100, y: 100 },
//     data: {
//       selectedTable: "users",
//       selectedField: "name",
//       expression: "equals",
//       value: "John",
//       isValid: true,
//     },
//   },
//   {
//     id: "condition-2",
//     type: "condition",
//     position: { x: 300, y: 100 },
//     data: {
//       selectedTable: "users",
//       selectedField: "age",
//       expression: ">=",
//       value: "18",
//       isValid: true,
//     },
//   },
//   {
//     id: "operator-1",
//     type: "conditionalOperator",
//     position: { x: 200, y: 200 },
//     data: {
//       operator: "AND",
//       isValid: true,
//     },
//   },
//   {
//     id: "group-1",
//     type: "resizableGroup",
//     position: { x: 50, y: 50 },
//     data: {
//       label: "Rule Group",
//     },
//   },
// ];

// const testEdges: Edge[] = [
//   {
//     id: "edge-1",
//     source: "condition-1",
//     target: "operator-1",
//     type: "default",
//   },
//   {
//     id: "edge-2",
//     source: "condition-2",
//     target: "operator-1",
//     type: "default",
//   },
// ];

// Test data for validation
const testNodes: Node[] = [
  {
    id: "condition-1",
    type: "condition",
    position: { x: 100, y: 100 },
    data: {
      selectedTable: "users",
      selectedField: "name",
      expression: "equals",
      value: "John",
      isValid: true,
    },
  },
  {
    id: "condition-2",
    type: "condition",
    position: { x: 300, y: 100 },
    data: {
      selectedTable: "users",
      selectedField: "age",
      expression: ">=",
      value: "18",
      isValid: true,
    },
  },
  {
    id: "operator-1",
    type: "conditionalOperator",
    position: { x: 200, y: 200 },
    data: {
      operator: "AND",
      isValid: true,
    },
  },
  {
    id: "group-1",
    type: "resizableGroup",
    position: { x: 50, y: 50 },
    data: {
      label: "Rule Group",
    },
  },
  // Additional nodes for the new test case
  {
    id: "condition-3",
    type: "condition",
    position: { x: 100, y: 300 },
    data: {
      selectedTable: "sales",
      selectedField: "Date",
      expression: "equals",
      value: "2025-10-09",
      isValid: true,
    },
  },
  {
    id: "condition-4",
    type: "condition",
    position: { x: 300, y: 300 },
    data: {
      selectedTable: "products",
      selectedField: "stock_quantity",
      expression: "<",
      value: "20",
      isValid: true,
    },
  },
  {
    id: "or-op",
    type: "conditionalOperator",
    position: { x: 200, y: 150 },
    data: {
      operator: "OR",
      isValid: true,
    },
  },
  {
    id: "and-op",
    type: "conditionalOperator",
    position: { x: 400, y: 300 },
    data: {
      operator: "AND",
      isValid: true,
    },
  },
  {
    id: "not-op",
    type: "conditionalOperator",
    position: { x: 300, y: 225 },
    data: {
      operator: "NOT",
      isValid: true,
    },
  },
];

const testEdges: Edge[] = [
  {
    id: "edge-1",
    source: "condition-1",
    target: "operator-1",
    type: "default",
  },
  {
    id: "edge-2",
    source: "condition-2",
    target: "operator-1",
    type: "default",
  },
  // Additional edges for the new test case
  {
    id: "edge-3",
    source: "condition-1",
    target: "or-op",
    type: "default",
  },
  {
    id: "edge-4",
    source: "condition-2",
    target: "or-op",
    type: "default",
  },
  {
    id: "edge-5",
    source: "or-op",
    target: "not-op",
    type: "default",
  },
  {
    id: "edge-6",
    source: "condition-3",
    target: "and-op",
    type: "default",
  },
  {
    id: "edge-7",
    source: "condition-4",
    target: "and-op",
    type: "default",
  },
  {
    id: "edge-8",
    source: "not-op",
    target: "and-op",
    type: "default",
  },
];

const ValidationTest: React.FC = () => {
  const { validationState, validateAll, validateConnection } = useValidation(
    testNodes,
    testEdges
  );

  const handleTestConnection = () => {
    const testConnection = {
      source: "condition-1",
      target: "condition-2", // This should be invalid
    };

    const result = validateConnection(testConnection);
    console.log("Connection validation result:", result);
  };

  const handleTestValidConnection = () => {
    const testConnection = {
      source: "condition-1",
      target: "operator-1", // This should be valid
    };

    const result = validateConnection(testConnection);
    console.log("Valid connection test:", result);
  };

  const handleTestNaryConnection = () => {
    const testConnection = {
      source: "condition-3", // Assume added test node
      target: "operator-1",
    };
    const result = validateConnection(testConnection);
    console.log("N-Ary connection test:", result);
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Validation System Test
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Current validation status: {validationState.summary}
        </Typography>
        <Typography
          variant="body2"
          color={validationState.isValid ? "success.main" : "error.main"}
        >
          Valid: {validationState.isValid ? "Yes" : "No"}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button variant="contained" onClick={validateAll}>
          Validate All
        </Button>
        <Button variant="outlined" onClick={handleTestConnection}>
          Test Invalid Connection
        </Button>
        <Button variant="outlined" onClick={handleTestValidConnection}>
          Test Valid Connection
        </Button>

        <Button variant="outlined" onClick={handleTestNaryConnection}>
          Test N-Ary Connection (3+)
        </Button>
      </Box>

      {validationState.errors.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="error">
            Errors:
          </Typography>
          {validationState.errors.map((error, index) => (
            <Typography key={index} variant="body2" color="error">
              • {error.message}
            </Typography>
          ))}
        </Box>
      )}

      {validationState.warnings.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="warning.main">
            Warnings:
          </Typography>
          {validationState.warnings.map((warning, index) => (
            <Typography key={index} variant="body2" color="warning.main">
              • {warning.message}
            </Typography>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default ValidationTest;
