import React from "react";
import { Alert } from "@mui/material";

interface ValidationAlertProps {
  errors: string[];
}

const ValidationAlert: React.FC<ValidationAlertProps> = ({ errors }) => {
  if (errors.length === 0) {
    return null;
  }

  return (
    <Alert severity="error" sx={{ mt: 2 }}>
      {errors.map((error, index) => (
        <div key={index}>{error}</div>
      ))}
    </Alert>
  );
};

export default ValidationAlert;
