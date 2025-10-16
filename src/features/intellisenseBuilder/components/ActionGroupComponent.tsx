import React, { useCallback } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  TextField,
  Stack,
  Autocomplete,
  FormHelperText,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import RuleExpressionEditor from "./RuleExpressionEditor";
import { type ActionGroup, actionTypes } from "../types";
import { IconActionButton } from "../ui";
import {
  PLACEHOLDER_TEXT,
  HELPER_TEXT,
  VALIDATION_MESSAGES,
} from "../constants";

interface ActionGroupComponentProps {
  actionGroup: ActionGroup;
  ruleId: string;
  onUpdate: (
    ruleId: string,
    actionId: string,
    updates: Partial<ActionGroup>
  ) => void;
  onDelete: (ruleId: string, actionId: string) => void;
  editorTheme?: "light" | "dark";
}

const ActionGroupComponent: React.FC<ActionGroupComponentProps> = ({
  actionGroup,
  ruleId,
  onUpdate,
  onDelete,
  editorTheme = "light",
}) => {
  const handleExpressionChange = useCallback(
    (value: string) => {
      onUpdate(ruleId, actionGroup.id, { expression: value });
    },
    [ruleId, actionGroup.id, onUpdate]
  );

  return (
    <Accordion sx={{ mb: 1 }} defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}
        >
          <Typography variant="subtitle2" sx={{ minWidth: 120 }}>
            Action Group:
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
            OnSuccess Action
          </Typography>
          <IconActionButton
            tooltip="Delete Action Group"
            icon={<DeleteIcon fontSize="small" />}
            variant="delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(ruleId, actionGroup.id);
            }}
          />
        </Box>
      </AccordionSummary>

      <AccordionDetails>
        {/* Single Row Layout for Action Type and Action Name */}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          {/* Action Type Autocomplete */}
          <Box sx={{ flex: 1 }}>
            <Autocomplete
              size="small"
              options={actionTypes}
              getOptionLabel={(option) => option.label || ""}
              value={
                actionTypes.find(
                  (type) => type.value === actionGroup.actionType
                ) || null
              }
              onChange={(_, newValue) =>
                onUpdate(ruleId, actionGroup.id, {
                  actionType: newValue ? newValue.value : "",
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Action Name *"
                  variant="outlined"
                  placeholder={PLACEHOLDER_TEXT.ACTION_NAME}
                  required
                  error={!actionGroup.actionType.trim()}
                  helperText={
                    !actionGroup.actionType.trim()
                      ? VALIDATION_MESSAGES.ACTION_TYPE_REQUIRED
                      : ""
                  }
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

          {/* Expression */}
          <TextField
            label="Expression"
            value={actionGroup.expression || ""}
            onChange={(e) =>
              onUpdate(ruleId, actionGroup.id, {
                expression: e.target.value,
              })
            }
            size="small"
            sx={{
              flex: 1,
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
            placeholder={PLACEHOLDER_TEXT.ACTION_EXPRESSION}
          />
        </Stack>

        {/* Action Expression with Intellisense */}
        <Box sx={{ mt: 2 }}>
          <RuleExpressionEditor
            value={actionGroup.expression || ""}
            onChange={handleExpressionChange}
            label="Action Expression (Formula)"
            placeholder={PLACEHOLDER_TEXT.ACTION_EXPRESSION}
            height="80px"
            theme={editorTheme}
            required={true}
            hasError={!actionGroup.expression?.trim()}
          />
          {!actionGroup.expression?.trim() && (
            <FormHelperText error sx={{ mt: 0.5 }}>
              {VALIDATION_MESSAGES.ACTION_EXPRESSION_REQUIRED}
            </FormHelperText>
          )}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.5, display: "block", fontSize: "0.7rem" }}
          >
            {HELPER_TEXT.ACTION_EXPRESSION_TIP}
          </Typography>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default ActionGroupComponent;
