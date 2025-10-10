# 🚀 React Flow Rule Engine - User Documentation

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Getting Started](#getting-started)
3. [Sidebar Controls](#sidebar-controls)
4. [Node Types](#node-types)
5. [Validation System](#validation-system)
6. [Minimap & Flow Controls](#minimap--flow-controls)
7. [JSON Generation & Export](#json-generation--export)
8. [Step-by-Step Workflow Guide](#step-by-step-workflow-guide)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 System Overview

The React Flow Rule Engine is a visual, drag-and-drop tool for creating complex business rules and workflows. It allows you to build rule-based systems using a node-based interface that generates structured JSON configurations.

### Key Features:

- **Visual Flow Editor**: Drag-and-drop interface for creating rule flows
- **Real-time Validation**: Instant feedback on rule configuration errors
- **Multiple Node Types**: Specialized nodes for different rule components
- **JSON Export**: Generate structured JSON for backend integration
- **Group Management**: Organize rules into logical groups
- **Minimap Navigation**: Easy navigation of large rule flows

---

## 🚀 Getting Started

### First Steps:

1. **Open the Application**: Launch the React Flow Rule Engine
2. **Start with Initial Node**: Add an Initial Node to begin your workflow
3. **Name Your Workflow**: Enter a descriptive workflow name
4. **Build Your Rules**: Add condition and action nodes as needed
5. **Validate & Export**: Use the validation panel and export features

---

## 🎛️ Sidebar Controls

The sidebar is your main control panel, located on the left side of the interface.

### 🚀 Workflow Actions Section

#### **Save Flow** 💾

- **Purpose**: Saves your complete workflow (rule JSON + flow JSON)
- **When to Use**: After building your rule flow
- **What it Does**: Downloads a combined file containing both the rule configuration and the visual flow data
- **File Format**: JSON file with workflow data

#### **Generate JSON** 📄

- **Purpose**: Creates rule engine JSON from your visual flow
- **When to Use**: When you want to see the generated rule configuration
- **What it Does**: Opens a drawer showing the structured JSON that can be used in your backend
- **Features**: Copy to clipboard, download as file

#### **Load from JSON** 📤

- **Purpose**: Restores a previously saved workflow
- **When to Use**: To continue working on a saved project
- **What it Does**: Opens a file picker to select and load a saved workflow file
- **Restores**: Complete visual flow and all node configurations

#### **View Flow JSON** 👁️

- **Purpose**: Shows the raw React Flow JSON structure
- **When to Use**: For debugging or understanding the flow structure
- **What it Does**: Displays the technical JSON representation of your visual flow
- **Note**: This is different from the rule engine JSON

### 📦 Add Nodes Section

#### **Initial Node** 🚀

- **Purpose**: Starting point of your workflow
- **Features**:
  - Workflow name input field
  - Only has bottom connection handle
  - Required for all workflows
- **Usage**: Always start your workflow with this node

#### **Rule Group** 📦

- **Purpose**: Container for organizing related rules
- **Features**:
  - Resizable group container
  - Can contain multiple conditions and operators
  - Visual grouping of related logic
- **Usage**: Create groups to organize complex rule logic

#### **Condition** 🔍

- **Purpose**: Defines business logic conditions
- **Features**:
  - Table selection dropdown
  - Field selection dropdown
  - Expression operator dropdown
  - Value input field
- **Usage**: Define the "if" part of your business rules

#### **Action** ⚡

- **Purpose**: Defines what happens when conditions are met
- **Features**:
  - Action type selection (onSuccess, onFailure, etc.)
  - Action name input
  - Can contain multiple conditions
- **Usage**: Define the "then" part of your business rules

#### **Operator** 🔗

- **Purpose**: Connects multiple conditions with logical operators
- **Features**:
  - AND, OR, NOT operators
  - Links multiple conditions together
- **Usage**: Combine multiple conditions with logical operators

### 📊 Flow Statistics

- **Nodes Count**: Shows total number of nodes in your flow
- **Edges Count**: Shows total number of connections between nodes
- **Real-time Updates**: Counts update as you add/remove elements

---

## 🧩 Node Types

### 🚀 Initial Node

**Purpose**: Starting point of your workflow

**Configuration**:

- **Workflow Name**: Enter a descriptive name for your workflow
- **Validation**: Name is required (cannot be empty)

**Visual Indicators**:

- Blue gradient background
- Single bottom connection handle
- Red border if validation fails

**Usage Tips**:

- Always start your workflow with this node
- Use descriptive names like "Commission Calculation" or "Bonus Rules"

### 🔍 Condition Node

**Purpose**: Defines business logic conditions

**Configuration**:

1. **Table Selection**: Choose from available tables:

   - `metrics`: TargetAchievement, AttendancePercentage, StoreKpiAchievement, etc.
   - `user`: Designation, Name, Id
   - `sales`: Amount, Quantity, Date
   - `orders`: id, customer_id, product_id, quantity, etc.
   - `products`: id, name, price, category, stock_quantity
   - `customers`: id, name, email, discount_rate, membership_level

2. **Field Selection**: Choose specific field from selected table
3. **Expression**: Select operator based on field type:
   - **Numeric/Integer**: >=, <=, =, >, <, !=
   - **Varchar**: contains, equals, starts with, ends with, !=
   - **Date**: >=, <=, =, > (after), < (before), !=
4. **Value**: Enter the comparison value

**Visual Indicators**:

- Red gradient background
- Input/output connection handles
- Red border if validation fails

**Usage Tips**:

- Field selection updates based on table selection
- Expression options change based on field type
- Use appropriate value formats (numbers for numeric, text for varchar)

### ⚡ Action Node

**Purpose**: Defines what happens when conditions are met

**Configuration**:

1. **Action Type**: Choose from:
   - `onTarget`: When target is achieved
   - `onSuccess`: When operation succeeds
   - `onFailure`: When operation fails
   - `onError`: When error occurs
   - `onComplete`: When process completes
2. **Action Name**: Enter descriptive name for the action

**Visual Indicators**:

- Teal gradient background
- Input/output connection handles
- Red border if validation fails

**Usage Tips**:

- Use descriptive action names
- Choose appropriate action types for your business logic

### 🔗 Conditional Operator Node

**Purpose**: Connects multiple conditions with logical operators

**Configuration**:

- **Operator**: Choose from AND, OR, NOT

**Visual Indicators**:

- Orange gradient background
- Multiple connection handles
- Red border if validation fails

**Usage Tips**:

- AND: All conditions must be true
- OR: At least one condition must be true
- NOT: Inverts the condition result

### 📦 Rule Group Node

**Purpose**: Container for organizing related rules

**Configuration**:

- **Label**: Enter group name
- **Resizable**: Can be resized by dragging corners

**Visual Indicators**:

- Purple gradient background
- Green border when selected
- Can contain child nodes

**Usage Tips**:

- Use groups to organize complex rule logic
- Click to select group for adding child nodes
- Resize to accommodate multiple child nodes

---

## ✅ Validation System

### Validation Panel

Located in the top-right corner of the interface.

**Features**:

- **Real-time Validation**: Continuously checks your flow for errors
- **Error Categories**: Different types of validation errors
- **Clickable Errors**: Click errors to highlight problematic nodes
- **Collapsible Interface**: Expand/collapse to save space

### Error Types

#### **Cycle Detection** 🔄

- **What it is**: Detects circular connections in your flow
- **Why it matters**: Prevents infinite loops in rule execution
- **How to fix**: Remove circular connections between nodes

#### **Disconnected Nodes** 🔌

- **What it is**: Nodes that aren't properly connected
- **Why it matters**: Ensures all nodes are part of the flow
- **How to fix**: Connect disconnected nodes or remove unused ones

#### **Operator Input Errors** ⚠️

- **What it is**: Operators with incorrect number of inputs
- **Why it matters**: Ensures logical operators work correctly
- **How to fix**: Connect appropriate number of inputs to operators

#### **Invalid Connections** ❌

- **What it is**: Connections between incompatible node types
- **Why it matters**: Prevents runtime errors
- **How to fix**: Connect only compatible node types

### Validation Indicators

- **Red Icons**: Show on nodes with errors
- **Hover Tooltips**: Display error details
- **Click to Focus**: Click error indicators to highlight issues

### Validation Status

- **✅ Valid**: Green checkmark - all validations passed
- **❌ Invalid**: Red X - errors need to be fixed
- **Summary**: Shows error count and status

---

## 🗺️ Minimap & Flow Controls

### Minimap

Located in the bottom-right corner of the flow area.

**Features**:

- **Overview**: Shows entire flow in miniature
- **Navigation**: Click to jump to different areas
- **Zoom Indicator**: Shows current zoom level
- **Node Representation**: Different colors for different node types

**Usage**:

- **Navigate**: Click anywhere on minimap to center view
- **Zoom**: Use mouse wheel or zoom controls
- **Overview**: Get quick overview of large flows

### Flow Controls

Located in the bottom-left corner of the flow area.

**Controls**:

- **🔍 Zoom In**: Increase zoom level
- **🔍 Zoom Out**: Decrease zoom level
- **🎯 Fit View**: Automatically fit entire flow in view
- **🔄 Reset**: Reset zoom and position

**Keyboard Shortcuts**:

- **Mouse Wheel**: Zoom in/out
- **Ctrl + Mouse Wheel**: Fine zoom control
- **Space + Drag**: Pan around the flow

### Background

- **Grid Pattern**: Helps with alignment
- **Light Gray**: Subtle background for better node visibility
- **Responsive**: Adapts to zoom level

---

## 📄 JSON Generation & Export

### JSON Drawer

Opens when you click "Generate JSON" or "View Flow JSON".

**Features**:

- **Syntax Highlighting**: Color-coded JSON for readability
- **Copy Button**: One-click copy to clipboard
- **Download Button**: Save JSON to file
- **Dark Theme**: Easy on the eyes for code viewing

### Generated JSON Structure

The system generates two types of JSON:

#### **Rule Engine JSON** (Generate JSON)

```json
{
  "workflows": [
    {
      "name": "CommissionCalculation",
      "rules": [
        {
          "name": "High Performance Bonus",
          "type": "commission",
          "conditions": [...],
          "actions": [...],
          "properties": {...}
        }
      ]
    }
  ]
}
```

#### **Flow JSON** (View Flow JSON)

```json
{
  "nodes": [...],
  "edges": [...],
  "viewport": {...}
}
```

### Export Options

#### **Copy to Clipboard** 📋

- **Purpose**: Quick copy for pasting into other applications
- **Format**: Plain text JSON
- **Confirmation**: Shows "Copied!" message

#### **Download File** 💾

- **Purpose**: Save JSON to local file
- **Filename**: `rule-engine-config.json`
- **Format**: Standard JSON file

### Usage Tips:

- **Generate JSON**: Use for backend integration
- **View Flow JSON**: Use for debugging or flow analysis
- **Save Flow**: Use for complete workflow backup
- **Load from JSON**: Use to restore saved workflows

---

## 📋 Step-by-Step Workflow Guide

### Step 1: Create Initial Node

1. Click **"Initial Node"** in the sidebar
2. Enter a **workflow name** (e.g., "Commission Rules")
3. Verify the node shows a green border (valid)

### Step 2: Create Rule Groups

1. Click **"Rule Group"** in the sidebar
2. Enter a **group name** (e.g., "Sales Commission")
3. Click the group to select it (green border appears)
4. Resize the group to accommodate child nodes

### Step 3: Add Conditions

1. With a group selected, click **"Add Condition"**
2. Configure the condition:
   - Select **table** (e.g., "sales")
   - Select **field** (e.g., "Amount")
   - Select **expression** (e.g., ">=")
   - Enter **value** (e.g., "1000")
3. Repeat for additional conditions

### Step 4: Add Operators

1. With a group selected, click **"Add Operator"**
2. Select operator type (AND, OR, NOT)
3. Connect conditions to the operator

### Step 5: Add Actions

1. Click **"Action"** in the sidebar
2. Configure the action:
   - Select **action type** (e.g., "onSuccess")
   - Enter **action name** (e.g., "Calculate Commission")
3. Connect conditions to the action

### Step 6: Connect Nodes

1. **Drag** from output handle of one node to input handle of another
2. **Valid connections** will show green preview
3. **Invalid connections** will be rejected with error message

### Step 7: Validate Flow

1. Check the **Validation Panel** in top-right
2. **Fix any errors** shown in red
3. **Review warnings** shown in yellow
4. Ensure all nodes are properly connected

### Step 8: Generate JSON

1. Click **"Generate JSON"** in the sidebar
2. **Review** the generated JSON in the drawer
3. **Copy** or **Download** as needed
4. **Close** the drawer when done

### Step 9: Save Workflow

1. Click **"Save Flow"** in the sidebar
2. **Choose location** to save the file
3. **File contains** both rule JSON and flow JSON

---

## 🔧 Troubleshooting

### Common Issues

#### **"Invalid Connection" Error**

- **Cause**: Trying to connect incompatible node types
- **Solution**: Only connect nodes that are designed to work together
- **Example**: Don't connect Initial Node directly to Action Node

#### **"Cycle Detection" Error**

- **Cause**: Circular connections in your flow
- **Solution**: Remove the circular connection
- **Check**: Look for nodes that connect back to themselves

#### **"Disconnected Node" Warning**

- **Cause**: Node is not connected to the main flow
- **Solution**: Either connect the node or remove it
- **Note**: Some nodes can be standalone (like Initial Node)

#### **Validation Panel Not Showing**

- **Cause**: Panel might be collapsed
- **Solution**: Click the expand arrow in the validation panel header
- **Location**: Top-right corner of the interface

#### **Minimap Not Visible**

- **Cause**: Minimap might be hidden or flow is too small
- **Solution**: Zoom out or check minimap settings
- **Location**: Bottom-right corner of the flow area

#### **JSON Generation Fails**

- **Cause**: Flow has validation errors
- **Solution**: Fix all validation errors first
- **Check**: Ensure all required fields are filled

#### **Nodes Not Appearing**

- **Cause**: Nodes might be outside visible area
- **Solution**: Click "Fit View" button or use minimap to navigate
- **Prevention**: Use minimap to keep track of node positions

### Performance Tips

#### **Large Flows**

- Use **minimap** for navigation
- **Group related nodes** together
- **Save frequently** to avoid data loss

#### **Complex Rules**

- **Break down** complex rules into smaller groups
- **Use operators** to combine conditions logically
- **Validate frequently** to catch errors early

#### **Navigation**

- **Mouse wheel**: Zoom in/out
- **Space + drag**: Pan around the flow
- **Ctrl + mouse wheel**: Fine zoom control

---

## 📞 Support

### Getting Help

- **Validation Errors**: Check the validation panel for specific error messages
- **Node Configuration**: Refer to the node type documentation above
- **Flow Design**: Follow the step-by-step workflow guide
- **JSON Issues**: Ensure all validation errors are resolved first

### Best Practices

1. **Start Simple**: Begin with basic flows and add complexity gradually
2. **Validate Often**: Check validation panel regularly during development
3. **Use Groups**: Organize related rules into groups for better management
4. **Save Frequently**: Use "Save Flow" to backup your work
5. **Test JSON**: Always review generated JSON before using in production

---

_This documentation covers all major features and usage patterns of the React Flow Rule Engine. For additional support or feature requests, please refer to your development team._
