// TypeScript types for intellisense autocomplete system

export interface CompletionOption {
  label: string;
  type: "variable" | "property" | "operator" | "function" | "constant";
  detail?: string;
  info?: string;
  apply?: string;
}

export interface SchemaField {
  name: string;
  type: string;
}

export interface SchemaTable {
  [tableName: string]: SchemaField[];
}

export interface Country {
  name: string;
  code: string;
}

export interface LambdaContext {
  isInLambda: boolean;
  collectionName?: string;
  paramName?: string;
  tableName?: string;
}

export interface PropertyChainContext {
  tableName?: string;
  fieldName?: string;
  fieldType?: string;
}

export interface MethodChainContext {
  isMethodChain: boolean;
  collectionName?: string;
}

export interface CollectionDotContext {
  isCollectionDot: boolean;
  name?: string;
  tableName?: string;
}

export interface StandardTableContext {
  isStandardTable: boolean;
  tableName?: string;
}

export interface CompletionContext {
  word: any;
  beforeCursor: string;
  schema: SchemaTable;
  countries: Country[];
  context: any;
}
