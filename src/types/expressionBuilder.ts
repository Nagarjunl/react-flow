// Expression Builder Types and Utilities
export interface ExpressionNode {
  id: string;
  type: "data" | "operator" | "function" | "value" | "condition" | "logic";
  value: string;
  children?: ExpressionNode[];
  parameters?: any[];
}

export interface RuleTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  expression: string;
  onSuccess: string;
  onFailure: string;
  complexity: "simple" | "intermediate" | "advanced" | "expert";
}

export interface DataSource {
  id: string;
  label: string;
  properties: string[];
  type: "object" | "collection" | "primitive";
}

export interface Operator {
  id: string;
  label: string;
  type: "comparison" | "arithmetic" | "logic" | "assignment";
  precedence: number;
  associativity: "left" | "right";
}

export interface Function {
  id: string;
  label: string;
  description: string;
  parameters: number;
  returnType: "number" | "string" | "boolean" | "date" | "any";
  category: "math" | "string" | "date" | "collection" | "custom";
}

export interface CollectionMethod {
  id: string;
  label: string;
  description: string;
  parameters: number;
  returnType: "number" | "string" | "boolean" | "collection" | "any";
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface TestResult {
  success: boolean;
  result: any;
  error?: string;
  executionTime: number;
}

// Expression Builder Configuration
export const EXPRESSION_BUILDER_CONFIG = {
  // Data Sources
  DATA_SOURCES: [
    {
      id: "sale",
      label: "Sale Data",
      properties: [
        "Amount",
        "Quantity",
        "Discount",
        "ProductPrice",
        "Tax",
        "CategoryId",
        "BrandId",
        "CreatedOn",
      ],
      type: "object" as const,
    },
    {
      id: "user",
      label: "User Data",
      properties: [
        "Id",
        "StoreId",
        "CountryCode",
        "RetailCountryCode",
        "Designation",
        "DateJoined",
        "IsActive",
        "BrandId",
      ],
      type: "object" as const,
    },
    {
      id: "context",
      label: "Context Data",
      properties: [
        "Target",
        "Month",
        "SumOfAllWorkingHours",
        "OverallSalesByStore",
        "TotalMonthlySales",
      ],
      type: "object" as const,
    },
    {
      id: "storeTarget",
      label: "Store Target",
      properties: [
        "StoreId",
        "Month",
        "StoreKPIAchievementBraPenetration",
        "StoreTargetAchievement",
      ],
      type: "collection" as const,
    },
    {
      id: "allSales",
      label: "All Sales",
      properties: ["CreatedBy", "CreatedOn", "SaleAmount"],
      type: "collection" as const,
    },
    {
      id: "allAttendance",
      label: "All Attendance",
      properties: ["UserId", "CreatedOn", "WorkingHours"],
      type: "collection" as const,
    },
    {
      id: "allLeaveRequests",
      label: "All Leave Requests",
      properties: ["CreatedBy", "LeaveType", "Status"],
      type: "collection" as const,
    },
    {
      id: "leave",
      label: "Leave Data",
      properties: ["Unpaid"],
      type: "object" as const,
    },
  ],

  // Operators
  OPERATORS: [
    {
      id: ">",
      label: "Greater Than",
      type: "comparison" as const,
      precedence: 6,
      associativity: "left" as const,
    },
    {
      id: "<",
      label: "Less Than",
      type: "comparison" as const,
      precedence: 6,
      associativity: "left" as const,
    },
    {
      id: ">=",
      label: "Greater or Equal",
      type: "comparison" as const,
      precedence: 6,
      associativity: "left" as const,
    },
    {
      id: "<=",
      label: "Less or Equal",
      type: "comparison" as const,
      precedence: 6,
      associativity: "left" as const,
    },
    {
      id: "==",
      label: "Equals",
      type: "comparison" as const,
      precedence: 7,
      associativity: "left" as const,
    },
    {
      id: "!=",
      label: "Not Equals",
      type: "comparison" as const,
      precedence: 7,
      associativity: "left" as const,
    },
    {
      id: "===",
      label: "Strict Equals",
      type: "comparison" as const,
      precedence: 7,
      associativity: "left" as const,
    },
    {
      id: "!==",
      label: "Strict Not Equals",
      type: "comparison" as const,
      precedence: 7,
      associativity: "left" as const,
    },
    {
      id: "+",
      label: "Add",
      type: "arithmetic" as const,
      precedence: 4,
      associativity: "left" as const,
    },
    {
      id: "-",
      label: "Subtract",
      type: "arithmetic" as const,
      precedence: 4,
      associativity: "left" as const,
    },
    {
      id: "*",
      label: "Multiply",
      type: "arithmetic" as const,
      precedence: 3,
      associativity: "left" as const,
    },
    {
      id: "/",
      label: "Divide",
      type: "arithmetic" as const,
      precedence: 3,
      associativity: "left" as const,
    },
    {
      id: "%",
      label: "Modulo",
      type: "arithmetic" as const,
      precedence: 3,
      associativity: "left" as const,
    },
    {
      id: "**",
      label: "Power",
      type: "arithmetic" as const,
      precedence: 2,
      associativity: "right" as const,
    },
    {
      id: "&&",
      label: "AND",
      type: "logic" as const,
      precedence: 11,
      associativity: "left" as const,
    },
    {
      id: "||",
      label: "OR",
      type: "logic" as const,
      precedence: 12,
      associativity: "left" as const,
    },
    {
      id: "!",
      label: "NOT",
      type: "logic" as const,
      precedence: 2,
      associativity: "right" as const,
    },
  ],

  // Functions
  FUNCTIONS: [
    {
      id: "Math.min",
      label: "Math.min()",
      description: "Returns the smaller of two numbers",
      parameters: 2,
      returnType: "number" as const,
      category: "math" as const,
    },
    {
      id: "Math.max",
      label: "Math.max()",
      description: "Returns the larger of two numbers",
      parameters: 2,
      returnType: "number" as const,
      category: "math" as const,
    },
    {
      id: "Math.abs",
      label: "Math.abs()",
      description: "Returns absolute value",
      parameters: 1,
      returnType: "number" as const,
      category: "math" as const,
    },
    {
      id: "Math.round",
      label: "Math.round()",
      description: "Rounds to nearest integer",
      parameters: 1,
      returnType: "number" as const,
      category: "math" as const,
    },
    {
      id: "Math.floor",
      label: "Math.floor()",
      description: "Rounds down to integer",
      parameters: 1,
      returnType: "number" as const,
      category: "math" as const,
    },
    {
      id: "Math.ceil",
      label: "Math.ceil()",
      description: "Rounds up to integer",
      parameters: 1,
      returnType: "number" as const,
      category: "math" as const,
    },
    {
      id: "Math.sqrt",
      label: "Math.sqrt()",
      description: "Returns square root",
      parameters: 1,
      returnType: "number" as const,
      category: "math" as const,
    },
    {
      id: "Math.pow",
      label: "Math.pow()",
      description: "Returns power of number",
      parameters: 2,
      returnType: "number" as const,
      category: "math" as const,
    },
    {
      id: "DateDiff",
      label: "DateDiff()",
      description: "Calculates difference between dates",
      parameters: 3,
      returnType: "number" as const,
      category: "date" as const,
    },
    {
      id: "Now",
      label: "Now()",
      description: "Returns current date/time",
      parameters: 0,
      returnType: "date" as const,
      category: "date" as const,
    },
    {
      id: "Today",
      label: "Today()",
      description: "Returns current date",
      parameters: 0,
      returnType: "date" as const,
      category: "date" as const,
    },
    {
      id: "AddDays",
      label: "AddDays()",
      description: "Adds days to date",
      parameters: 2,
      returnType: "date" as const,
      category: "date" as const,
    },
    {
      id: "AddMonths",
      label: "AddMonths()",
      description: "Adds months to date",
      parameters: 2,
      returnType: "date" as const,
      category: "date" as const,
    },
    {
      id: "AddYears",
      label: "AddYears()",
      description: "Adds years to date",
      parameters: 2,
      returnType: "date" as const,
      category: "date" as const,
    },
    {
      id: "String.length",
      label: "String.length",
      description: "Returns string length",
      parameters: 1,
      returnType: "number" as const,
      category: "string" as const,
    },
    {
      id: "String.contains",
      label: "String.contains()",
      description: "Checks if string contains substring",
      parameters: 2,
      returnType: "boolean" as const,
      category: "string" as const,
    },
    {
      id: "String.startsWith",
      label: "String.startsWith()",
      description: "Checks if string starts with substring",
      parameters: 2,
      returnType: "boolean" as const,
      category: "string" as const,
    },
    {
      id: "String.endsWith",
      label: "String.endsWith()",
      description: "Checks if string ends with substring",
      parameters: 2,
      returnType: "boolean" as const,
      category: "string" as const,
    },
    {
      id: "String.toUpperCase",
      label: "String.toUpperCase()",
      description: "Converts string to uppercase",
      parameters: 1,
      returnType: "string" as const,
      category: "string" as const,
    },
    {
      id: "String.toLowerCase",
      label: "String.toLowerCase()",
      description: "Converts string to lowercase",
      parameters: 1,
      returnType: "string" as const,
      category: "string" as const,
    },
  ],

  // Collection Methods
  COLLECTION_METHODS: [
    {
      id: "where",
      label: ".where()",
      description: "Filter collection based on condition",
      parameters: 1,
      returnType: "collection" as const,
    },
    {
      id: "sum",
      label: ".sum()",
      description: "Sum all values in collection",
      parameters: 0,
      returnType: "number" as const,
    },
    {
      id: "average",
      label: ".average()",
      description: "Calculate average of collection",
      parameters: 0,
      returnType: "number" as const,
    },
    {
      id: "count",
      label: ".count()",
      description: "Count items in collection",
      parameters: 0,
      returnType: "number" as const,
    },
    {
      id: "max",
      label: ".max()",
      description: "Find maximum value",
      parameters: 0,
      returnType: "any" as const,
    },
    {
      id: "min",
      label: ".min()",
      description: "Find minimum value",
      parameters: 0,
      returnType: "any" as const,
    },
    {
      id: "first",
      label: ".first()",
      description: "Get first item",
      parameters: 0,
      returnType: "any" as const,
    },
    {
      id: "last",
      label: ".last()",
      description: "Get last item",
      parameters: 0,
      returnType: "any" as const,
    },
    {
      id: "any",
      label: ".any()",
      description: "Check if any items match condition",
      parameters: 1,
      returnType: "boolean" as const,
    },
    {
      id: "all",
      label: ".all()",
      description: "Check if all items match condition",
      parameters: 1,
      returnType: "boolean" as const,
    },
    {
      id: "groupBy",
      label: ".groupBy()",
      description: "Group items by key",
      parameters: 1,
      returnType: "collection" as const,
    },
    {
      id: "orderBy",
      label: ".orderBy()",
      description: "Sort items ascending",
      parameters: 1,
      returnType: "collection" as const,
    },
    {
      id: "orderByDescending",
      label: ".orderByDescending()",
      description: "Sort items descending",
      parameters: 1,
      returnType: "collection" as const,
    },
    {
      id: "take",
      label: ".take()",
      description: "Take first N items",
      parameters: 1,
      returnType: "collection" as const,
    },
    {
      id: "skip",
      label: ".skip()",
      description: "Skip first N items",
      parameters: 1,
      returnType: "collection" as const,
    },
    {
      id: "distinct",
      label: ".distinct()",
      description: "Get unique items",
      parameters: 0,
      returnType: "collection" as const,
    },
  ],

  // Rule Templates
  RULE_TEMPLATES: [
    {
      id: "sales-target",
      name: "Sales Target Check",
      description: "Basic sales amount comparison with target",
      category: "Sales",
      complexity: "simple" as const,
      expression: "sale.Amount > context.Target",
      onSuccess: "sale.Amount * 0.1",
      onFailure: "100",
    },
    {
      id: "tiered-commission",
      name: "Tiered Commission with Cap",
      description: "Commission with tiered rates and maximum cap",
      category: "Commission",
      complexity: "intermediate" as const,
      expression:
        "(sale.Amount > context.Target) && (storeTarget.where(t => t.StoreId == user.StoreId && t.Month == context.Month).StoreKPIAchievementBraPenetration.average() >= 1)",
      onSuccess:
        "user.Designation == 'Manager' ? Math.min(sale.Amount * 0.2, 5000) : Math.min(sale.Amount * 0.15, 2500)",
      onFailure: "sale.Amount * 0.05",
    },
    {
      id: "recent-joiner",
      name: "Recent Joiner Bonus",
      description: "Bonus for employees who joined within 90 days",
      category: "Bonus",
      complexity: "intermediate" as const,
      expression: "DateDiff('day', user.DateJoined, Now()) <= 90",
      onSuccess: "Math.max(50, sale.Amount * 0.03 + 200)",
      onFailure: "sale.Amount * 0.03",
    },
    {
      id: "quarterly-aggregation",
      name: "Quarterly Sales Aggregation",
      description: "Complex aggregation with designation-based bonus",
      category: "Aggregation",
      complexity: "advanced" as const,
      expression:
        "allSales.where(s => s.CreatedBy == user.Id && DateDiff('day', s.CreatedOn, Now()) <= 90).sum(s => s.SaleAmount) > 15000",
      onSuccess: "user.Designation == 'Senior' ? 1000 : 500",
      onFailure: "0",
    },
    {
      id: "attendance-consistency",
      name: "Attendance Consistency Bonus",
      description: "Attendance-based bonus with working hours check",
      category: "Attendance",
      complexity: "advanced" as const,
      expression:
        "allAttendance.where(a => a.UserId == user.Id && a.CreatedOn.Month == context.Month).average(a => a.WorkingHours) >= 7.5",
      onSuccess:
        "context.SumOfAllWorkingHours > 160 ? sale.Amount * 0.15 : sale.Amount * 0.1",
      onFailure: "sale.Amount * 0.02",
    },
    {
      id: "nested-tiers",
      name: "Nested Sale Amount Tiers",
      description: "Complex nested ternary operators for tiered calculations",
      category: "Tiers",
      complexity: "expert" as const,
      expression: "sale.Amount > 50",
      onSuccess:
        "sale.Amount <= 200 ? sale.Amount * 0.05 : (sale.Amount <= 1000 ? sale.Amount * 0.12 : (sale.Amount <= 5000 ? sale.Amount * 0.20 : 1500))",
      onFailure: "sale.Amount * 0.01",
    },
    {
      id: "discount-penalty",
      name: "High Discount Penalty",
      description: "Penalty for high discount with price floor",
      category: "Penalty",
      complexity: "intermediate" as const,
      expression: "(sale.Discount / sale.ProductPrice) > 0.2",
      onSuccess: "Math.min(sale.Amount * 0.03, 50)",
      onFailure: "Math.max(10, sale.Amount * 0.12)",
    },
    {
      id: "leave-bonus",
      name: "Leave Request Bonus",
      description: "Fixed bonus for approved leave requests",
      category: "Leave",
      complexity: "intermediate" as const,
      expression:
        "allLeaveRequests.where(l => l.CreatedBy == user.Id && l.LeaveType == 'Paternity' && l.Status == 'Approved').count() > 0",
      onSuccess: "2000",
      onFailure: "sale.Amount * 0.1",
    },
    {
      id: "country-match",
      name: "Country Match Bonus",
      description: "Bonus for matching country codes and sales comparison",
      category: "Location",
      complexity: "intermediate" as const,
      expression:
        "(user.CountryCode == user.RetailCountryCode) && (sale.Amount > context.OverallSalesByStore / 30)",
      onSuccess: "sale.Amount * 0.18",
      onFailure: "sale.Amount * 0.09",
    },
    {
      id: "quantity-category",
      name: "Quantity and Category Bonus",
      description: "Bonus based on quantity and specific category",
      category: "Product",
      complexity: "simple" as const,
      expression: "sale.Quantity >= 5 && sale.CategoryId == 10",
      onSuccess: "sale.Tax * 0.5",
      onFailure: "0",
    },
    {
      id: "inactive-user",
      name: "Inactive User Safety",
      description: "Safety rule for inactive users",
      category: "Safety",
      complexity: "simple" as const,
      expression: "user.IsActive == false",
      onSuccess: "0",
      onFailure: "sale.Amount * 0.1",
    },
    {
      id: "weekend-bonus",
      name: "Weekend Sales Bonus",
      description: "Higher commission for weekend sales",
      category: "Time",
      complexity: "simple" as const,
      expression:
        "sale.CreatedOn.DayOfWeek == 0 || sale.CreatedOn.DayOfWeek == 6",
      onSuccess: "sale.Amount * 0.13",
      onFailure: "sale.Amount * 0.1",
    },
    {
      id: "sales-consistency",
      name: "Sales Consistency Check",
      description: "Requires minimum sales count for full commission",
      category: "Consistency",
      complexity: "intermediate" as const,
      expression:
        "allSales.where(s => s.CreatedBy == user.Id && s.CreatedOn.Month == context.Month).count() >= 10",
      onSuccess: "sale.Amount * 0.15",
      onFailure: "sale.Amount * 0.05",
    },
    {
      id: "unpaid-leave-penalty",
      name: "Unpaid Leave Penalty",
      description: "Penalty for excessive unpaid leave",
      category: "Penalty",
      complexity: "simple" as const,
      expression: "leave.Unpaid > 5",
      onSuccess: "Math.max(0, sale.Amount * 0.1 - 200)",
      onFailure: "sale.Amount * 0.1",
    },
    {
      id: "brand-sales-cap",
      name: "Brand Sales Cap",
      description: "Brand-specific sales with min/max cap",
      category: "Brand",
      complexity: "intermediate" as const,
      expression: "sale.BrandId == user.BrandId",
      onSuccess: "Math.min(Math.max(50, sale.Amount * 0.12), 500)",
      onFailure: "sale.Amount * 0.05",
    },
    {
      id: "store-target-achievement",
      name: "Store Target Achievement",
      description: "Flat bonus for store target achievement",
      category: "Store",
      complexity: "advanced" as const,
      expression:
        "storeTarget.where(t => t.StoreId == user.StoreId && t.Month == context.Month).StoreTargetAchievement.average() >= 1 && context.TotalMonthlySales > 100000",
      onSuccess: "750",
      onFailure: "0",
    },
  ],
};

// Expression validation utilities
export class ExpressionValidator {
  static validate(expression: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!expression.trim()) {
      errors.push("Expression cannot be empty");
      return { isValid: false, errors, warnings };
    }

