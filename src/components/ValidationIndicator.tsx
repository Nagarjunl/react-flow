import React from "react";
import { Box, Tooltip, IconButton, Badge } from "@mui/material";
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { ValidationError } from "../services/validationService";

interface ValidationIndicatorProps {
  nodeId: string;
  errors: ValidationError[];
  warnings: ValidationError[];
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  size?: "small" | "medium" | "large";
  onErrorClick?: (error: ValidationError) => void;
}

const ValidationIndicator: React.FC<ValidationIndicatorProps> = ({
  nodeId,
  errors,
  warnings,
  position = "top-right",
  size = "small",
  onErrorClick,
}) => {
  const nodeErrors = errors.filter((error) => error.nodeId === nodeId);
  const nodeWarnings = warnings.filter((error) => error.nodeId === nodeId);

  const hasErrors = nodeErrors.length > 0;
  const hasWarnings = nodeWarnings.length > 0;
  const hasIssues = hasErrors || hasWarnings;

  if (!hasIssues) {
    return null;
  }

  const getPositionStyles = () => {
    const baseStyles = {
      position: "absolute" as const,
      zIndex: 1000,
    };

    switch (position) {
      case "top-right":
        return { ...baseStyles, top: 4, right: 4 };
      case "top-left":
        return { ...baseStyles, top: 4, left: 4 };
      case "bottom-right":
        return { ...baseStyles, bottom: 4, right: 4 };
      case "bottom-left":
        return { ...baseStyles, bottom: 4, left: 4 };
      default:
        return { ...baseStyles, top: 4, right: 4 };
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "small":
        return 16;
      case "medium":
        return 20;
      case "large":
        return 24;
      default:
        return 16;
    }
  };

  const getTooltipTitle = () => {
    const errorCount = nodeErrors.length;
    const warningCount = nodeWarnings.length;

    if (errorCount > 0 && warningCount > 0) {
      return `${errorCount} error(s) and ${warningCount} warning(s)`;
    } else if (errorCount > 0) {
      return `${errorCount} error(s)`;
    } else {
      return `${warningCount} warning(s)`;
    }
  };

  const getTooltipContent = () => {
    const allIssues = [...nodeErrors, ...nodeWarnings];
    return (
      <Box>
        <Box sx={{ mb: 1 }}>
          <strong>Validation Issues:</strong>
        </Box>
        {allIssues.map((issue, index) => (
          <Box key={index} sx={{ mb: 0.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {issue.type === "cycle" ||
              issue.type === "disconnected" ||
              issue.type === "operator_input" ||
              issue.type === "operator_single" ||
              issue.type === "invalid_connection" ? (
                <ErrorIcon sx={{ fontSize: 12 }} color="error" />
              ) : (
                <WarningIcon sx={{ fontSize: 12 }} color="warning" />
              )}
              <span style={{ fontSize: "12px" }}>{issue.message}</span>
            </Box>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={getPositionStyles()}>
      <Tooltip title={getTooltipContent()} arrow placement="top">
        <IconButton
          size="small"
          sx={{
            p: 0.5,
            minWidth: "auto",
            width: getIconSize() + 8,
            height: getIconSize() + 8,
            backgroundColor: hasErrors ? "error.main" : "warning.main",
            color: "white",
            "&:hover": {
              backgroundColor: hasErrors ? "error.dark" : "warning.dark",
            },
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (onErrorClick && nodeErrors.length > 0) {
              onErrorClick(nodeErrors[0]);
            }
          }}
        >
          {hasErrors ? (
            <ErrorIcon sx={{ fontSize: getIconSize() }} />
          ) : (
            <WarningIcon sx={{ fontSize: getIconSize() }} />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ValidationIndicator;
