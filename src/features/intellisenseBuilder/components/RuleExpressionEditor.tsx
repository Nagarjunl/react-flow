import React, { useState, useCallback, useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { autocompletion } from "@codemirror/autocomplete";
import { EditorView } from "@codemirror/view";
import { tableSchema } from "../../../constants/constant";
import { Box, Typography, CircularProgress } from "@mui/material";
import {
  useGetRuleSchemaQuery,
  useGetCountriesQuery,
} from "../../../Api/rulesApi";

interface RuleExpressionEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  height?: string;
  theme?: "light" | "dark";
}

// Custom completion source for rule expressions
function ruleExpressionCompletions(
  context: any,
  schema: any,
  countries: any[]
) {
  // Get the word/token before cursor
  let word = context.matchBefore(/[\w.]*$/);
  if (!word || (word.from === word.to && !context.explicit)) return null;

  const beforeCursor = context.state.sliceDoc(
    Math.max(0, context.pos - 20),
    context.pos
  );

  // Check if we're right after a dot (for field completion)
  const afterDotCheck = beforeCursor.match(/(\w+)\.$/);
  if (afterDotCheck) {
    // We're after a dot, so match only the text after the dot
    const afterDotMatch = context.matchBefore(/\w*$/);
    if (afterDotMatch) {
      word = afterDotMatch;
    }
  }

  // Use provided schema or fallback to tableSchema constant
  const activeSchema = schema || tableSchema;

  // Build table variables from schema
  const tables = Object.keys(activeSchema).map((tableName) => ({
    label: tableName,
    type: "variable",
    detail: "(table)",
    info: `${tableName} table - Access fields like ${tableName}.${
      activeSchema[tableName][0]?.name || "field"
    }`,
  }));

  // Build properties for dotted access (e.g., user.Name)
  const properties: any[] = [];
  Object.entries(activeSchema).forEach(([tableName, fields]: [string, any]) => {
    fields.forEach((field: any) => {
      properties.push({
        label: field.name,
        type: "property",
        detail: `(${field.type})`,
        info: `${tableName}.${field.name} - Type: ${field.type}`,
        apply: field.name, // What gets inserted
      });
    });
  });

  // Operators
  const operators = [
    { label: "==", type: "operator", info: "Equal to" },
    { label: "!=", type: "operator", info: "Not equal" },
    { label: ">", type: "operator", info: "Greater than" },
    { label: ">=", type: "operator", info: "Greater than or equal" },
    { label: "<", type: "operator", info: "Less than" },
    { label: "<=", type: "operator", info: "Less than or equal" },
    { label: "&&", type: "operator", info: "Logical AND", apply: "&&" },
    { label: "AND", type: "operator", info: "Logical AND", apply: "AND" },
    { label: "||", type: "operator", info: "Logical OR", apply: "||" },
    { label: "OR", type: "operator", info: "Logical OR", apply: "OR" },
    { label: "!", type: "operator", info: "Logical NOT" },
    { label: "NOT", type: "operator", info: "Logical NOT", apply: "NOT" },
    { label: "+", type: "operator", info: "Addition" },
    { label: "-", type: "operator", info: "Subtraction" },
    { label: "*", type: "operator", info: "Multiplication" },
    { label: "/", type: "operator", info: "Division" },
    { label: "%", type: "operator", info: "Modulo" },
    {
      label: "?",
      type: "operator",
      info: "Ternary operator: condition ? true : false",
    },
    { label: ":", type: "operator", info: "Ternary separator" },
  ];

  // Functions
  const functions = [
    {
      label: "sum",
      type: "function",
      detail: "(collection)",
      info: "sum(collection) → Sum all values",
      apply: "sum()",
    },
    {
      label: "average",
      type: "function",
      detail: "(collection)",
      info: "average(collection) → Average of values",
      apply: "average()",
    },
    {
      label: "count",
      type: "function",
      detail: "(collection)",
      info: "count(collection) → Count items",
      apply: "count()",
    },
    {
      label: "min",
      type: "function",
      detail: "(a, b)",
      info: "min(a, b) → Minimum value",
      apply: "min()",
    },
    {
      label: "max",
      type: "function",
      detail: "(a, b)",
      info: "max(a, b) → Maximum value",
      apply: "max()",
    },
    {
      label: "where",
      type: "function",
      detail: "(collection, condition)",
      info: "where(collection, expr) → Filter collection",
      apply: "where()",
    },
    {
      label: "any",
      type: "function",
      detail: "(collection, condition)",
      info: "any(collection, expr) → Check if any match",
      apply: "any()",
    },
    {
      label: "all",
      type: "function",
      detail: "(collection, condition)",
      info: "all(collection, expr) → Check if all match",
      apply: "all()",
    },
  ];

  // Constants - include countries from API
  const constants = [
    { label: "true", type: "constant", info: "Boolean true" },
    { label: "false", type: "constant", info: "Boolean false" },
    { label: "null", type: "constant", info: "Null value" },
    // Add countries from API
    ...countries.map((country) => ({
      label: country.name || "",
      type: "constant",
      detail: `(${country.code})`,
      info: `Country: ${country.name} (${country.code})`,
      apply: `"${country.name}"`, // Wrap in quotes for string value
    })),
  ];

  let options = [...tables, ...functions, ...operators, ...constants];

  // Context-aware suggestions: If after '.', suggest properties
  const dotMatch = beforeCursor.match(/(\w+)\.$/);
  console.log("beforeCursor:", beforeCursor);
  console.log("dotMatch:", dotMatch);
  console.log("activeSchema keys:", Object.keys(activeSchema));

  if (dotMatch) {
    const tableName = dotMatch[1];
    console.log("🔍 Dot detected! Table name:", tableName);
    console.log("📊 Schema has this table?", tableName in activeSchema);
    console.log("📋 Table fields:", activeSchema[tableName]);

    if (activeSchema[tableName]) {
      // Filter properties for this specific table
      options = activeSchema[tableName].map((field: any) => ({
        label: field.name,
        type: "property",
        detail: `(${field.type})`,
        info: `${tableName}.${field.name} - Type: ${field.type}`,
      }));
      console.log("✅ Generated options:", options);
    } else {
      // Table not found, show all properties as fallback
      console.log("❌ Table not found in schema");
      options = properties;
    }
  }

  const filteredOptions = options.filter(
    (opt) =>
      !word.text ||
      word.text === "" ||
      opt.label.toLowerCase().includes(word.text.toLowerCase()) ||
      context.explicit
  );

  console.log("🎯 Final filtered options:", filteredOptions);
  console.log("📝 Word.text:", word.text);
  console.log("📍 Word.from:", word.from, "Word.to:", word.to);

  return {
    from: word.from,
    options: filteredOptions,
    validFor: /^[\w.]*$/,
  };
}

