import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Chip,
  Stack,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from "@mui/icons-material";
import RuleExpressionEditor from "./RuleExpressionEditor";

/**
 * Demo component to showcase intellisense capabilities
 * This is for testing and demonstration purposes
 */
const IntellisenseDemo: React.FC = () => {
  const [ruleExpression, setRuleExpression] = useState(
    "metrics.TargetAchievement >= 120 AND metrics.AttendancePercentage >= 95"
  );
  const [actionExpression, setActionExpression] = useState(
    "sales.Amount * 0.05"
  );
  const [editorTheme, setEditorTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setEditorTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            🧠 Intellisense Expression Editor - Demo
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Test the intelligent autocomplete features. Try typing table names,
            using `.` to access fields, and pressing `Ctrl+Space` for
            suggestions.
          </Typography>
        </Box>
        <Tooltip
          title={
            editorTheme === "light"
              ? "Switch to Dark Mode"
              : "Switch to Light Mode"
          }
        >
          <IconButton onClick={toggleTheme} size="large" color="primary">
            {editorTheme === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      <Stack spacing={3} sx={{ mt: 3 }}>
        {/* Instructions */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📚 How to Test Intellisense
            </Typography>
            <Stack spacing={1}>
              <Paper sx={{ p: 2, bgcolor: "info.50" }}>
                <Typography variant="subtitle2" gutterBottom>
                  1. Type Table Names
                </Typography>
                <Typography variant="body2" component="div">
                  Try typing: <Chip label="metrics" size="small" />{" "}
                  <Chip label="user" size="small" />{" "}
                  <Chip label="sales" size="small" />{" "}
                  <Chip label="orders" size="small" />
                </Typography>
              </Paper>

              <Paper sx={{ p: 2, bgcolor: "success.50" }}>
                <Typography variant="subtitle2" gutterBottom>
                  2. Access Fields with Dot Notation
                </Typography>
                <Typography variant="body2" component="div">
                  Type <Chip label="metrics." size="small" /> to see all
                  available fields like TargetAchievement, AttendancePercentage,
                  etc.
                </Typography>
              </Paper>

              <Paper sx={{ p: 2, bgcolor: "warning.50" }}>
                <Typography variant="subtitle2" gutterBottom>
                  3. Use Operators
                </Typography>
                <Typography variant="body2" component="div">
                  Try: <Chip label=">=" size="small" />{" "}
                  <Chip label="AND" size="small" />{" "}
                  <Chip label="OR" size="small" />{" "}
                  <Chip label="==" size="small" />
                </Typography>
              </Paper>

              <Paper sx={{ p: 2, bgcolor: "error.50" }}>
                <Typography variant="subtitle2" gutterBottom>
                  4. Add Functions
                </Typography>
                <Typography variant="body2" component="div">
                  Type: <Chip label="sum()" size="small" />{" "}
                  <Chip label="average()" size="small" />{" "}
                  <Chip label="count()" size="small" />
                </Typography>
              </Paper>
            </Stack>
          </CardContent>
        </Card>

        {/* Rule Expression Test */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🎯 Rule Expression Test
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Try building complex conditions. Example: Type "metrics." to see
              fields, then add operators like "AND" or "OR".
            </Alert>
            <RuleExpressionEditor
              value={ruleExpression}
              onChange={setRuleExpression}
              label="Rule Condition Expression"
              placeholder="e.g., metrics.TargetAchievement >= 120 AND metrics.AttendancePercentage >= 95"
              height="120px"
              theme={editorTheme}
            />
            <Paper sx={{ p: 2, mt: 2 }}>
              <Typography variant="caption">Current Expression:</Typography>
              <Typography
                variant="body2"
                sx={{ fontFamily: "monospace", mt: 1 }}
              >
                {ruleExpression || "(empty)"}
              </Typography>
            </Paper>
          </CardContent>
        </Card>

        {/* Action Expression Test */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              ⚡ Action Expression Test
            </Typography>
            <Alert severity="success" sx={{ mb: 2 }}>
              Build calculation formulas. Try: "sales.Amount * 0.05" or
              "sum(orders.total_price)"
            </Alert>
            <RuleExpressionEditor
              value={actionExpression}
              onChange={setActionExpression}
              label="Action Formula Expression"
              placeholder="e.g., sales.Amount * 0.05"
              height="100px"
              theme={editorTheme}
            />
            <Paper sx={{ p: 2, mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Current Expression:
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontFamily: "monospace", mt: 1 }}
              >
                {actionExpression || "(empty)"}
              </Typography>
            </Paper>
          </CardContent>
        </Card>

        {/* Available Tables Reference */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📊 Available Tables & Fields
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Chip label="metrics" color="primary" sx={{ mr: 1 }} />
                <Typography variant="caption">
                  TargetAchievement, AttendancePercentage, StoreKpiAchievement,
                  PresentDays, AbsentDays, ApprovedLeaveDays, TotalWorkingDays,
                  NumberOfMcUplDays, StoreTargetAchievement
                </Typography>
              </Box>
              <Box>
                <Chip label="user" color="secondary" sx={{ mr: 1 }} />
                <Typography variant="caption">Designation, Name, Id</Typography>
              </Box>
              <Box>
                <Chip label="sales" color="success" sx={{ mr: 1 }} />
                <Typography variant="caption">
                  Amount, Quantity, Date
                </Typography>
              </Box>
              <Box>
                <Chip label="orders" color="warning" sx={{ mr: 1 }} />
                <Typography variant="caption">
                  id, customer_id, product_id, quantity, unit_price,
                  total_price, discount_rate, status
                </Typography>
              </Box>
              <Box>
                <Chip label="products" color="error" sx={{ mr: 1 }} />
                <Typography variant="caption">
                  id, name, price, category, stock_quantity
                </Typography>
              </Box>
              <Box>
                <Chip label="customers" color="info" sx={{ mr: 1 }} />
                <Typography variant="caption">
                  id, name, email, discount_rate, membership_level
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card sx={{ bgcolor: "primary.50" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              💡 Pro Tips
            </Typography>
            <ul>
              <li>
                <Typography variant="body2">
                  Press <strong>Ctrl+Space</strong> anywhere to manually trigger
                  autocomplete
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Type the first few letters and autocomplete will filter
                  options
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  After typing a table name, use <strong>.</strong> to see all
                  fields for that table
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Hover over suggestions to see type information and
                  descriptions
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Use arrow keys to navigate suggestions, Enter to select
                </Typography>
              </li>
            </ul>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default IntellisenseDemo;
