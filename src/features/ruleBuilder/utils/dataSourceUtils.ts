import { tableSchema } from "../../../constants/constant";

// Types for data source utilities
export interface DataSource {
  id: string;
  label: string;
  properties: DataSourceProperty[];
}

export interface DataSourceProperty {
  name: string;
  type: string;
  label: string;
}

// Convert table schema to data source format
export const getDataSources = (): DataSource[] => {
  return Object.entries(tableSchema).map(([tableName, fields]) => ({
    id: tableName,
    label: formatTableName(tableName),
    properties: fields.map((field) => ({
      name: field.name,
      type: field.type,
      label: formatFieldName(field.name),
    })),
  }));
};

// Get properties for a specific table
export const getTableProperties = (tableName: string): DataSourceProperty[] => {
  const table = tableSchema[tableName as keyof typeof tableSchema];
  if (!table) return [];

  return table.map((field) => ({
    name: field.name,
    type: field.type,
    label: formatFieldName(field.name),
  }));
};

// Get all available field types
export const getFieldTypes = (): string[] => {
  const types = new Set<string>();
  Object.values(tableSchema).forEach((fields) => {
    fields.forEach((field) => types.add(field.type));
  });
  return Array.from(types);
};

// Get operators for a specific field type
export const getOperatorsForType = (fieldType: string) => {
  const operators = {
    numeric: [
      { value: ">=", label: "Greater than or equal" },
      { value: "<=", label: "Less than or equal" },
      { value: "=", label: "Equal to" },
      { value: ">", label: "Greater than" },
      { value: "<", label: "Less than" },
      { value: "!=", label: "Not equal to" },
      { value: "+", label: "Addition" },
      { value: "-", label: "Subtraction" },
      { value: "*", label: "Multiplication" },
      { value: "/", label: "Division" },
    ],
    integer: [
      { value: ">=", label: "Greater than or equal" },
      { value: "<=", label: "Less than or equal" },
      { value: "=", label: "Equal to" },
      { value: ">", label: "Greater than" },
      { value: "<", label: "Less than" },
      { value: "!=", label: "Not equal to" },
      { value: "+", label: "Addition" },
      { value: "-", label: "Subtraction" },
      { value: "*", label: "Multiplication" },
      { value: "/", label: "Division" },
    ],
    varchar: [
      { value: "contains", label: "Contains" },
      { value: "equals", label: "Equals" },
      { value: "starts with", label: "Starts with" },
      { value: "ends with", label: "Ends with" },
      { value: "!=", label: "Not equal to" },
    ],
    date: [
      { value: ">=", label: "Greater than or equal" },
      { value: "<=", label: "Less than or equal" },
      { value: "=", label: "Equal to" },
      { value: ">", label: "After" },
      { value: "<", label: "Before" },
      { value: "!=", label: "Not equal to" },
    ],
  };

  return operators[fieldType as keyof typeof operators] || [];
};

// Helper functions
const formatTableName = (tableName: string): string => {
  return tableName
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

const formatFieldName = (fieldName: string): string => {
  return fieldName
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

// Get field type for a specific table and field
export const getFieldType = (
  tableName: string,
  fieldName: string
): string | null => {
  const table = tableSchema[tableName as keyof typeof tableSchema];
  if (!table) return null;

  const field = table.find((f) => f.name === fieldName);
  return field ? field.type : null;
};

// Validate expression syntax with table schema
export const validateExpression = (
  expression: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Basic validation - check if expression contains valid table.field references
  const tableFieldRegex = /\b\w+\.\w+\b/g;
  const matches = expression.match(tableFieldRegex) || [];

  matches.forEach((match) => {
    const [tableName, fieldName] = match.split(".");
    const fieldType = getFieldType(tableName, fieldName);

    if (!fieldType) {
      errors.push(`Invalid field reference: ${match}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};
