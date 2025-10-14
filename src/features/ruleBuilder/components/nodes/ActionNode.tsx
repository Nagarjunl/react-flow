import React, { useState, useCallback } from "react";
import {
  Box,
  Typography,
  Autocomplete,
  TextField,
  Button,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { actionTypes } from "../../../../types/nodeTypes";

interface ActionNodeProps {
  id: string;
  actionType?: string;
  actionName?: string;
  onUpdate: (
    id: string,
    updates: { actionType?: string; actionName?: string }
  ) => void;
  onAdd?: (partData: { actionName: string }) => void;
}

const ActionNode: React.FC<ActionNodeProps> = ({
  id,
  actionType = "",
  actionName = "",
  onUpdate,
  onAdd,
}) => {
  const [selectedActionType, setSelectedActionType] = useState(actionType);
  const [actionNameValue, setActionNameValue] = useState(actionName);

  const handleActionTypeChange = useCallback(
    (_, newValue: any) => {
      const actionType = newValue ? newValue.value : "";
      setSelectedActionType(actionType);
      onUpdate(id, { actionType });
    },
    [id, onUpdate]
  );

  const handleActionNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const actionName = e.target.value;
      setActionNameValue(actionName);
      onUpdate(id, { actionName });
    },
    [id, onUpdate]
  );

  const selectedActionTypeOption = actionTypes.find(
    (type) => type.value === selectedActionType
  );

  return (
    <Box
      sx={{
        // background: "linear-gradient(135deg, #14b8a6 0%, #14b8a6dd 100%)",
        // color: "white",
        p: 1.5,
        borderRadius: 1.5,
        minWidth: "250px",
        boxShadow: 2,
        border: "1px solid transparent",
        transition: "all 0.2s ease",
        position: "relative",
      }}
    >
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

      {/* Action Type and Name in One Row */}
      <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
        <Autocomplete
          size="small"
          options={actionTypes}
          getOptionLabel={(option) => option.label || ""}
          value={selectedActionTypeOption || null}
          onChange={handleActionTypeChange}
          sx={{ flex: 1 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Action Type *"
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

        <TextField
          size="small"
          value={actionNameValue}
          onChange={handleActionNameChange}
          placeholder="Enter action name"
          label="Action Name *"
          variant="outlined"
          sx={{
            flex: 1,
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

        <Button
          size="small"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            if (actionNameValue && onAdd) {
              onAdd({ actionName: actionNameValue });
            }
          }}
          disabled={!actionNameValue}
          sx={{ minWidth: "auto", px: 1 }}
        >
          Add
        </Button>
      </Box>
    </Box>
  );
};

export default ActionNode;
