import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  TextField,
  IconButton,
  Tooltip,
  Stack,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import { Add, Edit, Delete, Search, Refresh } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useGetRulesQuery, useDeleteRuleMutation } from "../../../Api/rulesApi";
import { GradientButton } from "../ui";

const RuleList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteRule] = useDeleteRuleMutation();

  const { data: rules = [], isLoading, error, refetch } = useGetRulesQuery({});

  const handleEdit = (ruleId: string | number) => {
    navigate(`/intellisense-builder?editRuleId=${ruleId}`);
  };

  const handleCreate = () => {
    navigate("/intellisense-builder");
  };

  const handleDelete = async (ruleId: string | number) => {
    if (window.confirm("Are you sure you want to delete this rule?")) {
      try {
        await deleteRule({ id: ruleId }).unwrap();
        refetch();
      } catch (error) {
        console.error("Failed to delete rule:", error);
        alert("Failed to delete rule. Please try again.");
      }
    }
  };

  const filteredRules = rules.filter(
    (rule) =>
      rule.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load rules. Please try again.
        </Alert>
        <Button startIcon={<Refresh />} onClick={() => refetch()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Commission Rules
          </Typography>
          <Typography color="text.secondary">
            Manage commission calculation rules and policies
          </Typography>
        </Box>
        <GradientButton
          gradientVariant="green"
          startIcon={<Add />}
          onClick={handleCreate}
        >
          Create Rule
        </GradientButton>
      </Box>

      {/* Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search rules by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <Search sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
          />
        </CardContent>
      </Card>

      {/* Rules List */}
      {filteredRules.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {searchTerm ? "No rules found" : "No rules created yet"}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {searchTerm
                ? "Try adjusting your search terms"
                : "Click 'Create Rule' to get started"}
            </Typography>
            {!searchTerm && (
              <GradientButton
                gradientVariant="green"
                startIcon={<Add />}
                onClick={handleCreate}
              >
                Create Your First Rule
              </GradientButton>
            )}
          </CardContent>
        </Card>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 2,
          }}
        >
          {filteredRules.map((rule) => (
            <Card
              key={rule.id}
              variant="outlined"
              sx={{
                transition: "all 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 3,
                },
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardHeader
                title={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="subtitle1" fontWeight={600} noWrap>
                      {rule.name || "Untitled Rule"}
                    </Typography>
                    <Chip
                      size="small"
                      label={`#${rule.id}`}
                      variant="outlined"
                      color="primary"
                    />
                  </Stack>
                }
                action={
                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Edit Rule">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(rule.id!)}
                        color="primary"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Rule">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(rule.id!)}
                        color="error"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                }
              />
              <CardContent sx={{ flex: 1 }}>
                <Typography
                  color="text.secondary"
                  variant="body2"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {rule.description || "No description provided"}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <GradientButton
                  gradientVariant="green"
                  size="small"
                  startIcon={<Edit />}
                  onClick={() => handleEdit(rule.id!)}
                  sx={{ flex: 1 }}
                >
                  Edit Rule
                </GradientButton>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default RuleList;
