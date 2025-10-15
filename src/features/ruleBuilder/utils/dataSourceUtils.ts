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
      {
        value: "=",
        label: "Equals",
        description: "True if input value equals the specified value",
      },
      {
        value: ">=",
        label: "Greater than or equal",
        description:
          "True if input value is greater than or equal to the specified value",
      },
      {
        value: ">",
        label: "Greater than",
        description: "True if input value is greater than the specified value",
      },
      {
        value: "<=",
        label: "Less than or equal",
        description:
          "True if input value is less than or equal to the specified value",
      },
      {
        value: "<",
        label: "Less than",
        description: "True if input value is less than the specified value",
      },
      {
        value: "!=",
        label: "Not equal to",
        description: "True if input value is not equal to the specified value",
      },
      {
        value: "+",
        label: "Addition",
        description: "Add the specified value to input value",
      },
      {
        value: "-",
        label: "Subtraction",
        description: "Subtract the specified value from input value",
      },
      {
        value: "*",
        label: "Multiplication",
        description: "Multiply input value by the specified value",
      },
      {
        value: "/",
        label: "Division",
        description: "Divide input value by the specified value",
      },
    ],
    integer: [
      {
        value: "=",
        label: "Equals",
        description: "True if input value equals the specified value",
      },
      {
        value: "IN",
        label: "Is in",
        description:
          "True if input value is in set. Members of the set can be separated by | [PIPE] OR ; [SEMICOLON] OR , [COMMA]",
      },
      {
        value: "ANY",
        label: "Anything",
        description: "Input value can be anything",
      },
      {
        value: "! IN",
        label: "Not in",
        description:
          "True if input value is NOT in set. Members of the set can be separated by | [PIPE] OR ; [SEMICOLON] OR , [COMMA]",
      },
      {
        value: ">=",
        label: "Greater than or equal",
        description:
          "True if input value is greater than or equal to the specified value",
      },
      {
        value: ">",
        label: "Greater than",
        description: "True if input value is greater than the specified value",
      },
      {
        value: "<=",
        label: "Less than or equal",
        description:
          "True if input value is less than or equal to the specified value",
      },
      {
        value: "<",
        label: "Less than",
        description: "True if input value is less than the specified value",
      },
      {
        value: "!=",
        label: "Not equal to",
        description: "True if input value is not equal to the specified value",
      },
      {
        value: "+",
        label: "Addition",
        description: "Add the specified value to input value",
      },
      {
        value: "-",
        label: "Subtraction",
        description: "Subtract the specified value from input value",
      },
      {
        value: "*",
        label: "Multiplication",
        description: "Multiply input value by the specified value",
      },
      {
        value: "/",
        label: "Division",
        description: "Divide input value by the specified value",
      },
    ],
    varchar: [
      {
        value: "=",
        label: "Equals",
        description: "True if input value equals the specified value",
      },
      {
        value: "IN",
        label: "Is in",
        description:
          "True if input value is in set. Members of the set can be separated by | [PIPE] OR ; [SEMICOLON] OR , [COMMA]",
      },
      {
        value: "ANY",
        label: "Anything",
        description: "Input value can be anything",
      },
      {
        value: "! IN",
        label: "Not in",
        description:
          "True if input value is NOT in set. Members of the set can be separated by | [PIPE] OR ; [SEMICOLON] OR , [COMMA]",
      },
      {
        value: "contains",
        label: "Contains",
        description: "True if input value contains the specified text",
      },
      {
        value: "starts with",
        label: "Starts with",
        description: "True if input value starts with the specified text",
      },
      {
        value: "ends with",
        label: "Ends with",
        description: "True if input value ends with the specified text",
      },
      {
        value: "!=",
        label: "Not equal to",
        description: "True if input value is not equal to the specified value",
      },
    ],
    date: [
      {
        value: "=",
        label: "Equals",
        description: "True if input value equals the specified value",
      },
      {
        value: "IN",
        label: "Is in",
        description:
          "True if input value is in set. Members of the set can be separated by | [PIPE] OR ; [SEMICOLON] OR , [COMMA]",
      },
      {
        value: "ANY",
        label: "Anything",
        description: "Input value can be anything",
      },
      {
        value: "! IN",
        label: "Not in",
        description:
          "True if input value is NOT in set. Members of the set can be separated by | [PIPE] OR ; [SEMICOLON] OR , [COMMA]",
      },
      {
        value: ">=",
        label: "Greater than or equal",
        description:
          "True if input value is greater than or equal to the specified value",
      },
      {
        value: ">",
        label: "After",
        description: "True if input value is after the specified date",
      },
      {
        value: "<=",
        label: "Less than or equal",
        description:
          "True if input value is less than or equal to the specified value",
      },
      {
        value: "<",
        label: "Before",
        description: "True if input value is before the specified date",
      },
      {
        value: "!=",
        label: "Not equal to",
        description: "True if input value is not equal to the specified value",
      },
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
