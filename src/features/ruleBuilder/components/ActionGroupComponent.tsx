import React from "react";
import {
  Paper,
  Box,
  Typography,
  TextField,
  IconButton,
  Stack,
  Autocomplete,
  Tooltip,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { actionTypes } from "../../../types/nodeTypes";
import type { ActionGroup } from "../types";

interface ActionGroupComponentProps {
  actionGroup: ActionGroup;
  ruleId: string;
  onUpdate: (
    ruleId: string,
    actionId: string,
    updates: Partial<ActionGroup>
  ) => void;
  onDelete: (ruleId: string, actionId: string) => void;
}

const ActionGroupComponent: React.FC<ActionGroupComponentProps> = ({
  actionGroup,
  ruleId,
  onUpdate,
  onDelete,
}) => {
  return (
    <Paper key={actionGroup.id} sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 1,
        }}
      >
        <Typography variant="subtitle2" sx={{ minWidth: 100 }}>
          Action Group:
        </Typography>
        <Tooltip title="Delete Action Group">
          <IconButton
            size="small"
            onClick={() => onDelete(ruleId, actionGroup.id)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Stack spacing={2}>
        {/* Action Type Autocomplete */}
        <Autocomplete
          size="small"
          options={actionTypes}
          getOptionLabel={(option) => option.label || ""}
          value={
            actionTypes.find((type) => type.value === actionGroup.actionType) ||
            null
          }
          onChange={(_, newValue) =>
            onUpdate(ruleId, actionGroup.id, {
              actionType: newValue ? newValue.value : "",
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Action Type *"
              variant="outlined"
              placeholder="Select action type..."
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

        {/* Action Name */}
        <TextField
          label="Action Name *"
          value={actionGroup.actionName}
          onChange={(e) =>
            onUpdate(ruleId, actionGroup.id, {
              actionName: e.target.value,
            })
          }
          size="small"
          fullWidth
          placeholder="Enter action name..."
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
          }}
        />
      </Stack>
    </Paper>
  );
};

export default ActionGroupComponent;
