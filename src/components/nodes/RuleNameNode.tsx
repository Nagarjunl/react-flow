import React, { useState, useCallback } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { nodeColors } from "../../types/nodeTypes";
import { Box, Typography, TextField, Alert } from "@mui/material";
import type { RuleNameNodeProps } from "../../types/nodeTypes";

const RuleNameNode: React.FC<RuleNameNodeProps> = ({
  data,
  isConnectable,
  id,
}) => {
  const [ruleName, setRuleName] = useState(data.ruleName || "");
  const [isValid, setIsValid] = useState(true);
  const { updateNodeData } = useReactFlow();

  const handleRuleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setRuleName(value);
      const valid = value.trim() !== "";
      setIsValid(valid);

      // Update the node data using React Flow's recommended approach
      updateNodeData(id, {
        ruleName: value,
        isValid: valid,
      });
    },
    [id, updateNodeData]
  );

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${nodeColors.rule} 0%, ${nodeColors.rule}dd 100%)`,
        color: "white",
        p: 1.5,
        borderRadius: 1.5,
        minWidth: "200px",
        boxShadow: 2,
        border: isValid ? "1px solid transparent" : "1px solid #ef4444",
        transition: "all 0.2s ease",
        position: "relative",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{
          background: "#fff",
          width: "10px",
          height: "10px",
          border: "2px solid #8b5cf6",
        }}
        isConnectable={isConnectable}
      />

      <Typography
        variant="subtitle2"
        sx={{
          mb: 1,
          fontWeight: "bold",
          fontSize: "0.75rem",
          color: "white",
        }}
      >
        📋 Rule Name
      </Typography>

      <TextField
        size="small"
        value={ruleName}
        onChange={handleRuleNameChange}
        placeholder="Enter rule name"
        label="Rule Name *"
        variant="outlined"
        fullWidth
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "white",
            fontSize: "0.6875rem",
            "& .MuiOutlinedInput-input": {
              color: "#333",
            },
          },
          "& .MuiInputLabel-root": {
            fontSize: "0.6875rem",
            color: "#666",
          },
        }}
      />

      {!isValid && (
        <Alert
          severity="error"
          sx={{
            mt: 0.5,
            fontSize: "0.6rem",
            "& .MuiAlert-message": {
              fontSize: "0.6rem",
            },
          }}
        >
          Required
        </Alert>
      )}
    </Box>
  );
};

export default RuleNameNode;
