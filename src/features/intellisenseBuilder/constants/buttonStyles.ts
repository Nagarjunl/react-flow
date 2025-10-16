// Button style constants for consistent theming across the module

export const BUTTON_GRADIENTS = {
  green: {
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    hover: "linear-gradient(135deg, #059669 0%, #047857 100%)",
    shadow: "0 4px 8px rgba(16, 185, 129, 0.3)",
  },
  orange: {
    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    hover: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
    shadow: "0 4px 8px rgba(245, 158, 11, 0.3)",
  },
  red: {
    background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
    hover: "linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)",
    shadow: "0 4px 8px rgba(220, 38, 38, 0.3)",
  },
  blue: {
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    hover: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    shadow: "0 4px 8px rgba(59, 130, 246, 0.3)",
  },
} as const;

export const BUTTON_BASE_STYLES = {
  fontSize: "0.875rem",
  fontWeight: 600,
  textTransform: "none",
  py: 1.5,
  px: 3,
} as const;

export const OUTLINED_BUTTON_STYLES = {
  green: {
    borderColor: "#10b981",
    color: "#10b981",
    "&:hover": {
      borderColor: "#059669",
      backgroundColor: "#f0fdf4",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 8px rgba(16, 185, 129, 0.3)",
    },
  },
} as const;
