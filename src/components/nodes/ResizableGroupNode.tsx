import React from "react";
import { NodeResizer } from "@xyflow/react";
import { Box, Typography } from "@mui/material";
import type { ResizableGroupNodeProps } from "../../types/nodeTypes";
import ValidationIndicator from "../ValidationIndicator";

const ResizableGroupNode: React.FC<ResizableGroupNodeProps> = ({
  data,
  selected,
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: data.backgroundColor || "rgba(139, 92, 246, 0.1)",
        border: data.border || "2px solid #8b5cf6",
        borderRadius: 2,
        position: "relative",
        minWidth: 200,
        minHeight: 150,
      }}
    >
      <NodeResizer
        color="#8b5cf6"
        isVisible={selected}
        minWidth={200}
        minHeight={150}
      />
      {data.label && (
        <Typography
          variant="subtitle2"
          sx={{
            position: "absolute",
            top: 1,
            left: 1,
            fontSize: "0.75rem",
            fontWeight: "bold",
            color: "#8b5cf6",
            pointerEvents: "none",
          }}
        >
          {data.label}
        </Typography>
      )}

      {/* Validation Indicator */}
      {data.hasValidationErrors ? (
        <ValidationIndicator
          nodeId={typeof data.id === "string" ? data.id : ""}
          errors={(data.validationErrors as any[]) || []}
          warnings={[]}
          position="top-right"
          size="small"
        />
      ) : null}
    </Box>
  );
};

export default ResizableGroupNode;
