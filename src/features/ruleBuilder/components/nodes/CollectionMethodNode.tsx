import React, { useState, useCallback } from "react";
import {
  Box,
  Typography,
  Autocomplete,
  TextField,
  Button,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import ActionExpressionBuilder from "../ActionExpressionBuilder";

interface CollectionMethodNodeProps {
  id: string;
  methodName?: string;
  onUpdate: (
    id: string,
    updates: { methodName?: string; parameters?: string }
  ) => void;
  onAdd?: (partData: { parameters: string }) => void;
}

const COLLECTION_METHODS = [
  {
    id: "where",
    label: ".where()",
    template: ".where(item => item.property == value)",
    description: "Filter collection based on condition",
  },
  {
    id: "sum",
    label: ".sum()",
    template: ".sum(item => item.property)",
    description: "Sum all values in collection",
  },
  {
    id: "average",
    label: ".average()",
    template: ".average(item => item.property)",
    description: "Calculate average of collection",
  },
  {
    id: "count",
    label: ".count()",
    template: ".count()",
    description: "Count items in collection",
  },
  {
    id: "max",
    label: ".max()",
    template: ".max(item => item.property)",
    description: "Find maximum value",
  },
  {
    id: "min",
    label: ".min()",
    template: ".min(item => item.property)",
    description: "Find minimum value",
  },
  {
    id: "first",
    label: ".first()",
    template: ".first()",
    description: "Get first item",
  },
  {
    id: "last",
    label: ".last()",
    template: ".last()",
    description: "Get last item",
  },
  {
    id: "any",
    label: ".any()",
    template: ".any(item => item.property == value)",
    description: "Check if any items match condition",
  },
  {
    id: "all",
    label: ".all()",
    template: ".all(item => item.property == value)",
    description: "Check if all items match condition",
  },
];

const CollectionMethodNode: React.FC<CollectionMethodNodeProps> = ({
  id,
  methodName = "",
  onUpdate,
  onAdd,
}) => {
  const [selectedMethod, setSelectedMethod] = useState(methodName);
  const [expressionValue, setExpressionValue] = useState("");

  const handleMethodChange = useCallback(
    (_: any, newValue: any) => {
      const methodName = newValue ? newValue.id : "";
      setSelectedMethod(methodName);
      setExpressionValue(""); // Clear expression when method changes
      onUpdate(id, { methodName, parameters: "" });
    },
    [id, onUpdate]
  );

  const handleExpressionChange = useCallback((value: string) => {
    setExpressionValue(value);
  }, []);

  const handleAddMethod = useCallback(() => {
    if (selectedMethod && onAdd) {
      // Create the complete method call with the expression as parameters
      const methodCall = expressionValue
        ? `.${selectedMethod}(${expressionValue})`
        : `.${selectedMethod}()`;

      onAdd({ parameters: methodCall });
    }
  }, [selectedMethod, expressionValue, onAdd]);

  const selectedMethodOption = COLLECTION_METHODS.find(
    (method) => method.id === selectedMethod
  );

  return (
    <Box
      sx={{
        // background: "linear-gradient(135deg, #8b5cf6 0%, #8b5cf6dd 100%)",
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
        📊 Collection Method
      </Typography>

      {/* Method Selection */}
      <Box sx={{ mb: 2 }}>
        <Autocomplete
          size="small"
          options={COLLECTION_METHODS}
          getOptionLabel={(option) => option.label || ""}
          value={selectedMethodOption || null}
          onChange={handleMethodChange}
          sx={{ width: "100%" }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Method *"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  // backgroundColor: "white",
                  fontSize: "0.625rem",
                  "& .MuiOutlinedInput-input": {
                    // color: "#333",
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

      {/* Expression Builder for Parameters */}
      {selectedMethod && (
        <Box sx={{ mb: 2 }}>
          <ActionExpressionBuilder
            value={expressionValue}
            onChange={handleExpressionChange}
            label="Method Parameters"
            placeholder={`Enter parameters for .${selectedMethod} (e.g., item => item.property == value)`}
          />
        </Box>
      )}

      {/* Add Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          size="small"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddMethod}
          disabled={!selectedMethod}
          sx={{ minWidth: "auto", px: 2 }}
        >
          Add
        </Button>
      </Box>

      {/* Description */}
      {selectedMethodOption && (
        <Box sx={{ mt: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: "white",
              fontSize: "0.6rem",
              bgcolor: "rgba(255,255,255,0.2)",
              px: 1,
              py: 0.5,
              borderRadius: 0.5,
            }}
          >
            {selectedMethodOption.description}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CollectionMethodNode;
