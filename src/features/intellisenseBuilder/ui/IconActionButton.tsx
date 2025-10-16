import React from "react";
import { IconButton, IconButtonProps, Tooltip, Box } from "@mui/material";

interface IconActionButtonProps extends IconButtonProps {
  tooltip: string;
  icon: React.ReactNode;
  variant?: "delete" | "default" | "drag";
}

const IconActionButton: React.FC<IconActionButtonProps> = ({
  tooltip,
  icon,
  variant = "default",
  onClick,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "delete":
        return {
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          borderRadius: 1,
          color: "error.main",
          "&:hover": {
            backgroundColor: "error.light",
            color: "error.dark",
          },
        };
      case "drag":
        return {
          cursor: "grab",
          "&:active": { cursor: "grabbing" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          borderRadius: 1,
          "&:hover": {
            backgroundColor: "action.hover",
          },
        };
      default:
        return {};
    }
  };

  if (variant === "delete" || variant === "drag") {
    return (
      <Tooltip title={tooltip}>
        <Box
          component="div"
          onClick={onClick}
          sx={getVariantStyles()}
          {...props}
        >
          {icon}
        </Box>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={tooltip}>
      <IconButton onClick={onClick} {...props}>
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default IconActionButton;
