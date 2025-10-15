import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import ActionGroupComponent from "./ActionGroupComponent";
import RuleExpressionEditor from "./RuleExpressionEditor";
import type { RuleGroup } from "../types";

interface RuleGroupComponentProps {
  ruleGroup: RuleGroup;
  onUpdate: (ruleId: string, updates: Partial<RuleGroup>) => void;
  onDelete: (ruleId: string) => void;
  onAddActionGroup: (ruleId: string) => void;
  onUpdateActionGroup: (ruleId: string, actionId: string, updates: any) => void;
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
  return (
    <Card sx={{ mb: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 2 }}>
        <TextField
          placeholder="Enter rule name"
          value={ruleGroup.ruleName}
          onChange={(e) =>
            onUpdate(ruleGroup.id, {
              ruleName: e.target.value,
            })
          }
          size="small"
          sx={{ flex: 1 }}
        />
        <Tooltip title="Delete Rule">
          <IconButton
            size="small"
            onClick={() => onDelete(ruleGroup.id)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => onAddActionGroup(ruleGroup.id)}
          size="small"
        >
          Add Action Group
        </Button>
      </Box>

      <CardContent>
        {/* Rule Expression */}
        <Box sx={{ mb: 3 }}>
          <RuleExpressionEditor
            value={ruleGroup.expression}
            onChange={(value) => onUpdate(ruleGroup.id, { expression: value })}
            label="Rule Expression (Condition) *"
            placeholder="e.g., metrics.TargetAchievement >= 120 AND metrics.AttendancePercentage >= 95"
            height="100px"
            theme={editorTheme}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.5, display: "block" }}
          >
            Tip: Type table names (metrics, user, sales) and use '.' to see
            available fields. Press Ctrl+Space for suggestions.
          </Typography>
        </Box>

        {/* Action Groups */}
        {ruleGroup.actionGroups.length > 0 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Action Groups:
            </Typography>
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
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RuleGroupComponent;
