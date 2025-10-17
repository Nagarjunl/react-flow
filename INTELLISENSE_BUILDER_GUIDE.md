# Intellisense Builder Module - Complete Learning Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Core Components](#core-components)
4. [Hooks System](#hooks-system)
5. [Data Flow](#data-flow)
6. [Key Features](#key-features)
7. [API Integration](#api-integration)
8. [State Management](#state-management)
9. [Validation System](#validation-system)
10. [Development Guide](#development-guide)

---

## 🎯 Overview

The **Intellisense Builder** is a sophisticated React-based workflow rule builder that allows users to create, edit, and manage complex business rules with intelligent autocomplete and validation features.

### Key Capabilities:

- **Visual Rule Building**: Drag-and-drop interface for creating rules
- **Intelligent Autocomplete**: Smart suggestions for expressions and actions
- **Real-time Validation**: Instant feedback on rule validity
- **CRUD Operations**: Create, Read, Update, Delete rules via API
- **Test Integration**: Built-in testing capabilities
- **JSON Export**: Generate structured JSON output

---

## 🏗️ Architecture

### Module Structure

```
src/features/intellisenseBuilder/
├── components/          # UI Components
├── hooks/              # Custom React Hooks
├── services/           # API Services
├── utils/              # Utility Functions
├── types/              # TypeScript Definitions
├── constants/          # Constants & Configuration
└── ui/                 # Reusable UI Components
```

### Technology Stack

- **React 18** with TypeScript
- **Material-UI** for UI components
- **@dnd-kit** for drag-and-drop functionality
- **RTK Query** for API state management
- **Custom Hooks** for state management

---

## 🧩 Core Components

### 1. **IntellisenseBuilder.tsx** (Main Component)

The central orchestrator component that brings everything together.

**Key Responsibilities:**

- Manages overall application state
- Coordinates between different hooks
- Handles user interactions (save, test, generate JSON)
- Provides drag-and-drop functionality
- Manages edit mode vs create mode

**Key Features:**

```tsx
// Main component structure
const IntellisenseBuilder = () => {
  const { state, actions } = useRuleBuilder(initialWorkflow);
  const { saveWorkflow, testWorkflow, generateJSON } = useWorkflowActions();
  const { editMode, saveEditedRule, cancelEdit } = useRuleEdit();

  // Handles both create and update modes
  const handleSave = async () => {
    if (editMode.isEditMode) {
      await saveEditedRule(workflow); // PUT API
    } else {
      await saveWorkflow(workflow); // POST API
    }
  };
};
```

### 2. **RuleGroupComponent.tsx**

Manages individual rule groups with their expressions and actions.

**Features:**

- Rule name and expression editing
- Action group management
- Delete and update functionality
- Drag-and-drop reordering

### 3. **RuleExpressionEditor.tsx**

Provides intelligent expression editing with autocomplete.

**Features:**

- Syntax highlighting
- Auto-completion suggestions
- Real-time validation
- Theme support (light/dark)

### 4. **TestData.tsx**

Handles test data management and API testing.

**Features:**

- Test data input forms
- API testing capabilities
- Result visualization
- Error handling

### 5. **RuleList.tsx**

Displays a list of existing rules with CRUD operations.

**Features:**

- Rule listing with search
- Edit/Delete actions
- Navigation to rule builder
- Status indicators

---

## 🎣 Hooks System

### 1. **useRuleBuilder.ts** - Core State Management

Manages the main application state and rule operations.

```tsx
export const useRuleBuilder = (initialState?: Partial<RuleBuilderState>) => {
  const [state, setState] = useState<RuleBuilderState>({
    workflowData: { workflowName: "", description: "" },
    ruleGroups: [],
    validationErrors: [],
  });

  // Key Actions (with useCallback for child components)
  const addRuleGroup = useCallback(() => {
    /* ... */
  }, []);
  const updateRuleGroup = useCallback((ruleId, updates) => {
    /* ... */
  }, []);
  const deleteRuleGroup = useCallback((ruleId) => {
    /* ... */
  }, []);

  // Local-only functions (no useCallback needed)
  const generateWorkflow = () =>
    generateWorkflowJSON(state.workflowData, state.ruleGroups);
  const validateWorkflow = () => validateRules();
};
```

**State Structure:**

```tsx
interface RuleBuilderState {
  workflowData: WorkflowData; // Workflow name & description
  ruleGroups: RuleGroup[]; // Array of rules
  validationErrors: string[]; // Validation messages
}
```

### 2. **useWorkflowActions.ts** - API Operations

Handles all API interactions for workflow management.

```tsx
export const useWorkflowActions = () => {
  const workflowService = useMemo(() => new WorkflowService({...}), []);

  // API Operations
  const saveWorkflow = async (workflow) => workflowService.saveWorkflow(workflow);
  const updateWorkflow = async (workflow, ruleId) => workflowService.updateWorkflow(workflow, ruleId);
  const testWorkflow = async (workflow) => workflowService.testWorkflow(workflow, testData);
  const generateJSON = (workflow) => workflowService.generateJSON(workflow);
};
```

### 3. **useRuleEdit.ts** - Edit Mode Management

Manages edit mode functionality and rule loading.

```tsx
export const useRuleEdit = () => {
  const [editMode, setEditMode] = useState<EditModeState>({
    isEditMode: false,
    ruleId: null,
    originalRuleName: "",
    isLoading: false,
    error: null,
  });

  // Key Functions
  const loadRuleFromUrl = useCallback((searchParams) => {
    /* ... */
  }, []);
  const saveEditedRule = useCallback(async (workflow) => {
    /* ... */
  }, []);
  const getTransformedRuleData = () => {
    /* ... */
  }; // Local function
};
```

---

## 🔄 Data Flow

### 1. **Create Mode Flow**

```
User Input → useRuleBuilder → State Update → Generate Workflow → API Save
```

### 2. **Edit Mode Flow**

```
URL Params → useRuleEdit → Load Rule → Transform Data → useRuleBuilder → User Edits → Save
```

### 3. **Data Transformation Flow**

```
API Rule → transformApiRuleToBuilderState → RuleBuilderState → User Edits →
transformBuilderStateToApiRule → API Rule
```

### 4. **Validation Flow**

```
User Input → validateWorkflow → Validation Errors → UI Feedback
```

---

## ⚡ Key Features

### 1. **Drag & Drop Reordering**

```tsx
// Using @dnd-kit for drag-and-drop
<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
  <SortableContext
    items={state.ruleGroups.map((r) => r.id)}
    strategy={verticalListSortingStrategy}
  >
    {state.ruleGroups.map((ruleGroup) => (
      <RuleGroupComponent key={ruleGroup.id} ruleGroup={ruleGroup} />
    ))}
  </SortableContext>
</DndContext>
```

### 2. **Intelligent Autocomplete**

```tsx
// Completion engine provides smart suggestions
const completionEngine = new CompletionEngine();
const suggestions = completionEngine.getSuggestions(context, cursorPosition);
```

### 3. **Real-time Validation**

```tsx
// Validator checks rule validity
const validateWorkflow = (workflowData, ruleGroups) => {
  const errors = [];
  // Validation logic
  return { isValid: errors.length === 0, errors };
};
```

### 4. **Theme Support**

```tsx
const [editorTheme, setEditorTheme] = useState<"light" | "dark">("light");
const toggleTheme = () =>
  setEditorTheme((prev) => (prev === "light" ? "dark" : "light"));
```

---

## 🔌 API Integration

### 1. **API Endpoints**

```tsx
// RTK Query mutations
const [createRuleMutation] = useCreateRuleMutation();
const [updateRuleMutation] = useUpdateRuleMutation();
const [testRuleMutation] = useTestRuleMutation();
const { data: ruleData } = useGetRuleByIdQuery({ id: ruleId });
```

### 2. **Service Layer**

```tsx
export class WorkflowService {
  async saveWorkflow(workflow: GeneratedWorkflow[]): Promise<void> {
    const apiData = prepareApiData(workflow);
    const result = await this.deps.createRuleMutation({ data: apiData });
  }

  async updateWorkflow(
    workflow: GeneratedWorkflow[],
    ruleId: string | number
  ): Promise<void> {
    const apiData = prepareApiData(workflow);
    const result = await this.deps.updateRuleMutation({
      id: ruleId,
      data: apiData,
    });
  }
}
```

### 3. **Data Transformation**

```tsx
// Transform internal state to API format
export const transformBuilderStateToApiRule = (
  builderState: RuleBuilderState
): Partial<RuleType> => {
  const workflow: GeneratedWorkflow[] = [
    {
      WorkflowName: builderState.workflowData.workflowName,
      Description: builderState.workflowData.description,
      Rules: builderState.ruleGroups.map((ruleGroup) => ({
        RuleName: ruleGroup.ruleName,
        Expression: ruleGroup.expression,
        Actions:
          ruleGroup.actionGroups.length > 0
            ? {
                OnSuccess: {
                  Name: ruleGroup.actionGroups[0].actionType,
                  Context: {
                    Expression: ruleGroup.actionGroups[0].expression || "",
                  },
                },
              }
            : undefined,
      })),
    },
  ];

  return {
    name: builderState.workflowData.workflowName,
    description: builderState.workflowData.description,
    ruleJson: JSON.stringify(workflow),
    isActive: true,
  };
};
```

---

## 📊 State Management

### 1. **Local State (useState)**

```tsx
// Component-level state
const [isJsonDrawerOpen, setIsJsonDrawerOpen] = useState(false);
const [generatedJson, setGeneratedJson] = useState("");
const [editorTheme, setEditorTheme] = useState<"light" | "dark">("light");
const [activeTab, setActiveTab] = useState(0);
```

### 2. **Custom Hook State**

```tsx
// Rule builder state
const [state, setState] = useState<RuleBuilderState>({
  workflowData: { workflowName: "", description: "" },
  ruleGroups: [],
  validationErrors: [],
});
```

### 3. **Global State (Redux)**

```tsx
// Test data state
const testData = useAppSelector((state) => state.testData);
const dispatch = useAppDispatch();
```

---

## ✅ Validation System

### 1. **Validation Rules**

```tsx
export const validateWorkflow = (
  workflowData: WorkflowData,
  ruleGroups: RuleGroup[]
) => {
  const errors: string[] = [];

  // Workflow validation
  if (!workflowData.workflowName.trim()) {
    errors.push("Workflow name is required");
  }

  // Rule validation
  ruleGroups.forEach((rule, index) => {
    if (!rule.ruleName.trim()) {
      errors.push(`Rule ${index + 1}: Rule name is required`);
    }
    if (!rule.expression.trim()) {
      errors.push(`Rule ${index + 1}: Expression is required`);
    }
  });

  return { isValid: errors.length === 0, errors };
};
```

### 2. **Real-time Validation**

```tsx
// Validation on every state change
const validateRules = useCallback((): string[] => {
  const result = validateWorkflow(state.workflowData, state.ruleGroups);
  return result.errors;
}, [state.workflowData, state.ruleGroups]);
```

### 3. **UI Validation Feedback**

```tsx
// Validation alert component
<ValidationAlert errors={state.validationErrors} />

// Button state based on validation
<GradientButton
  disabled={!isValidationPassing() || isUpdating}
  onClick={handleSave}
>
  {editMode.isEditMode ? "Update Rule" : "Save to API"}
</GradientButton>
```

---

## 🛠️ Development Guide

### 1. **Adding New Features**

#### Adding a New Rule Type:

```tsx
// 1. Update types
interface RuleGroup {
  id: string;
  ruleName: string;
  expression: string;
  ruleType: "conditional" | "action" | "validation"; // New field
  actionGroups: ActionGroup[];
}

// 2. Update validation
const validateRuleType = (rule: RuleGroup) => {
  if (!rule.ruleType) {
    return "Rule type is required";
  }
};

// 3. Update UI
<Select
  value={ruleGroup.ruleType}
  onChange={(e) => updateRuleGroup(ruleGroup.id, { ruleType: e.target.value })}
>
  <MenuItem value="conditional">Conditional</MenuItem>
  <MenuItem value="action">Action</MenuItem>
  <MenuItem value="validation">Validation</MenuItem>
</Select>;
```

#### Adding New Validation Rules:

```tsx
// In validator.ts
export const validateExpression = (expression: string): string[] => {
  const errors: string[] = [];

  // Check for balanced parentheses
  const openParens = (expression.match(/\(/g) || []).length;
  const closeParens = (expression.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    errors.push("Unbalanced parentheses in expression");
  }

  // Check for valid operators
  const validOperators = ["==", "!=", ">", "<", ">=", "<=", "&&", "||"];
  const operators = expression.match(/(==|!=|>=|<=|>|<|&&|\|\|)/g) || [];
  const invalidOps = operators.filter((op) => !validOperators.includes(op));
  if (invalidOps.length > 0) {
    errors.push(`Invalid operators: ${invalidOps.join(", ")}`);
  }

  return errors;
};
```

### 2. **Performance Optimization**

#### Memoization Strategy:

```tsx
// ✅ Keep useCallback for functions passed to child components
const updateRuleGroup = useCallback((ruleId, updates) => {
  setState((prev) => ({
    ...prev,
    ruleGroups: prev.ruleGroups.map((rule) =>
      rule.id === ruleId ? { ...rule, ...updates } : rule
    ),
  }));
}, []);

// ❌ Remove useCallback for local-only functions
const generateWorkflow = () => {
  return generateWorkflowJSON(state.workflowData, state.ruleGroups);
};
```

#### Component Optimization:

```tsx
// Memoize expensive components
const RuleGroupComponent = React.memo(({ ruleGroup, onUpdate, onDelete }) => {
  return <Card>{/* Component content */}</Card>;
});

// Use React.memo for components that receive stable props
const ValidationAlert = React.memo(({ errors }) => {
  if (errors.length === 0) return null;
  return <Alert severity="error">{errors.join(", ")}</Alert>;
});
```

### 3. **Testing Strategy**

#### Unit Tests:

```tsx
// Test utility functions
describe("validator", () => {
  it("should validate workflow data", () => {
    const workflowData = { workflowName: "Test", description: "Test workflow" };
    const ruleGroups = [
      { id: "1", ruleName: "Rule 1", expression: "x > 5", actionGroups: [] },
    ];

    const result = validateWorkflow(workflowData, ruleGroups);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

// Test hooks
describe("useRuleBuilder", () => {
  it("should add rule group", () => {
    const { result } = renderHook(() => useRuleBuilder());

    act(() => {
      result.current.actions.addRuleGroup();
    });

    expect(result.current.state.ruleGroups).toHaveLength(1);
  });
});
```

#### Integration Tests:

```tsx
// Test component interactions
describe("IntellisenseBuilder", () => {
  it("should save workflow", async () => {
    render(<IntellisenseBuilder />);

    // Fill workflow data
    fireEvent.change(screen.getByLabelText("Workflow Name"), {
      target: { value: "Test Workflow" },
    });

    // Add rule
    fireEvent.click(screen.getByText("Add Rule"));

    // Save
    fireEvent.click(screen.getByText("Save to API"));

    // Verify API call
    await waitFor(() => {
      expect(mockCreateRuleMutation).toHaveBeenCalled();
    });
  });
});
```

### 4. **Error Handling**

#### API Error Handling:

```tsx
const handleSave = async () => {
  try {
    const workflow = actions.generateWorkflow();

    if (editMode.isEditMode && editMode.ruleId) {
      await saveEditedRule(workflow);
    } else {
      await saveWorkflow(workflow);
    }

    // Success feedback
    alert("Workflow saved successfully!");
  } catch (error) {
    console.error("Failed to save workflow:", error);

    // User-friendly error message
    alert("Failed to save workflow. Please try again.");

    // Log error for debugging
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
  }
};
```

#### Validation Error Handling:

```tsx
const ValidationAlert = ({ errors }: { errors: string[] }) => {
  if (errors.length === 0) return null;

  return (
    <Alert severity="error" sx={{ mt: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Please fix the following errors:
      </Typography>
      <ul>
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </Alert>
  );
};
```

---

## 🚀 Getting Started

### 1. **Basic Usage**

```tsx
import IntellisenseBuilder from "./features/intellisenseBuilder/components/IntellisenseBuilder";

function App() {
  return (
    <div>
      <IntellisenseBuilder
        onWorkflowSave={(workflow) => console.log("Saved:", workflow)}
        onWorkflowTest={(workflow) => console.log("Tested:", workflow)}
      />
    </div>
  );
}
```

### 2. **Edit Mode Usage**

```tsx
// Navigate to edit mode
navigate("/intellisense-builder?editRuleId=123");

// Component automatically detects edit mode and loads rule data
```

### 3. **Custom Integration**

```tsx
const CustomRuleBuilder = () => {
  const { state, actions } = useRuleBuilder();
  const { saveWorkflow } = useWorkflowActions();

  const handleCustomSave = async () => {
    const workflow = actions.generateWorkflow();
    // Custom save logic
    await saveWorkflow(workflow);
  };

  return (
    <div>
      {/* Custom UI */}
      <button onClick={handleCustomSave}>Custom Save</button>
    </div>
  );
};
```

---

## 📚 Additional Resources

### Key Files to Study:

1. **`IntellisenseBuilder.tsx`** - Main component architecture
2. **`useRuleBuilder.ts`** - State management patterns
3. **`ruleTransformer.ts`** - Data transformation logic
4. **`validator.ts`** - Validation system
5. **`workflowService.ts`** - API integration patterns

### Best Practices:

1. **Use TypeScript** for type safety
2. **Implement proper error handling** for all API calls
3. **Validate user input** before processing
4. **Use React.memo** for expensive components
5. **Keep hooks focused** on single responsibilities
6. **Test utility functions** thoroughly
7. **Document complex logic** with comments

This guide provides a comprehensive understanding of the Intellisense Builder module. Start with the overview and architecture sections, then dive into specific components based on your needs.
