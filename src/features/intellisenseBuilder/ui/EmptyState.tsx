import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

interface EmptyStateProps {
  title: string;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, message }) => {
  return (
    <Card
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CardContent>
        <Typography variant="h6" color="text.secondary" align="center">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {message}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
