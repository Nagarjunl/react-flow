import React from "react";
import { Button, ButtonProps } from "@mui/material";
import { BUTTON_GRADIENTS, BUTTON_BASE_STYLES } from "../constants";

export type GradientVariant = "green" | "orange" | "red" | "blue";

interface GradientButtonProps extends Omit<ButtonProps, "variant"> {
  gradientVariant: GradientVariant;
  children: React.ReactNode;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  gradientVariant,
  children,
  sx,
  ...props
}) => {
  const gradient = BUTTON_GRADIENTS[gradientVariant];

  return (
    <Button
      variant="contained"
      sx={{
        ...BUTTON_BASE_STYLES,
        background: gradient.background,
        color: "white",
        "&:hover": {
          background: gradient.hover,
          transform: "translateY(-1px)",
          boxShadow: gradient.shadow,
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default GradientButton;
