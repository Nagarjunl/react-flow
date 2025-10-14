import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  AccountTree as ReactFlowIcon,
  Functions as ExpressionIcon,
  Rule as RuleIcon,
} from "@mui/icons-material";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "React Flow Editor",
      description:
        "Visual workflow editor with drag-and-drop nodes for building complex business processes",
      icon: <ReactFlowIcon sx={{ fontSize: 40 }} />,
      path: "/reactflow",
      color: "primary",
    },
    {
      title: "Expression Builder",
      description:
        "Advanced expression builder for creating complex business rules with templates and visual interface",
      icon: <ExpressionIcon sx={{ fontSize: 40 }} />,
      path: "/expression-builder",
      color: "secondary",
    },
    {
      title: "Rule Builder",
      description:
        "Build complex workflows with rules and actions using a structured interface",
      icon: <RuleIcon sx={{ fontSize: 40 }} />,
      path: "/rule-builder",
      color: "success",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h3" component="h1" color="primary" gutterBottom>
          Business Rules Engine
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Build complex business rules and workflows with our powerful tools
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
        {features.map((feature, index) => (
          <Box key={index} sx={{ flex: "1 1 300px", minWidth: 300 }}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ textAlign: "center", mb: 2 }}>
                  <Box sx={{ color: `${feature.color}.main`, mb: 1 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                <Button
                  variant="contained"
                  color={feature.color as any}
                  size="large"
                  onClick={() => navigate(feature.path)}
                  sx={{ minWidth: 150 }}
                >
                  Open {feature.title}
                </Button>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Key Features
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Box sx={{ flex: "1 1 200px", minWidth: 200, maxWidth: 300 }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" color="primary" gutterBottom>
                Visual Builder
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Drag-and-drop interface for building complex expressions
              </Typography>
            </Box>
          </Box>
          <Box sx={{ flex: "1 1 200px", minWidth: 200, maxWidth: 300 }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" color="primary" gutterBottom>
                Rule Templates
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pre-built templates for common business rule patterns
              </Typography>
            </Box>
          </Box>
          <Box sx={{ flex: "1 1 200px", minWidth: 200, maxWidth: 300 }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" color="primary" gutterBottom>
                Real-time Testing
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Test your expressions with sample data instantly
              </Typography>
            </Box>
          </Box>
          <Box sx={{ flex: "1 1 200px", minWidth: 200, maxWidth: 300 }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" color="primary" gutterBottom>
                Export/Import
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Export rules as JSON and import existing configurations
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;
