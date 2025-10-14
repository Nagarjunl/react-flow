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

interface FunctionNodeProps {
  id: string;
  functionName?: string;
  onUpdate: (
    id: string,
    updates: { functionName?: string; parameters?: string }
  ) => void;
  onAdd?: (partData: { parameters: string }) => void;
}

const FUNCTIONS = [
  { id: "Math.min", label: "Math.min()" },
  { id: "Math.max", label: "Math.max()" },
  { id: "Math.round", label: "Math.round()" },
  { id: "Math.floor", label: "Math.floor()" },
  { id: "Math.ceil", label: "Math.ceil()" },
  { id: "Math.abs", label: "Math.abs()" },
  { id: "Math.sqrt", label: "Math.sqrt()" },
  { id: "Math.pow", label: "Math.pow()" },
];

const FunctionNode: React.FC<FunctionNodeProps> = ({
  id,
  functionName = "",
  onUpdate,
  onAdd,
}) => {
  const [selectedFunction, setSelectedFunction] = useState(functionName);
  const [expressionValue, setExpressionValue] = useState("");

  const selectedFunctionOption = FUNCTIONS.find(
    (func) => func.id === selectedFunction
  );

  const handleFunctionChange = useCallback(
    (_: any, newValue: any) => {
      const functionName = newValue ? newValue.id : "";
      setSelectedFunction(functionName);
      setExpressionValue(""); // Clear expression when function changes
      onUpdate(id, { functionName, parameters: "" });
    },
    [id, onUpdate]
  );

  const handleExpressionChange = useCallback((value: string) => {
    setExpressionValue(value);
  }, []);

  const handleAddFunction = useCallback(() => {
    if (selectedFunction && onAdd) {
      // Create the complete function call with the expression as parameters
      const functionCall = expressionValue
        ? `${selectedFunction}(${expressionValue})`
        : `${selectedFunction}()`;

      onAdd({ parameters: functionCall });
    }
  }, [selectedFunction, expressionValue, onAdd]);

  return (
    <Box
      sx={{
        // background: "linear-gradient(135deg, #10b981 0%, #10b981dd 100%)",
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
        🔧 Function
      </Typography>

      {/* Function Selection */}
      <Box sx={{ mb: 2 }}>
        <Autocomplete
          size="small"
          options={FUNCTIONS}
          getOptionLabel={(option) => option.label || ""}
          value={selectedFunctionOption || null}
          onChange={handleFunctionChange}
          sx={{ width: "100%" }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Function *"
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
      {selectedFunction && (
        <Box sx={{ mb: 2 }}>
          <ActionExpressionBuilder
            value={expressionValue}
            onChange={handleExpressionChange}
            label="Function Parameters"
            placeholder={`Enter parameters for ${selectedFunction} (e.g., sale.Amount * 0.03 + 200, 50)`}
          />
        </Box>
      )}

      {/* Add Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          size="small"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddFunction}
          disabled={!selectedFunction}
          sx={{ minWidth: "auto", px: 2 }}
        >
          Add
        </Button>
      </Box>
    </Box>
  );
};

export default FunctionNode;
