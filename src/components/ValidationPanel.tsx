import React from "react";
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Collapse,
  IconButton,
  Alert,
  AlertTitle,
  Divider,
} from "@mui/material";
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { ValidationError } from "../services/validationService";

interface ValidationPanelProps {
  errors: ValidationError[];
  warnings: ValidationError[];
  isValid: boolean;
  summary: string;
  isValidationInProgress: boolean;
  onErrorClick?: (error: ValidationError) => void;
}

const ValidationPanel: React.FC<ValidationPanelProps> = ({
  errors,
  warnings,
  isValid,
  summary,
  isValidationInProgress,
  onErrorClick,
}) => {
  const [expanded, setExpanded] = React.useState(true);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const getErrorIcon = (type: ValidationError["type"]) => {
    switch (type) {
      case "cycle":
        return <ErrorIcon color="error" />;
      case "disconnected":
        return <ErrorIcon color="error" />;
      case "operator_input":
        return <ErrorIcon color="error" />;
      case "operator_single":
        return <ErrorIcon color="error" />;
      case "invalid_connection":
        return <ErrorIcon color="error" />;
      default:
        return <ErrorIcon color="error" />;
    }
  };

  const getErrorColor = (type: ValidationError["type"]) => {
    switch (type) {
      case "cycle":
        return "error";
      case "disconnected":
        return "error";
      case "operator_input":
        return "error";
      case "operator_single":
        return "error";
      case "invalid_connection":
        return "error";
      default:
        return "error";
    }
  };

  const getErrorTypeLabel = (type: ValidationError["type"]) => {
    switch (type) {
      case "cycle":
        return "Cycle";
      case "disconnected":
        return "Disconnected";
      case "operator_input":
        return "Operator Input";
      case "operator_single":
        return "Single Input";
      case "invalid_connection":
        return "Invalid Connection";
      default:
        return "Error";
    }
  };

  if (isValidationInProgress) {
    return (
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Validating...
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "action.hover",
          },
        }}
        onClick={handleToggle}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isValid ? (
            <CheckCircleIcon color="success" />
          ) : (
            <ErrorIcon color="error" />
          )}
          <Typography variant="h6">Validation Status</Typography>
          <Chip
            label={summary}
            color={isValid ? "success" : "error"}
            size="small"
          />
        </Box>
        <IconButton size="small">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Divider />
        <Box sx={{ maxHeight: 400, overflow: "auto" }}>
          {isValid ? (
            <Box sx={{ p: 2 }}>
              <Alert severity="success">
                <AlertTitle>All Validations Passed</AlertTitle>
                Your rule groups are properly configured.
              </Alert>
            </Box>
          ) : (
            <Box>
              {errors.length > 0 && (
                <Box>
                  <Box sx={{ p: 2, pb: 1 }}>
                    <Typography variant="subtitle2" color="error" gutterBottom>
                      Errors ({errors.length})
                    </Typography>
                  </Box>
                  <List dense>
                    {errors.map((error, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          cursor: onErrorClick ? "pointer" : "default",
                          "&:hover": onErrorClick
                            ? {
                                backgroundColor: "action.hover",
                              }
                            : {},
                        }}
                        onClick={() => onErrorClick?.(error)}
                      >
                        <ListItemIcon>{getErrorIcon(error.type)}</ListItemIcon>
                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography variant="body2">
                                {error.message}
                              </Typography>
                              <Chip
                                label={getErrorTypeLabel(error.type)}
                                color={getErrorColor(error.type)}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            error.nodeId && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Node ID: {error.nodeId}
                                {error.ruleGroupId &&
                                  ` | Rule Group: ${error.ruleGroupId}`}
                              </Typography>
                            )
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {warnings.length > 0 && (
                <Box>
                  <Box sx={{ p: 2, pb: 1 }}>
                    <Typography
                      variant="subtitle2"
                      color="warning.main"
                      gutterBottom
                    >
                      Warnings ({warnings.length})
                    </Typography>
                  </Box>
                  <List dense>
                    {warnings.map((warning, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          cursor: onErrorClick ? "pointer" : "default",
                          "&:hover": onErrorClick
                            ? {
                                backgroundColor: "action.hover",
                              }
                            : {},
                        }}
                        onClick={() => onErrorClick?.(warning)}
                      >
                        <ListItemIcon>
                          <WarningIcon color="warning" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography variant="body2">
                                {warning.message}
                              </Typography>
                              <Chip
                                label="Warning"
                                color="warning"
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            warning.nodeId && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Node ID: {warning.nodeId}
                                {warning.ruleGroupId &&
                                  ` | Rule Group: ${warning.ruleGroupId}`}
                              </Typography>
                            )
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default ValidationPanel;
