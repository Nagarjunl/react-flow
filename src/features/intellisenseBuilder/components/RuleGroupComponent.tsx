import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  FormHelperText,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  DragIndicator as DragIndicatorIcon,
} from "@mui/icons-material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ActionGroupComponent from "./ActionGroupComponent";
import RuleExpressionEditor from "./RuleExpressionEditor";
import type { RuleGroup, ActionGroup } from "../types";
import { IconActionButton } from "../ui";
import {
  PLACEHOLDER_TEXT,
  HELPER_TEXT,
  VALIDATION_MESSAGES,
} from "../constants";

interface RuleGroupComponentProps {
  ruleGroup: RuleGroup;
  onUpdate: (ruleId: string, updates: Partial<RuleGroup>) => void;
  onDelete: (ruleId: string) => void;
  onAddActionGroup: (ruleId: string) => void;
  onUpdateActionGroup: (
    ruleId: string,
    actionId: string,
    updates: Partial<ActionGroup>
  ) => void;
  onDeleteActionGroup: (ruleId: string, actionId: string) => void;
  editorTheme?: "light" | "dark";
}

const RuleGroupComponent: React.FC<RuleGroupComponentProps> = ({
  ruleGroup,
  onUpdate,
  onDelete,
  onAddActionGroup,
  onUpdateActionGroup,
  onDeleteActionGroup,
  editorTheme = "light",
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ruleGroup.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Accordion sx={{ mb: 2 }} defaultExpanded ref={setNodeRef} style={style}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}
        >
          <IconActionButton
            tooltip="Drag to reorder"
            icon={<DragIndicatorIcon fontSize="small" />}
            variant="drag"
            {...attributes}
            {...listeners}
          />
          <Box sx={{ flex: 1 }}>
            <TextField
              placeholder={PLACEHOLDER_TEXT.RULE_NAME}
              value={ruleGroup.ruleName}
              onChange={(e) =>
                onUpdate(ruleGroup.id, {
                  ruleName: e.target.value,
                })
              }
              size="small"
              fullWidth
              required
              error={!ruleGroup.ruleName.trim()}
              helperText={
                !ruleGroup.ruleName.trim()
                  ? VALIDATION_MESSAGES.RULE_NAME_REQUIRED
                  : ""
              }
              onClick={(e) => e.stopPropagation()}
            />
          </Box>
          <IconActionButton
            tooltip="Delete Rule"
            icon={<DeleteIcon fontSize="small" />}
            variant="delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(ruleGroup.id);
            }}
          />
        </Box>
      </AccordionSummary>

      <AccordionDetails>
        {/* Rule Expression */}
        <Box sx={{ mb: 3 }}>
          <RuleExpressionEditor
            value={ruleGroup.expression}
            onChange={(value) => onUpdate(ruleGroup.id, { expression: value })}
            label="Rule Expression (Condition)"
            placeholder={PLACEHOLDER_TEXT.RULE_EXPRESSION}
            height="100px"
            theme={editorTheme}
            required={true}
            hasError={!ruleGroup.expression.trim()}
          />
          {!ruleGroup.expression.trim() && (
            <FormHelperText error sx={{ mt: 0.5 }}>
              {VALIDATION_MESSAGES.RULE_EXPRESSION_REQUIRED}
            </FormHelperText>
          )}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.5, display: "block" }}
          >
            {HELPER_TEXT.RULE_EXPRESSION_TIP}
          </Typography>
        </Box>

        {/* Action Groups */}
        <Box sx={{ mt: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="subtitle2">Action Groups:</Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => onAddActionGroup(ruleGroup.id)}
              size="small"
            >
              Add Action Group
            </Button>
          </Box>

          {ruleGroup.actionGroups.length > 0 && (
            <Stack spacing={2}>
              {ruleGroup.actionGroups.map((actionGroup) => (
                <ActionGroupComponent
                  key={actionGroup.id}
                  actionGroup={actionGroup}
                  ruleId={ruleGroup.id}
                  onUpdate={onUpdateActionGroup}
                  onDelete={onDeleteActionGroup}
                  editorTheme={editorTheme}
                />
              ))}
            </Stack>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default RuleGroupComponent;
