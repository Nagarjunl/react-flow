import React, { useState, useCallback } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

interface RuleNodeProps {
  id: string;
  ruleName?: string;
  onUpdate: (id: string, updates: { ruleName?: string }) => void;
  onAdd?: (partData: { ruleName: string }) => void;
}

const RuleNode: React.FC<RuleNodeProps> = ({
  id,
  ruleName = "",
  onUpdate,
  onAdd,
}) => {
  const [ruleNameValue, setRuleNameValue] = useState(ruleName);

  const handleRuleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const ruleName = e.target.value;
      setRuleNameValue(ruleName);
      onUpdate(id, { ruleName });
    },
    [id, onUpdate]
  );

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #8b5cf6 0%, #8b5cf6dd 100%)",
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
        📋 Rule
      </Typography>

      {/* Rule Name Input with Add Button */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          size="small"
          value={ruleNameValue}
          onChange={handleRuleNameChange}
          placeholder="Enter rule name"
          label="Rule Name *"
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
            if (ruleNameValue && onAdd) {
              onAdd({ ruleName: ruleNameValue });
            }
          }}
          disabled={!ruleNameValue}
          sx={{ minWidth: "auto", px: 1 }}
        >
          Add
        </Button>
      </Box>
    </Box>
  );
};

export default RuleNode;
