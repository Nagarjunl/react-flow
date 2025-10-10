import React, { useState } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { nodeColors, conditionalOperators } from "../../types/nodeTypes";
import { Box, Typography, Autocomplete, TextField, Alert } from "@mui/material";
import type { ConditionalOperatorNodeProps } from "../../types/nodeTypes";
import ValidationIndicator from "../ValidationIndicator";
import { ValidationError } from "../../services/validationService";

const ConditionalOperatorNode: React.FC<ConditionalOperatorNodeProps> = ({
  data,
  isConnectable,
  id,
}) => {
  const [operator, setOperator] = useState(data.operator || "");
  const [isValid, setIsValid] = useState(true);
  const { updateNodeData } = useReactFlow();

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${nodeColors.conditionalOperator} 0%, ${nodeColors.conditionalOperator}dd 100%)`,
        color: "white",
        p: 2,
        borderRadius: 2,
        minWidth: "200px",
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
        🔗 Conditional Operator
      </Typography>

      <Autocomplete
        size="small"
        options={conditionalOperators}
        getOptionLabel={(option) => option.label || ""}
        value={conditionalOperators.find((op) => op.value === operator) || null}
        onChange={(event, newValue) => {
          const value = newValue ? newValue.value : "";
          setOperator(value);
          const valid = value.trim() !== "";
          setIsValid(valid);

          // Update the node data using React Flow's recommended approach
          updateNodeData(id, {
            operator: value,
            isValid: valid,
          });
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Operator *"
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
          Operator is required
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
          border: "2px solid #f59e0b",
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
          border: "2px solid #f59e0b",
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
          onErrorClick={
            data.onErrorClick as ((error: ValidationError) => void) | undefined
          }
        />
      ) : null}
    </Box>
  );
};

export default ConditionalOperatorNode;
