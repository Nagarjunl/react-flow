import React, { useState, useCallback } from "react";
import { Box, Typography, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { getOperatorsForType } from "../../utils/dataSourceUtils";
import OperatorModal from "../OperatorModal";

interface OperatorNodeProps {
  id: string;
  fieldType?: string;
  onUpdate: (id: string, updates: { operator?: string }) => void;
  onAdd?: (partData: { operator: string }) => void;
}

const OperatorNode: React.FC<OperatorNodeProps> = ({
  id,
  fieldType = "numeric",
  onUpdate,
  onAdd,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const availableOperators = getOperatorsForType(fieldType);

  const handleOperatorSelect = useCallback(
    (operator: { value: string; label: string; description?: string }) => {
      onUpdate(id, { operator: operator.value });
      if (onAdd) {
        onAdd({ operator: operator.value });
      }
    },
    [id, onUpdate, onAdd]
  );

  const handleAddClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

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

      {/* Add Operator Button */}
      <Box sx={{ mb: 1 }}>
        <Button
          size="small"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
          fullWidth
          sx={{
            backgroundColor: "#f59e0b",
            color: "white",
            fontSize: "0.75rem",
            fontWeight: 600,
            textTransform: "none",
            py: 1,
            "&:hover": {
              backgroundColor: "#d97706",
              transform: "translateY(-1px)",
              boxShadow: "0 2px 4px rgba(245, 158, 11, 0.3)",
            },
          }}
        >
          Add Operator
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

      {/* Operator Modal */}
      <OperatorModal
        open={isModalOpen}
        onClose={handleModalClose}
        operators={availableOperators}
        onSelectOperator={handleOperatorSelect}
        fieldType={fieldType}
      />
    </Box>
  );
};

export default OperatorNode;
