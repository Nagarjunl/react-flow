// Completion engine for rule expression autocomplete

import {
  OPERATORS,
  MATH_FUNCTIONS,
  DATE_PROPERTIES,
  STRING_PROPERTIES,
  COLLECTION_METHODS,
  ALL_FUNCTIONS,
  BOOLEAN_CONSTANTS,
} from "../constants/intellisenseConstants";
import {
  getFieldType,
  normalizeTableName,
  buildTableVariables,
  buildProperties,
  buildConstants,
  filterOptions,
} from "./intellisenseHelpers";
import type {
  CompletionContext,
  LambdaContext,
  PropertyChainContext,
  MethodChainContext,
  CollectionDotContext,
  StandardTableContext,
  SchemaTable,
} from "../types/intellisenseTypes";

/**
 * Detect lambda context
 * Returns { isInLambda, collectionName, paramName, tableName } or null
 */
const detectLambdaContext = (
  beforeCursor: string,
  schema: SchemaTable
): LambdaContext | null => {
  const lambdaContextMatch = beforeCursor.match(
    /(\w+)\.(where|sum|average|any|all|first|last|max|min)\s*\(\s*(\w+)\s*=>/
  );

  if (!lambdaContextMatch) return null;

  const collectionName = lambdaContextMatch[1];
  const paramName = lambdaContextMatch[3];

  // Check if we're currently typing that parameter followed by a dot
  const paramDotPattern = new RegExp(`\\b${paramName}\\.\\s*$`);
  const isTypingParam = paramDotPattern.test(beforeCursor);

  if (isTypingParam) {
    const tableName = normalizeTableName(collectionName, schema);
    return {
      isInLambda: true,
      collectionName,
      paramName,
      tableName,
    };
  }

  return { isInLambda: false };
};

/**
 * Detect property chain context (e.g., user.DateJoined. or x.CreatedOn.)
 */
const detectPropertyChainContext = (
  beforeCursor: string,
  schema: SchemaTable,
  lambdaContext: LambdaContext | null
): PropertyChainContext | null => {
  const propertyChainMatch = beforeCursor.match(/(\w+)\.(\w+)\.$/);

  if (!propertyChainMatch) return null;

  let tableName = propertyChainMatch[1];
  const fieldName = propertyChainMatch[2];

  // If we're in a lambda context, check if tableName is the parameter
  if (lambdaContext?.isInLambda) {
    const lambdaMatch = beforeCursor.match(
      /(\w+)\.(where|sum|average|any|all|first|last|max|min)\s*\(\s*(\w+)\s*=>/
    );
    if (lambdaMatch) {
      const paramName = lambdaMatch[3];
      if (tableName === paramName) {
        const collectionName = lambdaMatch[1];
        tableName = normalizeTableName(collectionName, schema);
      }
    }
  }

  const fieldType = getFieldType(schema, tableName, fieldName);

  return { tableName, fieldName, fieldType };
};

/**
 * Detect method chaining context (e.g., allSales.where(...). or allSales.)
 */
const detectMethodChainContext = (
  beforeCursor: string,
  propertyChainMatch: PropertyChainContext | null
): MethodChainContext => {
  const methodChainMatch = beforeCursor.match(
    /(\w+)\.(where|sum|average|any|all|first|last|max|min)\([^)]*\)\.$/
  );

  if (methodChainMatch && !propertyChainMatch) {
    return {
      isMethodChain: true,
      collectionName: methodChainMatch[1],
    };
  }

  return { isMethodChain: false };
};

/**
 * Detect collection dot context (e.g., allSales. or sales.)
 */
const detectCollectionDotContext = (
  beforeCursor: string,
  schema: SchemaTable,
  propertyChainMatch: PropertyChainContext | null,
  isInsideLambda: boolean
): CollectionDotContext => {
  const collectionDotMatch = beforeCursor.match(/(\w+)\.$/);

  if (collectionDotMatch && !propertyChainMatch && !isInsideLambda) {
    const name = collectionDotMatch[1];
    // Check if this is a collection (starts with 'all' or is a known table)
    if (name.startsWith("all") || schema[name]) {
      const tableName = normalizeTableName(name, schema);
      if (schema[tableName]) {
        return {
          isCollectionDot: true,
          name,
          tableName,
        };
      }
    }
  }

  return { isCollectionDot: false };
};

/**
 * Detect standard table context (e.g., user. or metrics.)
 */
const detectStandardTableContext = (
  beforeCursor: string,
  schema: SchemaTable,
  isInsideLambda: boolean,
  propertyChainMatch: PropertyChainContext | null
): StandardTableContext => {
  const standardDotMatch = beforeCursor.match(/(\w+)\.$/);

  if (
    standardDotMatch &&
    !isInsideLambda &&
    !propertyChainMatch &&
    !beforeCursor.endsWith("Math.")
  ) {
    const tableName = standardDotMatch[1];

    // Skip if already handled by collection method logic or starts with 'all'
    if (!tableName.startsWith("all") && schema[tableName]) {
      return {
        isStandardTable: true,
        tableName,
      };
    }
  }

  return { isStandardTable: false };
};

/**
 * Get completion options based on detected context
 */
export const getCompletionOptions = ({
  word,
  beforeCursor,
  schema,
  countries,
  context,
}: CompletionContext) => {
  const activeSchema = schema || {};

  // Build base options
  const tables = buildTableVariables(activeSchema);
  const properties = buildProperties(activeSchema);
  const constants = buildConstants(countries, [...BOOLEAN_CONSTANTS]);
  let options = [...tables, ...ALL_FUNCTIONS, ...OPERATORS, ...constants];

  // 1. Check for Math. context
  if (beforeCursor.endsWith("Math.")) {
    options = MATH_FUNCTIONS.map((f) => ({
      ...f,
      label: f.label.replace("Math.", ""),
    }));
    return filterOptions(options, word.text, context.explicit);
  }

  // 2. Check for lambda parameter context
  const lambdaContext = detectLambdaContext(beforeCursor, activeSchema);
  if (lambdaContext?.isInLambda && lambdaContext.tableName) {
    if (activeSchema[lambdaContext.tableName]) {
      options = activeSchema[lambdaContext.tableName].map((field: any) => ({
        label: field.name,
        type: "property",
        detail: `(${field.type})`,
        info: `${lambdaContext.paramName}.${field.name} - Type: ${field.type}`,
      }));
      return filterOptions(options, word.text, context.explicit);
    }
  }

  // 3. Check for property chain context
  const propertyChainContext = detectPropertyChainContext(
    beforeCursor,
    activeSchema,
    lambdaContext
  );
  if (propertyChainContext?.fieldType) {
    if (propertyChainContext.fieldType === "date") {
      options = [...DATE_PROPERTIES];
    } else if (propertyChainContext.fieldType === "varchar") {
      options = [...STRING_PROPERTIES];
    }
    return filterOptions(options, word.text, context.explicit);
  }

  // 4. Check for method chaining context
  const methodChainContext = detectMethodChainContext(
    beforeCursor,
    propertyChainContext
  );
  if (methodChainContext.isMethodChain) {
    options = [...COLLECTION_METHODS];
    return filterOptions(options, word.text, context.explicit);
  }

  // 5. Check for collection dot context
  const collectionDotContext = detectCollectionDotContext(
    beforeCursor,
    activeSchema,
    propertyChainContext,
    lambdaContext?.isInLambda || false
  );
  if (collectionDotContext.isCollectionDot && collectionDotContext.tableName) {
    const tableFields = activeSchema[collectionDotContext.tableName].map(
      (field: any) => ({
        label: field.name,
        type: "property",
        detail: `(${field.type})`,
        info: `${collectionDotContext.name}.${field.name} - Type: ${field.type}`,
      })
    );
    options = [...COLLECTION_METHODS, ...tableFields];
    return filterOptions(options, word.text, context.explicit);
  }

  // 6. Check for standard table context
  const standardTableContext = detectStandardTableContext(
    beforeCursor,
    activeSchema,
    lambdaContext?.isInLambda || false,
    propertyChainContext
  );
  if (standardTableContext.isStandardTable && standardTableContext.tableName) {
    options = activeSchema[standardTableContext.tableName].map(
      (field: any) => ({
        label: field.name,
        type: "property",
        detail: `(${field.type})`,
        info: `${standardTableContext.tableName}.${field.name} - Type: ${field.type}`,
      })
    );
    return filterOptions(options, word.text, context.explicit);
  }

  // Default: return all options
  return filterOptions(options, word.text, context.explicit);
};

/**
 * Main completion function for rule expressions
 */
export function ruleExpressionCompletions(
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
    const afterDotMatch = context.matchBefore(/\w*$/);
    if (afterDotMatch) {
      word = afterDotMatch;
    }
  }

  // Special case: after method chaining like .where(...).
  const afterMethodChainCheck = beforeCursor.match(/\([^)]*\)\.$/);
  if (afterMethodChainCheck) {
    const afterChainMatch = context.matchBefore(/\w*$/);
    if (afterChainMatch) {
      word = afterChainMatch;
    }
  }

  const filteredOptions = getCompletionOptions({
    word,
    beforeCursor,
    schema,
    countries,
    context,
  });

  return {
    from: word.from,
    options: filteredOptions,
    validFor: /^[\w.]*$/,
  };
}
