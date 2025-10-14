import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  Tooltip,
  Alert,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
} from "@mui/icons-material";
import ConditionNode from "./nodes/ConditionNode";
import ActionNode from "./nodes/ActionNode";
import RuleNode from "./nodes/RuleNode";
import ValueNode from "./nodes/ValueNode";
import OperatorNode from "./nodes/OperatorNode";
import FunctionNode from "./nodes/FunctionNode";
import CollectionMethodNode from "./nodes/CollectionMethodNode";
import { validateExpression } from "../utils/dataSourceUtils";

interface ExpressionNode {
  id: string;
  type:
    | "condition"
    | "action"
    | "rule"
    | "value"
    | "operator"
    | "function"
    | "collectionMethod";
  data: any;
}

interface ExpressionPart {
  id: string;
  type: "data" | "operator" | "function" | "method" | "value";
  value: string;
  label: string;
}

interface ActionExpressionBuilderProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
}

const ActionExpressionBuilder: React.FC<ActionExpressionBuilderProps> = ({
  value,
  onChange,
  label,
  placeholder,
}) => {
  const [expressionNodes, setExpressionNodes] = useState<ExpressionNode[]>([]);
  const [expressionParts, setExpressionParts] = useState<ExpressionPart[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Add new node
  const addNode = useCallback((type: ExpressionNode["type"]) => {
    const newNode: ExpressionNode = {
      id: `node_${Date.now()}`,
      type,
      data: {},
    };
    setExpressionNodes((prev) => [...prev, newNode]);
  }, []);

  // Update node data
  const updateNode = useCallback((nodeId: string, updates: any) => {
    setExpressionNodes((prev) =>
      prev.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...updates } }
          : node
      )
    );
  }, []);

  // Add expression part from node
  const addExpressionPart = useCallback(
    (nodeId: string, partData: any, nodeType: ExpressionNode["type"]) => {
      console.log("addExpressionPart called:", { nodeId, partData, nodeType });

      let newPart: ExpressionPart;

      switch (nodeType) {
        case "condition":
          if (partData.tableName && partData.fieldName) {
            newPart = {
              id: `part_${Date.now()}`,
              type: "data",
              value: `${partData.tableName}.${partData.fieldName}`,
              label: `${partData.tableName}.${partData.fieldName}`,
            };
          } else return;
          break;
        case "action":
          if (partData.actionName) {
            newPart = {
              id: `part_${Date.now()}`,
              type: "value",
              value: partData.actionName,
              label: partData.actionName,
            };
          } else return;
          break;
        case "rule":
          if (partData.ruleName) {
            newPart = {
              id: `part_${Date.now()}`,
              type: "value",
              value: partData.ruleName,
              label: partData.ruleName,
            };
          } else return;
          break;
        case "value":
          if (partData.value) {
            newPart = {
              id: `part_${Date.now()}`,
              type: "value",
              value: partData.value,
              label: partData.value,
            };
          } else return;
          break;
        case "operator":
          if (partData.operator) {
            newPart = {
              id: `part_${Date.now()}`,
              type: "operator",
              value: partData.operator,
              label: partData.operator,
            };
          } else return;
          break;
        case "function":
          if (partData.parameters) {
            newPart = {
              id: `part_${Date.now()}`,
              type: "function",
              value: partData.parameters,
              label: partData.parameters,
            };
          } else return;
          break;
        case "collectionMethod":
          if (partData.parameters) {
            newPart = {
              id: `part_${Date.now()}`,
              type: "method",
              value: partData.parameters,
              label: partData.parameters,
            };
          } else return;
          break;
        default:
          return;
      }

      setExpressionParts((prev) => {
        console.log("Adding new part:", newPart);
        console.log("Previous parts:", prev);
        return [...prev, newPart];
      });

      // Clear the node data and hide the node
      setExpressionNodes((prev) => prev.filter((n) => n.id !== nodeId));
    },
    []
  );

  // Remove expression part
  const removeExpressionPart = useCallback((partId: string) => {
    setExpressionParts((prev) => prev.filter((part) => part.id !== partId));
  }, []);

  // Reorder expression parts
  const reorderExpressionParts = useCallback(
    (fromIndex: number, toIndex: number) => {
      console.log("Reordering parts:", { fromIndex, toIndex });
      setExpressionParts((prev) => {
        const newParts = [...prev];
        const [removed] = newParts.splice(fromIndex, 1);
        newParts.splice(toIndex, 0, removed);
        console.log(
          "New order:",
          newParts.map((p) => p.label)
        );
        return newParts;
      });
    },
    []
  );

  // Handle drag start
  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
    e.dataTransfer.effectAllowed = "move";
    setDraggedIndex(index);
  }, []);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
  }, []);

  // Handle drag over
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  // Handle drop
  const handleDrop = useCallback(
    (e: React.DragEvent, dropIndex: number) => {
      e.preventDefault();
      const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));
      if (dragIndex !== dropIndex) {
        reorderExpressionParts(dragIndex, dropIndex);
      }
      setDraggedIndex(null);
    },
    [reorderExpressionParts]
  );

  // Update expression from parts
  useEffect(() => {
    const expression = expressionParts.map((part) => part.value).join(" ");
    console.log("Expression parts changed:", expressionParts);
    console.log("Generated expression:", expression);
    onChange(expression);
  }, [expressionParts]); // Removed onChange from dependencies to prevent infinite loop

  // Remove node
  const removeNode = useCallback((nodeId: string) => {
    setExpressionNodes((prev) => prev.filter((node) => node.id !== nodeId));
  }, []);

  // Generate expression from nodes
  const generateExpression = useCallback(() => {
    const expression = expressionNodes
      .map((node) => {
        switch (node.type) {
          case "condition":
            return node.data.tableName && node.data.fieldName
              ? `${node.data.tableName}.${node.data.fieldName}`
              : "";
          case "action":
            return node.data.actionName || "";
          case "rule":
            return node.data.ruleName || "";
          case "value":
            return node.data.value || "";
          case "operator":
            return node.data.operator || "";
          case "function":
            return node.data.parameters || "";
          case "collectionMethod":
            return node.data.parameters || "";
          default:
            return "";
        }
      })
      .filter(Boolean)
      .join(" ");

    onChange(expression);
    return expression;
  }, [expressionNodes]); // Removed onChange from dependencies to prevent infinite loop

  // Validate expression
  const validateCurrentExpression = useCallback(() => {
    const expression = generateExpression();
    const validation = validateExpression(expression);
    setValidationErrors(validation.errors);
    return validation.isValid;
  }, [generateExpression]);

  // Render node component based on type
  const renderNode = (node: ExpressionNode) => {
    const commonProps = {
      id: node.id,
      onUpdate: updateNode,
      onAdd: (partData: any) => addExpressionPart(node.id, partData, node.type),
    };

    switch (node.type) {
      case "condition":
        return (
          <ConditionNode
            {...commonProps}
            tableName={node.data.tableName}
            fieldName={node.data.fieldName}
          />
        );
      case "action":
        return (
          <ActionNode
            {...commonProps}
            actionType={node.data.actionType}
            actionName={node.data.actionName}
          />
        );
      case "rule":
        return <RuleNode {...commonProps} ruleName={node.data.ruleName} />;
      case "value":
        return <ValueNode {...commonProps} value={node.data.value} />;
      case "operator":
        return (
          <OperatorNode
            {...commonProps}
            operator={node.data.operator}
            fieldType={node.data.fieldType}
          />
        );
      case "function":
        return (
          <FunctionNode
            {...commonProps}
            functionName={node.data.functionName}
            parameters={node.data.parameters}
          />
        );
      case "collectionMethod":
        return (
          <CollectionMethodNode
            {...commonProps}
            methodName={node.data.methodName}
            parameters={node.data.parameters}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        {label}
      </Typography>

      {/* Add Node Buttons */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          Add Nodes:
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => addNode("condition")}
          >
            Add Condition
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => addNode("operator")}
          >
            Add Operator
          </Button>

          <Button
            size="small"
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => addNode("value")}
          >
            Add Value
          </Button>

          <Button
            size="small"
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => addNode("function")}
          >
            Add Function
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => addNode("collectionMethod")}
          >
            Add Collection Method
          </Button>
        </Box>
      </Box>

      {/* Expression Parts as Draggable Chips */}
      {expressionParts.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" gutterBottom>
            Expression Parts (drag to reorder):
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            {expressionParts.map((part, index) => (
              <Chip
                key={part.id}
                label={part.label}
                onDelete={() => removeExpressionPart(part.id)}
                color={
                  part.type === "data"
                    ? "primary"
                    : part.type === "operator"
                    ? "secondary"
                    : part.type === "function"
                    ? "success"
                    : part.type === "method"
                    ? "warning"
                    : "default"
                }
                size="small"
                sx={{
                  mb: 1,
                  cursor: "grab",
                  "&:active": {
                    cursor: "grabbing",
                  },
                  "&:hover": {
                    transform: "scale(1.05)",
                    transition: "transform 0.2s ease",
                  },
                  opacity: draggedIndex === index ? 0.5 : 1,
                  transform: draggedIndex === index ? "rotate(5deg)" : "none",
                  transition: "all 0.2s ease",
                }}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* Render Nodes */}
      {expressionNodes.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" gutterBottom>
            Expression Nodes:
          </Typography>
          <Stack spacing={2}>
            {expressionNodes.map((node) => (
              <Box key={node.id} sx={{ position: "relative" }}>
                {renderNode(node)}
                <IconButton
                  size="small"
                  onClick={() => removeNode(node.id)}
                  sx={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    bgcolor: "error.main",
                    color: "white",
                    "&:hover": {
                      bgcolor: "error.dark",
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {/* Manual Expression Input */}
      <TextField
        label="Expression"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
        multiline
        rows={3}
        placeholder={placeholder}
        sx={{
          mt: 2,
          "& .MuiOutlinedInput-root": {
            fontFamily: "monospace",
            fontSize: "14px",
          },
        }}
      />

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {validationErrors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </Alert>
      )}

      {/* Test Button */}
      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <Tooltip title="Test Expression">
          <IconButton onClick={validateCurrentExpression} color="primary">
            <PlayIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default ActionExpressionBuilder;
