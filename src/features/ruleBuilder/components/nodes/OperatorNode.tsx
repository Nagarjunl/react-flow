import React, { useState, useCallback } from "react";
import {
  Box,
  Typography,
  Autocomplete,
  TextField,
  Button,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { getOperatorsForType } from "../../utils/dataSourceUtils";

interface OperatorNodeProps {
  id: string;
  operator?: string;
  fieldType?: string;
  onUpdate: (id: string, updates: { operator?: string }) => void;
  onAdd?: (partData: { operator: string }) => void;
}

const OperatorNode: React.FC<OperatorNodeProps> = ({
  id,
  operator = "",
  fieldType = "numeric",
  onUpdate,
  onAdd,
}) => {
  const [selectedOperator, setSelectedOperator] = useState(operator);

  const availableOperators = getOperatorsForType(fieldType);

  const handleOperatorChange = useCallback(
    (_: any, newValue: any) => {
      const operator = newValue ? newValue.value : "";
      setSelectedOperator(operator);
      onUpdate(id, { operator });
    },
    [id, onUpdate]
  );

  const selectedOperatorOption = availableOperators.find(
    (op) => op.value === selectedOperator
  );

  return (
    <Box
      sx={{
        // background: "linear-gradient(135deg, #f59e0b 0%, #f59e0bdd 100%)",
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
        ⚡ Operator
      </Typography>

      {/* Operator Selection with Add Button */}
      <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
        <Autocomplete
          size="small"
          options={availableOperators}
          getOptionLabel={(option) => option.label || ""}
          value={selectedOperatorOption || null}
          onChange={handleOperatorChange}
          sx={{ flex: 1 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Operator *"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  fontSize: "0.625rem",
                  "& .MuiOutlinedInput-input": {
                    color: "#333",
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

        <Button
          size="small"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            if (selectedOperator && onAdd) {
              onAdd({ operator: selectedOperator });
            }
          }}
          disabled={!selectedOperator}
          sx={{ minWidth: "auto", px: 1 }}
        >
          Add
        </Button>
      </Box>

      {/* Field Type Display */}
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
          Type: {fieldType}
        </Typography>
      </Box>
    </Box>
  );
};

export default OperatorNode;
