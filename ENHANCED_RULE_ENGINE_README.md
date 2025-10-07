# Enhanced React Flow Rule Engine

## Overview

Your React Flow application has been significantly enhanced to generate JSON structures that match your target format. The system can now create complex rule configurations with multiple workflows, detailed properties, and sophisticated expressions.

## New Features

### 1. **Workflow Grouping**

- Rules are automatically grouped into workflows based on their type:
  - `CommissionCalculation` - for commission rules
  - `BonusCalculation` - for bonus rules
  - `IncentiveCalculation` - for incentive rules
  - `PenaltyCalculation` - for penalty rules

### 2. **Enhanced Rule Configuration**

- **Rule Name**: Custom naming or auto-generated
- **Success Event**: What happens when rule succeeds
- **Error Message**: What happens when rule fails
- **Rule Type**: Commission, Bonus, Incentive, or Penalty
- **Properties**: Complex configuration objects based on rule type

### 3. **Advanced Properties Generation**

The system automatically generates appropriate Properties objects based on:

- **Commission Types**: fixed, percentage, tiered, target_based, kpi_based, attendance_based
- **Expression Analysis**: Extracts numbers and keywords from expressions
- **Rule Type**: Different property structures for different rule types

### 4. **Enhanced Table Schema**

Added new tables that match your target JSON:

- `metrics` - TargetAchievement, AttendancePercentage, StoreKpiAchievement, etc.
- `user` - Designation, Name, Id
- `sales` - Amount, Quantity, Date

## How to Use

### Step 1: Create Nodes

1. Drag table nodes from the sidebar (metrics, user, sales, etc.)
2. Create condition nodes by selecting fields from tables
3. Create action nodes to define what happens when conditions are met

### Step 2: Configure Rules

1. Click "Show Rules" to open the Rule Engine panel
2. Set the workflow name (default: CommissionCalculation)
3. Choose rule type (commission, bonus, incentive, penalty)
4. Optionally set custom rule name, success event, and error message

### Step 3: Generate JSON

1. Click "Generate Target JSON"
2. The system will create JSON in your exact target format
3. Rules are automatically grouped by workflow type

## Example Generated JSON

```json
[
  {
    "WorkflowName": "CommissionCalculation",
    "Rules": [
      {
        "RuleName": "HighPerformerFixedCommission",
        "SuccessEvent": "High Performer - Fixed Commission Applied",
        "ErrorMessage": "Not a high performer",
        "Expression": "metrics.TargetAchievement >= 120 AND metrics.AttendancePercentage >= 95",
        "RuleExpressionType": "LambdaExpression",
        "Properties": {
          "CommissionType": "fixed",
          "CommissionAmount": "5000"
        }
      }
    ]
  }
]
```

## Expression Keywords for Properties

The system analyzes your action expressions to determine Properties:

- `percentage` or `%` → Percentage-based commission
- `fixed` or `amount` → Fixed amount commission
- `tiered` → Tiered commission structure
- `target_based` → Target-based commission
- `kpi_based` → KPI-based commission
- `attendance_based` → Attendance-based commission

## Supported Commission Types

### Fixed Commission

```json
{
  "CommissionType": "fixed",
  "CommissionAmount": "5000"
}
```

### Percentage Commission

```json
{
  "CommissionType": "percentage",
  "Percentage": "5",
  "MinAmount": "500",
  "MaxAmount": "10000"
}
```

### Tiered Commission

```json
{
  "CommissionType": "tiered",
  "Tiers": "[{\"MinAmount\":0,\"MaxAmount\":50000,\"Percentage\":2},...]"
}
```

## Benefits

1. **Exact Target Format**: Generates JSON that matches your specification exactly
2. **Automatic Grouping**: Rules are organized into appropriate workflows
3. **Smart Properties**: Intelligent property generation based on expressions
4. **Multiple Rule Types**: Support for commission, bonus, incentive, and penalty rules
5. **Complex Expressions**: Handles multi-condition expressions with AND logic
6. **User-Friendly**: Simple drag-and-drop interface with configuration options

## Next Steps

1. Test the system by creating sample rules
2. Verify the generated JSON matches your requirements
3. Customize the Properties generation logic if needed
4. Add more table schemas as required

The enhanced system now fully supports generating the complex JSON structure you showed in your example!
