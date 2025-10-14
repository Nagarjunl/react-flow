import React, { useState, useCallback } from "react";
import {
  Box,
  Typography,
  Autocomplete,
  TextField,
  Button,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import {
  getDataSources,
  getTableProperties,
  getFieldType,
} from "../../utils/dataSourceUtils";

interface ConditionNodeProps {
  id: string;
  tableName?: string;
  fieldName?: string;
  onUpdate: (
    id: string,
    updates: { tableName?: string; fieldName?: string }
  ) => void;
  onAdd?: (partData: { tableName: string; fieldName: string }) => void;
}

const ConditionNode: React.FC<ConditionNodeProps> = ({
  id,
  tableName = "",
  fieldName = "",
  onUpdate,
  onAdd,
}) => {
  const [selectedTable, setSelectedTable] = useState(tableName);
  const [selectedField, setSelectedField] = useState(fieldName);

  const dataSources = getDataSources();
  const tableProperties = selectedTable
    ? getTableProperties(selectedTable)
    : [];

  const handleTableChange = useCallback(
    (_: any, newValue: any) => {
      const tableName = newValue ? newValue.id : "";
      setSelectedTable(tableName);
      setSelectedField(""); // Reset field when table changes
      onUpdate(id, { tableName, fieldName: "" });
    },
    [id, onUpdate]
  );

  const handleFieldChange = useCallback(
    (_: any, newValue: any) => {
      const fieldName = newValue ? newValue.name : "";
      setSelectedField(fieldName);
      onUpdate(id, { fieldName });
    },
    [id, onUpdate]
  );

  const selectedTableOption = dataSources.find(
    (source) => source.id === selectedTable
  );
  const selectedFieldOption = tableProperties.find(
    (prop) => prop.name === selectedField
  );

  return (
    <Box
      sx={{
        // background: "linear-gradient(135deg, #ef4444 0%, #ef4444dd 100%)",
        // color: "white",
        p: 1.5,
        borderRadius: 1.5,
        minWidth: "250px",
        boxShadow: 2,
        border: "1px solid transparent",
        transition: "all 0.2s ease",
        position: "relative",
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          mb: 1,
          fontWeight: "bold",
          fontSize: "0.75rem",
          color: "white",
        }}
      >
        🔍 Condition
      </Typography>

      {/* Table and Field Selection in One Row */}
      <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
        <Autocomplete
          size="small"
          options={dataSources}
          getOptionLabel={(option) => option.label || ""}
          value={selectedTableOption || null}
          onChange={handleTableChange}
          sx={{ flex: 1 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Table *"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  fontSize: "0.625rem",
                  "& .MuiOutlinedInput-input": {
                    color: "#333",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: "0.625rem",
                  color: "#666",
                },
                "& .MuiSvgIcon-root": {
                  color: "#666",
                },
              }}
            />
          )}
        />

        <Autocomplete
          size="small"
          options={tableProperties}
          getOptionLabel={(option) => option.label || ""}
          value={selectedFieldOption || null}
          onChange={handleFieldChange}
          disabled={!selectedTable}
          sx={{ flex: 1 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Field *"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                  fontSize: "0.625rem",
                  "& .MuiOutlinedInput-input": {
                    color: "#333",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: "0.625rem",
                  color: "#666",
                },
                "& .MuiSvgIcon-root": {
                  color: "#666",
                },
              }}
            />
          )}
        />

        <Button
          size="small"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            if (selectedTable && selectedField && onAdd) {
              onAdd({ tableName: selectedTable, fieldName: selectedField });
            }
          }}
          disabled={!selectedTable || !selectedField}
          sx={{ minWidth: "auto", px: 1 }}
        >
          Add
        </Button>
      </Box>

      {/* Field Type Display */}
      {selectedTable && selectedField && (
        <Box sx={{ mt: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: "white",
              fontSize: "0.6rem",
              bgcolor: "rgba(255,255,255,0.2)",
              px: 1,
              py: 0.5,
              borderRadius: 0.5,
            }}
          >
            Type: {getFieldType(selectedTable, selectedField)}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ConditionNode;
