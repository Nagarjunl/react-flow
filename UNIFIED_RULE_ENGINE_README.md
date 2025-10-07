# 🚀 Unified Rule Engine System

## Overview

This is a **unified rule engine system** that combines the best features from both visual flow editing and form-based rule management. It provides a comprehensive solution for creating, testing, and managing business rules with backend integration.

## ✨ Key Features

### 🎯 **Visual Flow Editor**

- **Drag-and-drop interface** for creating rule flows
- **Node-based configuration** with individual rule settings
- **Real-time visualization** of rule logic
- **Connection-based rule building** with conditions and actions

### 🔧 **Advanced Rule Configuration**

- **Individual rule settings** for each ActionNode
- **Multiple rule types**: Commission, Bonus, Incentive, Penalty
- **Priority management** and active/inactive status
- **Custom descriptions** and event messages
- **Flexible action types**: Percentage, Fixed Amount, Custom Formula

### 🧪 **Built-in Testing**

- **Test data panel** with comprehensive field support
- **Real-time rule evaluation** with immediate feedback
- **Commission calculation** testing
- **Error handling** and validation

### 💾 **Backend Integration**

- **API service layer** with axios integration
- **CRUD operations** for rule management
- **Data persistence** with database storage
- **Rule versioning** and history tracking

### 📊 **Rule Management**

- **Saved rules panel** with full CRUD operations
- **Rule status tracking** (Active/Inactive)
- **Priority-based organization**
- **Bulk operations** and rule templates

## 🏗️ Architecture

### **Frontend Components**

```
src/
├── components/
│   ├── ActionNode.jsx          # Enhanced action configuration
│   ├── ConditionNode.jsx       # Condition building
│   ├── RuleEngine.jsx          # Unified rule engine
│   ├── TableNode.jsx           # Data source nodes
│   └── SideBar.jsx             # Node creation panel
├── services/
│   └── apiService.js           # Backend API integration
├── constants/
│   └── constant.js             # Table schemas and configurations
└── App.jsx                     # Main application
```

### **Backend Integration**

- **RESTful API** endpoints for rule management
- **Database persistence** for rules and configurations
- **Rule testing** with real-time evaluation
- **Data fetching** for dropdowns and selections

## 🚀 Getting Started

### 1. **Install Dependencies**

```bash
npm install
```

### 2. **Configure Backend**

Update the API base URL in `src/services/apiService.js`:

```javascript
axios.defaults.baseURL = "https://your-backend-url.com";
```

### 3. **Start Development Server**

```bash
npm run dev
```

## 📋 How to Use

### **Creating Rules**

1. **Add Table Nodes**

   - Drag table nodes from the sidebar
   - Select relevant data sources (metrics, user, sales, etc.)

2. **Create Condition Nodes**

   - Click "Create Condition" on table nodes
   - Configure field comparisons and operators
   - Set logical operators (AND/OR)

3. **Create Action Nodes**

   - Click "Create Action" on table nodes
   - Configure target table and field
   - Set up rule configuration:
     - Rule name and description
     - Rule type (commission, bonus, etc.)
     - Success/error events
     - Priority and status
     - Action type and value

4. **Connect Nodes**
   - Drag connections between condition and action nodes
   - Build complex rule flows

### **Testing Rules**

1. **Open Test Panel**

   - Click "Show Test Panel" in the Rule Engine
   - Modify test data values
   - View real-time test results

2. **Generate & Test**
   - Click "Generate & Test Rules"
   - View generated JSON
   - See test results immediately

### **Managing Rules**

1. **Save Rules**

   - Click "Save to Backend" after generating
   - Rules are stored in the database

2. **View Saved Rules**
   - Click "Show Rule Management"
   - View all saved rules
   - Delete or manage existing rules

## 🎯 Rule Types

### **Commission Rules**

- **Percentage-based**: `Sales * 5%`
- **Fixed amount**: `$1000`
- **Tiered**: Multiple percentage tiers
- **Target-based**: Performance-based calculations

### **Bonus Rules**

- **Quarterly bonuses**
- **Performance bonuses**
- **Achievement rewards**

### **Incentive Rules**

- **Attendance incentives**
- **Perfect performance rewards**
- **Special achievement bonuses**

### **Penalty Rules**

- **Attendance penalties**
- **Performance penalties**
- **Policy violation penalties**

## 📊 Generated JSON Format

The system generates JSON compatible with C# RulesEngine:

```json
[
  {
    "WorkflowName": "CommissionCalculation",
    "Rules": [
      {
        "RuleName": "HighPerformerCommission",
        "SuccessEvent": "High Performer Commission Applied",
        "ErrorMessage": "Does not meet high performer criteria",
        "Expression": "metrics.TargetAchievement >= 120 AND metrics.AttendancePercentage >= 95",
        "RuleExpressionType": "LambdaExpression",
        "Properties": {
          "CommissionType": "percentage",
          "Percentage": "5",
          "MinAmount": "500",
          "MaxAmount": "10000"
        }
      }
    ]
  }
]
```

## 🔧 Configuration Options

### **ActionNode Configuration**

- **Rule Name**: Unique identifier
- **Description**: Detailed rule description
- **Rule Type**: Commission, Bonus, Incentive, Penalty
- **Success Event**: What happens when rule succeeds
- **Error Message**: What happens when rule fails
- **Workflow Name**: Which workflow this rule belongs to
- **Priority**: Execution priority (1-100)
- **Status**: Active/Inactive
- **Action Type**: Percentage, Fixed, Formula
- **Action Value**: The calculation value

### **Test Data Fields**

- **Sales**: Sales amount
- **Region**: Geographic region
- **Store**: Store name
- **UserType**: User classification
- **TargetAchievement**: Performance percentage
- **AttendancePercentage**: Attendance rate
- **StoreKpiAchievement**: Store performance
- **PresentDays**: Days present
- **AbsentDays**: Days absent
- **ApprovedLeaveDays**: Approved leave days
- **TotalWorkingDays**: Total working days
- **NumberOfMcUplDays**: MC/UPL days
- **StoreTargetAchievement**: Store target achievement
- **Designation**: Job designation
- **Name**: User name
- **Amount**: Transaction amount
- **Quantity**: Item quantity
- **Date**: Transaction date

## 🎉 Benefits

### **For Developers**

- **Visual rule building** - No coding required
- **Real-time testing** - Immediate feedback
- **Backend integration** - Seamless data persistence
- **Extensible architecture** - Easy to add new features

### **For Business Users**

- **Intuitive interface** - Drag-and-drop simplicity
- **Comprehensive testing** - Validate rules before deployment
- **Rule management** - Organize and track all rules
- **Flexible configuration** - Support for complex business logic

### **For Organizations**

- **Scalable solution** - Handle thousands of rules
- **Audit trail** - Track rule changes and history
- **Performance optimized** - Efficient rule evaluation
- **Integration ready** - Works with existing systems

## 🔮 Future Enhancements

- **Rule templates** and presets
- **Bulk rule operations**
- **Advanced analytics** and reporting
- **Rule versioning** and rollback
- **Collaborative editing** and approval workflows
- **Advanced testing** with multiple scenarios
- **Rule optimization** and performance tuning

## 📞 Support

For questions or issues, please refer to the documentation or contact the development team.

---

**This unified system combines the power of visual flow editing with robust backend integration, providing a complete solution for business rule management.**
