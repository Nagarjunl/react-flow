import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Grid,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

interface Operator {
  value: string;
  label: string;
  description?: string;
}

interface OperatorModalProps {
  open: boolean;
  onClose: () => void;
  operators: Operator[];
  onSelectOperator: (operator: Operator) => void;
  fieldType: string;
}

const OperatorModal: React.FC<OperatorModalProps> = ({
  open,
  onClose,
  operators,
  onSelectOperator,
  fieldType,
}) => {
  const handleOperatorClick = (operator: Operator) => {
    onSelectOperator(operator);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: "500px",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography sx={{ fontWeight: "bold" }}>Basic Operators</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3, fontSize: "0.875rem" }}
        >
          Select an operator for {fieldType} fields
        </Typography>

        <Grid container spacing={2}>
          {operators.map((operator, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  backgroundColor: "white",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    borderColor: "#4fc3f7",
                  },
                }}
                onClick={() => handleOperatorClick(operator)}
              >
                <CardContent
                  sx={{
                    p: 2,
                    "&:last-child": { pb: 2 },
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        mb: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: "#e0f7fa",
                          borderRadius: 1.5,
                          px: 1.5,
                          py: 0.75,
                          mr: 1.5,
                          minWidth: "50px",
                          textAlign: "center",
                          border: "1px solid #b2ebf2",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: "bold",
                            fontSize: "0.75rem",
                            color: "#006064",
                            fontFamily: "monospace",
                          }}
                        >
                          {operator.value}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: "bold",
                            fontSize: "0.875rem",
                            color: "#333",
                            mb: 0.5,
                          }}
                        >
                          {operator.label}:
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#666",
                        fontSize: "0.75rem",
                        lineHeight: 1.4,
                        ml: 0,
                      }}
                    >
                      {operator.description ||
                        `True if input value ${operator.label.toLowerCase()}`}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OperatorModal;
