import React, { useState, useCallback } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { nodeColors, actionTypes } from "../../types/nodeTypes";
import { Box, Typography, TextField, Autocomplete, Alert } from "@mui/material";
import type { ActionNameNodeProps } from "../../types/nodeTypes";

const ActionNameNode: React.FC<ActionNameNodeProps> = ({
  data,
  isConnectable,
  id,
}) => {
  const [actionType, setActionType] = useState(data.actionType || "");
  const [actionName, setActionName] = useState(data.actionName || "");
  const [isValid, setIsValid] = useState(true);
  const { updateNodeData } = useReactFlow();

  const validateFields = useCallback(
    (type: string, name: string) => {
      const valid = type.trim() !== "" && name.trim() !== "";
      setIsValid(valid);

      // Update the node data using React Flow's recommended approach
      updateNodeData(id, {
        actionType: type,
        actionName: name,
        isValid: valid,
      });
    },
    [id, updateNodeData]
  );

  const handleActionNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setActionName(value);
      validateFields(actionType, value);
    },
    [actionType, validateFields]
  );

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${nodeColors.action} 0%, ${nodeColors.action}dd 100%)`,
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
          border: "2px solid #14b8a6",
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
        ⚡ Action
      </Typography>

      <Box sx={{ mb: 1 }}>
        <Autocomplete
          size="small"
          options={actionTypes}
          getOptionLabel={(option) => option.label || ""}
          value={actionTypes.find((type) => type.value === actionType) || null}
          onChange={(event, newValue) => {
            const value = newValue ? newValue.value : "";
            setActionType(value);
            validateFields(value, actionName);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Type *"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  fontSize: "0.625rem",
                  "& .MuiOutlinedInput-input": {
                    color: "#333",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: "0.625rem",
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

      <TextField
        size="small"
        value={actionName}
        onChange={handleActionNameChange}
        placeholder="Enter action name"
        label="Name *"
        variant="outlined"
        fullWidth
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "white",
            fontSize: "0.625rem",
            "& .MuiOutlinedInput-input": {
              color: "#333",
            },
          },
          "& .MuiInputLabel-root": {
            fontSize: "0.625rem",
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
          Both fields required
        </Alert>
      )}
    </Box>
  );
};

export default ActionNameNode;
