import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import ActionExpressionBuilder from "./ActionExpressionBuilder";
import ActionGroupComponent from "./ActionGroupComponent";
import type { RuleGroup } from "../types";

interface RuleGroupComponentProps {
  ruleGroup: RuleGroup;
  onUpdate: (ruleId: string, updates: Partial<RuleGroup>) => void;
  onDelete: (ruleId: string) => void;
  onAddActionGroup: (ruleId: string) => void;
  onUpdateActionGroup: (ruleId: string, actionId: string, updates: any) => void;
  onDeleteActionGroup: (ruleId: string, actionId: string) => void;
}

const RuleGroupComponent: React.FC<RuleGroupComponentProps> = ({
  ruleGroup,
  onUpdate,
  onDelete,
  onAddActionGroup,
  onUpdateActionGroup,
  onDeleteActionGroup,
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
        {/* Expression Input */}
        <Box sx={{ mb: 2 }}>
          <ActionExpressionBuilder
            value={ruleGroup.expression}
            onChange={(value) => onUpdate(ruleGroup.id, { expression: value })}
            label="Rule Expression"
            placeholder="Enter rule expression..."
          />
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
