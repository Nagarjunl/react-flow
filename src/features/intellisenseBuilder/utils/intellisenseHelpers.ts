// Helper functions for intellisense autocomplete

import type {
  SchemaTable,
  CompletionOption,
  Country,
} from "../types/intellisenseTypes";

/**
 * Get the field type from schema
 */
export const getFieldType = (
  schema: SchemaTable,
  tableName: string,
  fieldName: string
): string | null => {
  const table = schema[tableName];
  if (!table) return null;
  const field = table.find((f: any) => f.name === fieldName);
  return field ? field.type : null;
};

/**
 * Normalize collection name to table name
 * Handles cases like "allSales" -> "sales" or "Sales"
 */
export const normalizeTableName = (
  name: string,
  schema: SchemaTable
): string => {
  // Try exact match first (case-sensitive)
  if (schema[name]) {
    return name;
  }

  // Try case-insensitive match
  const lowerName = name.toLowerCase();
  const caseInsensitiveMatch = Object.keys(schema).find(
    (key) => key.toLowerCase() === lowerName
  );
  if (caseInsensitiveMatch) {
    return caseInsensitiveMatch;
  }

  // Try removing 'all' prefix: allSales -> sales, sale, or Sales
  if (name.startsWith("all") || name.startsWith("All")) {
    const withoutAll = name.substring(3); // "allAttendance" -> "Attendance"

    // Try exact match without 'all'
    if (schema[withoutAll]) {
      return withoutAll;
    }

    // Try lowercase first letter: "Attendance" -> "attendance"
    const lowerFirst = withoutAll.charAt(0).toLowerCase() + withoutAll.slice(1);
    if (schema[lowerFirst]) {
      return lowerFirst;
    }

    // Try case-insensitive without 'all'
    const caseInsensitiveWithoutAll = Object.keys(schema).find(
      (key) => key.toLowerCase() === withoutAll.toLowerCase()
    );
    if (caseInsensitiveWithoutAll) {
      return caseInsensitiveWithoutAll;
    }
  }

  return name;
};

/**
 * Build table variables from schema
 */
export const buildTableVariables = (
  schema: SchemaTable
): CompletionOption[] => {
  return Object.keys(schema).map((tableName) => ({
    label: tableName,
    type: "variable",
    detail: "(table)",
    info: `${tableName} table - Access fields like ${tableName}.${
      schema[tableName][0]?.name || "field"
    }`,
  }));
};

/**
 * Build properties for dotted access (e.g., user.Name)
 */
export const buildProperties = (schema: SchemaTable): CompletionOption[] => {
  const properties: any[] = [];

  Object.entries(schema).forEach(([tableName, fields]: [string, any]) => {
    fields.forEach((field: any) => {
      properties.push({
        label: field.name,
        type: "property",
        detail: `(${field.type})`,
        info: `${tableName}.${field.name} - Type: ${field.type}`,
        apply: field.name,
      });
    });
  });

  return properties;
};

/**
 * Build constants including countries from API
 */
export const buildConstants = (
  countries: Country[],
  booleanConstants: readonly CompletionOption[]
): CompletionOption[] => {
  return [
    ...booleanConstants,
    ...countries.map((country) => ({
      label: country.name || "",
      type: "constant" as const,
      detail: `(${country.code})`,
      info: `Country: ${country.name} (${country.code})`,
      apply: `"${country.name}"`,
    })),
  ];
};

/**
 * Filter options based on word text and context
 */
export const filterOptions = (
  options: CompletionOption[],
  wordText: string,
  isExplicit: boolean
): CompletionOption[] => {
  return options.filter(
    (opt) =>
      !wordText ||
      wordText === "" ||
      opt.label.toLowerCase().includes(wordText.toLowerCase()) ||
      isExplicit
  );
};
