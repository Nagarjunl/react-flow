import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { getThemeConfig } from "./services/uiUtils";
import Dashboard from "./Screens/Dashboard";
import ReactFlowComponent from "./Screens/ReactFlow";
import ExpressionBuilder from "./Screens/ExpressionBuilder";
import { RuleBuilder } from "./features/ruleBuilder";
import IntellisenseBuilder from "./features/intellisenseBuilder/components/IntellisenseBuilder";
import IntellisenseDemo from "./features/intellisenseBuilder/components/IntellisenseDemo";

// Create MUI theme using service
const theme = createTheme(getThemeConfig());

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reactflow" element={<ReactFlowComponent />} />
          <Route path="/expression-builder" element={<ExpressionBuilder />} />
          <Route path="/rule-builder" element={<RuleBuilder />} />
          <Route
            path="/intellisense-builder"
            element={<IntellisenseBuilder />}
          />
          <Route path="/intellisense-demo" element={<IntellisenseDemo />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
