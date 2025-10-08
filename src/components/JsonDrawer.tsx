import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Paper,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Close as CloseIcon,
  ContentCopy as CopyIcon,
  Download as DownloadIcon,
  Check as CheckIcon,
} from "@mui/icons-material";

// Props interface for JsonDrawer component
interface JsonDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  jsonData: string;
  onCopy?: () => void;
  onDownload?: () => void;
}

const JsonDrawer: React.FC<JsonDrawerProps> = ({
  isOpen,
  onClose,
  jsonData,
  onCopy,
  onDownload,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(jsonData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (onCopy) onCopy();
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleDownload = (): void => {
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rule-engine-config.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (onDownload) onDownload();
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={onClose}
        sx={{
          "& .MuiDrawer-paper": {
            width: 400,
            backgroundColor: "#1a1a1a",
            color: "#e5e5e5",
            borderLeft: "2px solid #333",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2.5,
            borderBottom: "1px solid #333",
            backgroundColor: "#2a2a2a",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#fff",
              fontSize: "1.125rem",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            📄 Generated JSON
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: "#fff",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Actions */}
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid #333",
            display: "flex",
            gap: 1.5,
          }}
        >
          <Button
            variant="contained"
            startIcon={copied ? <CheckIcon /> : <CopyIcon />}
            onClick={handleCopy}
            sx={{
              backgroundColor: copied ? "#22c55e" : "#3b82f6",
              color: "white",
              fontSize: "0.875rem",
              fontWeight: 500,
              textTransform: "none",
              "&:hover": {
                backgroundColor: copied ? "#16a34a" : "#2563eb",
              },
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            sx={{
              backgroundColor: "#8b5cf6",
              color: "white",
              fontSize: "0.875rem",
              fontWeight: 500,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#7c3aed",
              },
            }}
          >
            Download
          </Button>
        </Box>

        {/* JSON Content */}
        <Box
          sx={{
            flex: 1,
            p: 2.5,
            overflow: "auto",
            backgroundColor: "#1a1a1a",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              backgroundColor: "#0f0f0f",
              border: "1px solid #333",
              borderRadius: 1,
              p: 2,
            }}
          >
            <Box
              component="pre"
              sx={{
                color: "#e5e5e5",
                fontSize: "0.75rem",
                lineHeight: 1.5,
                margin: 0,
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                overflow: "auto",
              }}
            >
              {jsonData}
            </Box>
          </Paper>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid #333",
            backgroundColor: "#2a2a2a",
            color: "#888",
            fontSize: "0.75rem",
          }}
        >
          <Alert
            severity="info"
            sx={{
              backgroundColor: "transparent",
              color: "#888",
              fontSize: "0.75rem",
              "& .MuiAlert-icon": {
                color: "#888",
              },
              "& .MuiAlert-message": {
                fontSize: "0.75rem",
              },
            }}
          >
            💡 Tip: Copy the JSON to use in your rule engine
          </Alert>
        </Box>
      </Drawer>

      {/* Copy Success Snackbar */}
      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setCopied(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          JSON copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
};

export default JsonDrawer;