    // Check for balanced parentheses
    const openParens = (expression.match(/\(/g) || []).length;
    const closeParens = (expression.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push("Unbalanced parentheses");
    }

    // Check for undefined variables
    if (expression.includes("undefined")) {
      errors.push("Expression contains undefined values");
    }

    // Check for common syntax errors
    if (expression.includes("===") && expression.includes("==")) {
      warnings.push("Mixed use of == and === operators");
    }

    // Check for potential division by zero
    if (expression.includes("/ 0") || expression.includes("/0")) {
      warnings.push("Potential division by zero");
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

// Expression evaluation utilities
export class ExpressionEvaluator {
  static evaluate(expression: string, context: any): TestResult {
    const startTime = performance.now();

    try {
      // In a real implementation, you would use a proper expression evaluator
      // For now, we'll do basic evaluation
      const result = this.safeEval(expression, context);
      const endTime = performance.now();

      return {
        success: true,
        result,
        executionTime: endTime - startTime,
      };
    } catch (error) {
      const endTime = performance.now();

      return {
        success: false,
        result: null,
        error: error instanceof Error ? error.message : "Unknown error",
        executionTime: endTime - startTime,
      };
    }
  }

  private static safeEval(expression: string, context: any): any {
    // This is a simplified version - in production, use a proper expression evaluator
    // like expr-eval, jexl, or similar
    const func = new Function(
      "context",
      `with(context) { return ${expression}; }`
    );
    return func(context);
  }
}

// Expression formatting utilities
export class ExpressionFormatter {
  static format(expression: string): string {
    // Basic formatting - add spaces around operators
    return expression
      .replace(/([+\-*/%><=!&|])/g, " $1 ")
      .replace(/\s+/g, " ")
      .trim();
  }

  static beautify(expression: string): string {
    // More advanced formatting with proper indentation
    let formatted = expression;
    let indentLevel = 0;
    const indentSize = 2;

    // Add line breaks for complex expressions
    formatted = formatted.replace(/&&/g, " &&\n");
    formatted = formatted.replace(/\|\|/g, " ||\n");

    // Add indentation
    const lines = formatted.split("\n");
    const indentedLines = lines.map((line) => {
      if (line.includes("(")) indentLevel++;
      if (line.includes(")")) indentLevel--;
      return " ".repeat(indentLevel * indentSize) + line.trim();
    });

    return indentedLines.join("\n");
  }
}
