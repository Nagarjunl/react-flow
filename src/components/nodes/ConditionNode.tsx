import React, { useState, useEffect } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { nodeColors, expressionSymbols } from "../../types/nodeTypes";
import { tableSchema } from "../../constants/constant";
import { Box, Typography, TextField, Autocomplete, Alert } from "@mui/material";
import type { ConditionNodeProps } from "../../types/nodeTypes";
import ValidationIndicator from "../ValidationIndicator";

const ConditionNode: React.FC<ConditionNodeProps> = ({
  data,
  isConnectable,
  id,
}) => {
  const [selectedTable, setSelectedTable] = useState(data.selectedTable || "");
  const [selectedField, setSelectedField] = useState(data.selectedField || "");
  const [expression, setExpression] = useState(data.expression || "");
  const [value, setValue] = useState(data.value || "");
  const [isValid, setIsValid] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const [availableFields, setAvailableFields] = useState<
    Array<{ name: string; type: string }>
  >([]);
  const [availableExpressions, setAvailableExpressions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const { updateNodeData } = useReactFlow();

  // Note: Validation indicators will be handled at the App level
  // This component will receive validation state through props if needed

  // Initialize available fields and expressions on first load
  useEffect(() => {
    if (!isInitialized) {
      if (selectedTable && tableSchema[selectedTable]) {
        setAvailableFields(tableSchema[selectedTable]);

        // If we have a selected field, set up expressions
        if (selectedField) {
          const field = tableSchema[selectedTable].find(
            (f) => f.name === selectedField
          );
          if (field) {
            setAvailableExpressions(expressionSymbols[field.type] || []);
          }
        }
      }
      setIsInitialized(true);
    }
  }, [selectedTable, selectedField, isInitialized]);

  // Update available fields when table changes (only after initialization)
  useEffect(() => {
    if (isInitialized && selectedTable && tableSchema[selectedTable]) {
      setAvailableFields(tableSchema[selectedTable]);
      // Only clear fields if this is a user-initiated change, not initial load
      if (data.selectedTable !== selectedTable) {
        setSelectedField("");
        setExpression("");
        setValue("");
      }
    } else if (isInitialized) {
      setAvailableFields([]);
    }
  }, [selectedTable, isInitialized, data.selectedTable]);

  // Update available expressions when field changes (only after initialization)
  useEffect(() => {
    if (isInitialized && selectedField && availableFields.length > 0) {
      const field = availableFields.find((f) => f.name === selectedField);
      if (field) {
        setAvailableExpressions(expressionSymbols[field.type] || []);
        // Only clear expression and value if this is a user-initiated change, not initial load
        if (data.selectedField !== selectedField) {
          setExpression("");
          setValue("");
        }
      }
    } else if (isInitialized) {
      setAvailableExpressions([]);
    }
  }, [selectedField, availableFields, isInitialized, data.selectedField]);

  // Validate all fields and update node data using React Flow's approach
  useEffect(() => {
    const valid = Boolean(
      selectedTable && selectedField && expression && value.trim() !== ""
    );
    setIsValid(valid);

    // Update the node data using React Flow's recommended approach
    updateNodeData(id, {
      selectedTable,
      selectedField,
      expression,
      value,
      isValid: valid,
    });
  }, [selectedTable, selectedField, expression, value, id, updateNodeData]);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const getInputType = (): string => {
    if (selectedField && availableFields.length > 0) {
      const field = availableFields.find((f) => f.name === selectedField);
      if (field) {
        if (field.type === "date") return "date";
        if (field.type === "numeric" || field.type === "integer")
          return "number";
        return "text";
      }
    }
    return "text";
  };

  const getValuePlaceholder = (): string => {
    if (selectedField && availableFields.length > 0) {
      const field = availableFields.find((f) => f.name === selectedField);
      if (field) {
        if (field.type === "date") return "YYYY-MM-DD";
        if (field.type === "numeric" || field.type === "integer")
          return "Enter number";
        return "Enter text";
      }
    }
    return "Enter value";
  };

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${nodeColors.condition} 0%, ${nodeColors.condition}dd 100%)`,
        color: "white",
        p: 2,
        borderRadius: 2,
        minWidth: "320px",
        boxShadow: 3,
        border: isValid ? "2px solid transparent" : "2px solid #ef4444",
        transition: "all 0.2s ease",
        position: "relative",
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          mb: 2,
          fontWeight: "bold",
          color: "white",
        }}
      >
        🔍 Condition Node
      </Typography>

      {/* 2x2 Grid Layout using MUI Grid */}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
        {/* Table Selection */}
        <Box>
          <Autocomplete
            size="small"
            options={Object.keys(tableSchema)}
            value={selectedTable}
            onChange={(event, newValue) => {
              setSelectedTable(newValue || "");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Table *"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                    fontSize: "0.75rem",
                    "& .MuiOutlinedInput-input": {
                      color: "#333",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "0.75rem",
                    color: "#666",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#666",
                  },
                }}
              />
            )}
          />
        </Box>

        {/* Field Selection */}
        <Box>
          <Autocomplete
            size="small"
            options={availableFields.map((field) => field.name)}
            value={selectedField}
            onChange={(event, newValue) => {
              setSelectedField(newValue || "");
            }}
            disabled={!selectedTable}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Field *"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: selectedTable ? "white" : "#f5f5f5",
                    fontSize: "0.75rem",
                    "& .MuiOutlinedInput-input": {
                      color: "#333",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "0.75rem",
                    color: "#666",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#666",
                  },
                }}
              />
            )}
          />
        </Box>

        {/* Expression Selection */}
        <Box>
          <Autocomplete
            size="small"
            options={availableExpressions}
            getOptionLabel={(option) => option.label || ""}
            value={
              availableExpressions.find((expr) => expr.value === expression) ||
              null
            }
            onChange={(event, newValue) => {
              setExpression(newValue ? newValue.value : "");
            }}
            disabled={!selectedField}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Expression *"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: selectedField ? "white" : "#f5f5f5",
                    fontSize: "0.75rem",
                    "& .MuiOutlinedInput-input": {
                      color: "#333",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "0.75rem",
                    color: "#666",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "#666",
                  },
                }}
              />
            )}
          />
        </Box>

        {/* Value Input */}
        <Box>
          <TextField
            size="small"
            type={getInputType()}
            value={value}
            onChange={handleValueChange}
            placeholder={getValuePlaceholder()}
            disabled={!expression}
            label="Value *"
            variant="outlined"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: expression ? "white" : "#f5f5f5",
                fontSize: "0.75rem",
                "& .MuiOutlinedInput-input": {
                  color: "#333",
                },
              },
              "& .MuiInputLabel-root": {
                fontSize: "0.75rem",
                color: "#666",
              },
            }}
          />
        </Box>
      </Box>

      {!isValid && (
        <Alert
          severity="error"
          sx={{
            mt: 1,
            fontSize: "0.7rem",
            "& .MuiAlert-message": {
              fontSize: "0.7rem",
            },
          }}
        >
          All fields are required
        </Alert>
      )}

      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{
          background: "#fff",
          width: "10px",
          height: "10px",
          border: "2px solid #ef4444",
        }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{
          background: "#fff",
          width: "10px",
          height: "10px",
          border: "2px solid #ef4444",
        }}
        isConnectable={isConnectable}
      />

      {/* Validation Indicator */}
      {data.hasValidationErrors ? (
        <ValidationIndicator
          nodeId={id}
          errors={(data.validationErrors as any[]) || []}
          warnings={[]}
          position="top-right"
          size="small"
        />
      ) : null}
    </Box>
  );
};

export default ConditionNode;
