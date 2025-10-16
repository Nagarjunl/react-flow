// Intellisense autocomplete constants for the rule expression editor

// Operators
export const OPERATORS = [
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
] as const;

// Math Functions
export const MATH_FUNCTIONS = [
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
] as const;

// Date/Time Functions
export const DATE_FUNCTIONS = [
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
] as const;

// Collection Methods
export const COLLECTION_METHODS = [
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
] as const;

// Date Properties
export const DATE_PROPERTIES = [
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
  {
    label: "Day",
    type: "property",
    detail: "(int)",
    info: "Day component",
  },
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
] as const;

// String Properties
export const STRING_PROPERTIES = [
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
] as const;

// Boolean Constants
export const BOOLEAN_CONSTANTS = [
  { label: "true", type: "constant", info: "Boolean true" },
  { label: "false", type: "constant", info: "Boolean false" },
  { label: "null", type: "constant", info: "Null value" },
] as const;

// All Functions Combined
export const ALL_FUNCTIONS = [
  ...MATH_FUNCTIONS,
  ...DATE_FUNCTIONS,
  ...COLLECTION_METHODS,
] as const;