const RuleExpressionEditor: React.FC<RuleExpressionEditorProps> = ({
  value,
  onChange,
  label,
  placeholder = "Enter expression...",
  height = "120px",
  theme = "light",
}) => {
  const [localValue, setLocalValue] = useState(value);

  // Fetch schema and countries from API
  const { data: schemaData, isLoading: schemaLoading } =
    useGetRuleSchemaQuery();
  const { data: countriesData = [], isLoading: countriesLoading } =
    useGetCountriesQuery({});

  // Transform API schema to the format we need
  const transformedSchema = useMemo(() => {
    console.log("🔄 Schema Data from API:", schemaData);

    if (!schemaData) {
      console.log("⚠️ No schema data, using fallback");
      return tableSchema; // Fallback to constant
    }

    // Check if schemaData is already in the correct format (object with table keys)
    if (typeof schemaData === "object" && !Array.isArray(schemaData)) {
      // Check if it has table-like structure
      const firstKey = Object.keys(schemaData)[0];
      console.log("🔑 First key in schema:", firstKey);
      console.log("📦 First key value:", (schemaData as any)[firstKey]);

      if (
        firstKey &&
        Array.isArray((schemaData as any)[firstKey]) &&
        (schemaData as any)[firstKey][0]?.name
      ) {
        // Already in correct format - use API schema
        console.log("✅ Using API schema, tables:", Object.keys(schemaData));
        return schemaData;
      }
    }

    // Otherwise use tableSchema constant as fallback
    console.log("⚠️ Schema format not recognized, using fallback");
    return tableSchema;
  }, [schemaData]);

  // Memoize the completion function with API data
  const completionExtension = useMemo(() => {
    return autocompletion({
      activateOnTyping: true,
      override: [
        (context: any) =>
          ruleExpressionCompletions(context, transformedSchema, countriesData),
      ],
    });
  }, [transformedSchema, countriesData]);

  const handleChange = useCallback(
    (newValue: string) => {
      setLocalValue(newValue);
      onChange(newValue);
    },
    [onChange]
  );

  // Show loading state
  if (schemaLoading || countriesLoading) {
    return (
      <Box>
        {label && (
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{ mb: 1, fontSize: "0.75rem", color: "#666" }}
          >
            {label}
          </Typography>
        )}
        <Box
          sx={{
            height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        >
          <CircularProgress size={24} />
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {label && (
        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{ mb: 1, fontSize: "0.75rem", color: "#666" }}
        >
          {label}
        </Typography>
      )}
      <CodeMirror
        value={localValue}
        height={height}
        theme={theme}
        placeholder={placeholder}
        extensions={[completionExtension, EditorView.lineWrapping]}
        onChange={handleChange}
        style={{
          fontSize: "14px",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
        basicSetup={{
          lineNumbers: false,
          foldGutter: false,
          highlightActiveLineGutter: false,
          highlightActiveLine: false,
        }}
      />
    </Box>
  );
};

export default RuleExpressionEditor;
