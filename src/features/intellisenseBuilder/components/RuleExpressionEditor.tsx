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
  required?: boolean;
  hasError?: boolean;
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
    Math.max(0, context.pos - 100),
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

  // Special case: after method chaining like .where(...).
  const afterMethodChainCheck = beforeCursor.match(/\([^)]*\)\.$/);
  if (afterMethodChainCheck) {
    // We're after a closing paren and dot, match text after the dot
    const afterChainMatch = context.matchBefore(/\w*$/);
    if (afterChainMatch) {
      word = afterChainMatch;
      console.log("🔧 Adjusted word after method chain:", {
        text: word.text,
        from: word.from,
        to: word.to,
      });
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

  // Math Functions
  const mathFunctions = [
    {
      label: "Math.max",
      type: "function",
      detail: "(a, b)",
      info: "Math.max(a, b) → Maximum of two values",
      apply: "Math.max(",
    },
    {
      label: "Math.min",
      type: "function",
      detail: "(a, b)",
      info: "Math.min(a, b) → Minimum of two values",
      apply: "Math.min(",
    },
    {
      label: "Math.abs",
      type: "function",
      detail: "(value)",
      info: "Math.abs(value) → Absolute value",
      apply: "Math.abs(",
    },
    {
      label: "Math.round",
      type: "function",
      detail: "(value)",
      info: "Math.round(value) → Round to nearest integer",
      apply: "Math.round(",
    },
    {
      label: "Math.floor",
      type: "function",
      detail: "(value)",
      info: "Math.floor(value) → Round down",
      apply: "Math.floor(",
    },
    {
      label: "Math.ceil",
      type: "function",
      detail: "(value)",
      info: "Math.ceil(value) → Round up",
      apply: "Math.ceil(",
    },
    {
      label: "Math.pow",
      type: "function",
      detail: "(base, exp)",
      info: "Math.pow(base, exponent) → Power/exponent",
      apply: "Math.pow(",
    },
    {
      label: "Math.sqrt",
      type: "function",
      detail: "(value)",
      info: "Math.sqrt(value) → Square root",
      apply: "Math.sqrt(",
    },
  ];

  // Date/Time Functions
  const dateFunctions = [
    {
      label: "DateDiff",
      type: "function",
      detail: "('unit', start, end)",
      info: "DateDiff('day', startDate, endDate) → Calculate date difference",
      apply: "DateDiff('day', ",
    },
    {
      label: "Now",
      type: "function",
      detail: "()",
      info: "Now() → Current date and time",
      apply: "Now()",
    },
    {
      label: "Today",
      type: "function",
      detail: "()",
      info: "Today() → Current date",
      apply: "Today()",
    },
    {
      label: "AddDays",
      type: "function",
      detail: "(date, days)",
      info: "AddDays(date, days) → Add days to date",
      apply: "AddDays(",
    },
    {
      label: "AddMonths",
      type: "function",
      detail: "(date, months)",
      info: "AddMonths(date, months) → Add months to date",
      apply: "AddMonths(",
    },
  ];

  // Collection Methods
  const collectionMethods = [
    {
      label: "where",
      type: "function",
      detail: "(x => condition)",
      info: "where(x => x.field == value) → Filter collection",
      apply: "where(x => ",
    },
    {
      label: "sum",
      type: "function",
      detail: "(x => x.field)",
      info: "sum(x => x.field) → Sum values",
      apply: "sum(x => ",
    },
    {
      label: "average",
      type: "function",
      detail: "(x => x.field)",
      info: "average(x => x.field) → Average of values",
      apply: "average(x => ",
    },
    {
      label: "count",
      type: "function",
      detail: "()",
      info: "count() → Count items",
      apply: "count()",
    },
    {
      label: "any",
      type: "function",
      detail: "(x => condition)",
      info: "any(x => x.field == value) → Check if any match",
      apply: "any(x => ",
    },
    {
      label: "all",
      type: "function",
      detail: "(x => condition)",
      info: "all(x => x.field == value) → Check if all match",
      apply: "all(x => ",
    },
    {
      label: "first",
      type: "function",
      detail: "(x => condition)",
      info: "first(x => x.field == value) → Get first matching item",
      apply: "first(x => ",
    },
    {
      label: "last",
      type: "function",
      detail: "(x => condition)",
      info: "last(x => x.field == value) → Get last matching item",
      apply: "last(x => ",
    },
    {
      label: "max",
      type: "function",
      detail: "(x => x.field)",
      info: "max(x => x.field) → Maximum value",
      apply: "max(x => ",
    },
    {
      label: "min",
      type: "function",
      detail: "(x => x.field)",
      info: "min(x => x.field) → Minimum value",
      apply: "min(x => ",
    },
  ];

  const functions = [...mathFunctions, ...dateFunctions, ...collectionMethods];

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

  // Helper: Get field type from schema
  const getFieldType = (
    tableName: string,
    fieldName: string
  ): string | null => {
    const table = activeSchema[tableName];
    if (!table) return null;
    const field = table.find((f: any) => f.name === fieldName);
    return field ? field.type : null;
  };

  // Helper: Normalize collection name to table name
  const normalizeTableName = (name: string): string => {
    console.log(
      "🔧 Normalizing table name:",
      name,
      "Available tables:",
      Object.keys(activeSchema)
    );

    // Try exact match first (case-sensitive)
    if (activeSchema[name]) {
      console.log("✅ Exact match:", name);
      return name;
    }

    // Try case-insensitive match
    const lowerName = name.toLowerCase();
    const caseInsensitiveMatch = Object.keys(activeSchema).find(
      (key) => key.toLowerCase() === lowerName
    );
    if (caseInsensitiveMatch) {
      console.log("✅ Case-insensitive match:", caseInsensitiveMatch);
      return caseInsensitiveMatch;
    }

    // Try removing 'all' prefix: allSales -> sales, sale, or Sales
    if (name.startsWith("all") || name.startsWith("All")) {
      const withoutAll = name.substring(3); // "allAttendance" -> "Attendance"

      // Try exact match without 'all'
      if (activeSchema[withoutAll]) {
        console.log("✅ Without 'all' prefix:", withoutAll);
        return withoutAll;
      }

      // Try lowercase first letter: "Attendance" -> "attendance"
      const lowerFirst =
        withoutAll.charAt(0).toLowerCase() + withoutAll.slice(1);
      if (activeSchema[lowerFirst]) {
        console.log("✅ Lowercase first letter:", lowerFirst);
        return lowerFirst;
      }

      // Try case-insensitive without 'all'
      const caseInsensitiveWithoutAll = Object.keys(activeSchema).find(
        (key) => key.toLowerCase() === withoutAll.toLowerCase()
      );
      if (caseInsensitiveWithoutAll) {
        console.log(
          "✅ Case-insensitive without 'all':",
          caseInsensitiveWithoutAll
        );
        return caseInsensitiveWithoutAll;
      }
    }

    console.log("❌ No match found for:", name);
    return name;
  };

  // Date properties
  const dateProperties = [
    {
      label: "Year",
      type: "property",
      detail: "(int)",
      info: "Year component of date",
    },
    {
      label: "Month",
      type: "property",
      detail: "(int)",
      info: "Month component (1-12)",
    },
    { label: "Day", type: "property", detail: "(int)", info: "Day component" },
    {
      label: "DayOfWeek",
      type: "property",
      detail: "(int)",
      info: "Day of week (0=Sunday, 6=Saturday)",
    },
    {
      label: "Hour",
      type: "property",
      detail: "(int)",
      info: "Hour component (0-23)",
    },
    {
      label: "Minute",
      type: "property",
      detail: "(int)",
      info: "Minute component",
    },
    {
      label: "Second",
      type: "property",
      detail: "(int)",
      info: "Second component",
    },
  ];

  // String properties
  const stringProperties = [
    {
      label: "Length",
      type: "property",
      detail: "(int)",
      info: "String length",
    },
    {
      label: "ToUpper",
      type: "function",
      detail: "()",
      info: "Convert to uppercase",
      apply: "ToUpper()",
    },
    {
      label: "ToLower",
      type: "function",
      detail: "()",
      info: "Convert to lowercase",
      apply: "ToLower()",
    },
    {
      label: "Contains",
      type: "function",
      detail: "('text')",
      info: "Check if contains text",
      apply: "Contains('')",
    },
    {
      label: "StartsWith",
      type: "function",
      detail: "('text')",
      info: "Check if starts with",
      apply: "StartsWith('')",
    },
    {
      label: "EndsWith",
      type: "function",
      detail: "('text')",
      info: "Check if ends with",
      apply: "EndsWith('')",
    },
    {
      label: "Substring",
      type: "function",
      detail: "(start, len)",
      info: "Extract substring",
      apply: "Substring(",
    },
    {
      label: "Trim",
      type: "function",
      detail: "()",
      info: "Remove whitespace",
      apply: "Trim()",
    },
  ];

  let options = [...tables, ...functions, ...operators, ...constants];

  // Smart Context Detection

  // 1. Check for Math. context
  if (beforeCursor.endsWith("Math.")) {
    options = mathFunctions.map((f) => ({
      ...f,
      label: f.label.replace("Math.", ""), // Show just 'max' instead of 'Math.max'
    }));
  }

  // 2. Check for lambda parameter (e.g., allSales.where(s => s. anywhere inside the lambda)
  // Strategy: Find the lambda parameter name, then check if we're typing that param followed by dot

  // First, try to find if we're inside a lambda expression
  // Pattern: collection.method( paramName => ... paramName.
  const lambdaContextMatch = beforeCursor.match(
    /(\w+)\.(where|sum|average|any|all|first|last|max|min)\s*\(\s*(\w+)\s*=>/
  );

  console.log("lambdaContextMatch", lambdaContextMatch);

  let isInsideLambda = false;

  if (lambdaContextMatch) {
    const collectionName = lambdaContextMatch[1];
    const methodName = lambdaContextMatch[2];
    const paramName = lambdaContextMatch[3];

    // Now check if we're currently typing that parameter followed by a dot
    // e.g., "x." anywhere after "where(x =>"
    // Use word boundary \b to ensure it's not part of another word (e.g., "rex.")
    const paramDotPattern = new RegExp(`\\b${paramName}\\.\\s*$`);
    const isTypingParam = paramDotPattern.test(beforeCursor);

    console.log("🔍 Lambda context detection:", {
      beforeCursor: beforeCursor.slice(-60),
      collection: collectionName,
      method: methodName,
      param: paramName,
      isTypingParam,
      paramDotPattern: paramDotPattern.source,
    });

    if (isTypingParam) {
      isInsideLambda = true;
      const tableName = normalizeTableName(collectionName);

      console.log("🎯 Lambda param detected!", {
        collection: collectionName,
        param: paramName,
        tableName,
        hasTable: !!activeSchema[tableName],
      });

      if (activeSchema[tableName]) {
        options = activeSchema[tableName].map((field: any) => ({
          label: field.name,
          type: "property",
          detail: `(${field.type})`,
          info: `${paramName}.${field.name} - Type: ${field.type}`,
        }));

        console.log("✅ Lambda fields:", options.length, "fields");
      } else {
        console.log("❌ Table not found:", tableName);
      }
    }
  }

  // 3. Check for property chain (e.g., user.DateJoined. or x.CreatedOn.)
  const propertyChainMatch = beforeCursor.match(/(\w+)\.(\w+)\.$/);

  if (propertyChainMatch) {
    let tableName = propertyChainMatch[1];
    const fieldName = propertyChainMatch[2];

    console.log("🔍 Property chain detection:", {
      tableName,
      fieldName,
      isInsideLambda,
    });

    // If we're in a lambda context, check if tableName is the parameter
    if (lambdaContextMatch) {
      const paramName = lambdaContextMatch[3];
      console.log("Lambda param check:", tableName, "===", paramName, "?");

      if (tableName === paramName) {
        // This is x.CreatedOn., so use the collection's table name
        const collectionName = lambdaContextMatch[1];
        tableName = normalizeTableName(collectionName);
        console.log(
          "🎯 Lambda property chain: param =",
          paramName,
          "→ table =",
          tableName
        );
      }
    }

    const fieldType = getFieldType(tableName, fieldName);

    console.log("Field type:", fieldType, "for", tableName + "." + fieldName);

    if (fieldType === "date") {
      options = dateProperties;
      console.log("✅ Showing date properties");
    } else if (fieldType === "varchar") {
      options = stringProperties;
      console.log("✅ Showing string properties");
    }
  }

  // 4. Check for collection method chaining (e.g., allSales.where(...). or allSales.)
  // Pattern 1: collection.method(...).  (method chaining)
  const methodChainMatch = beforeCursor.match(
    /(\w+)\.(where|sum|average|any|all|first|last|max|min)\([^)]*\)\.$/
  );

  if (methodChainMatch && !propertyChainMatch) {
    const collectionName = methodChainMatch[1];
    console.log("🔗 Method chaining detected:", collectionName);
    console.log("Word info:", {
      text: word.text,
      from: word.from,
      to: word.to,
    });

    // After a collection method, show collection methods (for chaining)
    options = collectionMethods;
    console.log(
      "✅ Showing collection methods for chaining, options count:",
      options.length
    );
  }
  // Pattern 2: collection.  (initial collection access)
  else {
    const collectionDotMatch = beforeCursor.match(/(\w+)\.$/);
    if (collectionDotMatch && !propertyChainMatch && !isInsideLambda) {
      const name = collectionDotMatch[1];
      // Check if this is a collection (starts with 'all' or is a known table)
      if (name.startsWith("all") || activeSchema[name]) {
        // Could be either table fields OR collection methods
        // Show both
        const tableName = normalizeTableName(name);
        if (activeSchema[tableName]) {
          const tableFields = activeSchema[tableName].map((field: any) => ({
            label: field.name,
            type: "property",
            detail: `(${field.type})`,
            info: `${name}.${field.name} - Type: ${field.type}`,
          }));
          options = [...collectionMethods, ...tableFields];
        }
      }
    }
  }

  // 5. Standard table.field pattern (fallback if no other context matched)
  const standardDotMatch = beforeCursor.match(/(\w+)\.$/);
  if (
    standardDotMatch &&
    !isInsideLambda &&
    !propertyChainMatch &&
    !beforeCursor.endsWith("Math.")
  ) {
    const tableName = standardDotMatch[1];

    console.log("🔍 Standard table detection:", {
      tableName,
      hasTable: !!activeSchema[tableName],
      startsWithAll: tableName.startsWith("all"),
    });

    // Skip if already handled by collection method logic
    if (!tableName.startsWith("all") && activeSchema[tableName]) {
      options = activeSchema[tableName].map((field: any) => ({
        label: field.name,
        type: "property",
        detail: `(${field.type})`,
        info: `${tableName}.${field.name} - Type: ${field.type}`,
      }));

      console.log("✅ Standard table fields:", options.length, "fields");
    }
  }

  const filteredOptions = options.filter(
    (opt) =>
      !word.text ||
      word.text === "" ||
      opt.label.toLowerCase().includes(word.text.toLowerCase()) ||
      context.explicit
  );

  console.log("📋 Final options:", {
    totalOptions: options.length,
    filteredOptions: filteredOptions.length,
    wordText: word.text,
    sampleOptions: filteredOptions.slice(0, 3).map((o) => o.label),
  });

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
  required = false,
  hasError = false,
}) => {
  const [localValue, setLocalValue] = useState(value);

  // Fetch schema and countries from API
  const { data: schemaData, isLoading: schemaLoading } =
    useGetRuleSchemaQuery();
  const { data: countriesData = [], isLoading: countriesLoading } =
    useGetCountriesQuery({});

  // Transform API schema to the format we need
  const transformedSchema = useMemo(() => {
    if (!schemaData) {
      return tableSchema; // Fallback to constant
    }

    // Check if schemaData is already in the correct format (object with table keys)
    if (typeof schemaData === "object" && !Array.isArray(schemaData)) {
      // Check if it has table-like structure
      const firstKey = Object.keys(schemaData)[0];

      if (
        firstKey &&
        Array.isArray((schemaData as any)[firstKey]) &&
        (schemaData as any)[firstKey][0]?.name
      ) {
        // Already in correct format - use API schema
        return schemaData;
      }
    }

    // Otherwise use tableSchema constant as fallback
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
          {required && (
            <span style={{ color: "#d32f2f", marginLeft: "4px" }}>*</span>
          )}
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
          border:
            hasError || (required && !localValue.trim())
              ? "1px solid #d32f2f"
              : "1px solid #ddd",
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
