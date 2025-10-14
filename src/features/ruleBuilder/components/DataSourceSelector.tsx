import React, { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
} from "@mui/material";
import {
  getDataSources,
  getTableProperties,
  getFieldType,
} from "../utils/dataSourceUtils";

interface DataSourceSelectorProps {
  onSelectionChange: (
    tableName: string,
    fieldName: string,
    fieldType: string
  ) => void;
  selectedTable?: string;
  selectedField?: string;
}

const DataSourceSelector: React.FC<DataSourceSelectorProps> = ({
  onSelectionChange,
  selectedTable,
  selectedField,
}) => {
  const [selectedTableName, setSelectedTableName] = useState(
    selectedTable || ""
  );
  const [selectedFieldName, setSelectedFieldName] = useState(
    selectedField || ""
  );

  const dataSources = getDataSources();
  const tableProperties = selectedTableName
    ? getTableProperties(selectedTableName)
    : [];

  const handleTableChange = (tableName: string) => {
    setSelectedTableName(tableName);
    setSelectedFieldName("");
    onSelectionChange(tableName, "", "");
  };

  const handleFieldChange = (fieldName: string) => {
    setSelectedFieldName(fieldName);
    const fieldType = getFieldType(selectedTableName, fieldName) || "";
    onSelectionChange(selectedTableName, fieldName, fieldType);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Select Data Source
      </Typography>

      {/* Table Selection */}
      <FormControl fullWidth size="small">
        <InputLabel>Table</InputLabel>
        <Select
          value={selectedTableName}
          onChange={(e) => handleTableChange(e.target.value)}
          label="Table"
        >
          {dataSources.map((source) => (
            <MenuItem key={source.id} value={source.id}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2">{source.label}</Typography>
                <Chip
                  label={`${source.properties.length} fields`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Field Selection */}
      {selectedTableName && (
        <FormControl fullWidth size="small">
          <InputLabel>Field</InputLabel>
          <Select
            value={selectedFieldName}
            onChange={(e) => handleFieldChange(e.target.value)}
            label="Field"
          >
            {tableProperties.map((property) => (
              <MenuItem key={property.name} value={property.name}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2">{property.label}</Typography>
                  <Chip
                    label={property.type}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Selection Summary */}
      {selectedTableName && selectedFieldName && (
        <Box sx={{ p: 1, bgcolor: "grey.100", borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Selected:{" "}
            <strong>
              {selectedTableName}.{selectedFieldName}
            </strong>
            {getFieldType(selectedTableName, selectedFieldName) && (
              <Chip
                label={getFieldType(selectedTableName, selectedFieldName)}
                size="small"
                sx={{ ml: 1 }}
              />
            )}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DataSourceSelector;
