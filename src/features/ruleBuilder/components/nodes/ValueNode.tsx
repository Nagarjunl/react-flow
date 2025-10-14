import React, { useState, useCallback } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

interface ValueNodeProps {
  id: string;
  value?: string;
  onUpdate: (id: string, updates: { value?: string }) => void;
  onAdd?: (partData: { value: string }) => void;
}

const ValueNode: React.FC<ValueNodeProps> = ({
  id,
  value = "",
  onUpdate,
  onAdd,
}) => {
  const [valueInput, setValueInput] = useState(value);

  const handleValueChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValueInput(value);
      onUpdate(id, { value });
    },
    [id, onUpdate]
  );

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #f59e0b 0%, #f59e0bdd 100%)",
        color: "white",
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
        🔢 Value
      </Typography>

      {/* Value Input with Add Button */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          size="small"
          value={valueInput}
          onChange={handleValueChange}
          placeholder="Enter value"
          label="Value *"
          variant="outlined"
          sx={{
            flex: 1,
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
          }}
        />

        <Button
          size="small"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            if (valueInput && onAdd) {
              onAdd({ value: valueInput });
            }
          }}
          disabled={!valueInput}
          sx={{ minWidth: "auto", px: 1 }}
        >
          Add
        </Button>
      </Box>
    </Box>
  );
};

export default ValueNode;
