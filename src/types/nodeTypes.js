// Node types for the rule engine
export const nodeTypes = {
    initial: 'initial',
    rule: 'rule',
    condition: 'condition',
    action: 'action',
    conditionalOperator: 'conditionalOperator',
    resizableGroup: 'resizableGroup' // Resizable group node type
};

// Import node components
import InitialNode from '../components/nodes/InitialNode';
import ConditionNode from '../components/nodes/ConditionNode';
import ActionNode from '../components/nodes/ActionNode';
import ConditionalOperatorNode from '../components/nodes/ConditionalOperatorNode';
import RuleNameNode from '../components/nodes/RuleNameNode';
import ActionNameNode from '../components/nodes/ActionNameNode';
import ResizableGroupNode from '../components/nodes/ResizableGroupNode';

// Export node components for React Flow
export const nodeComponents = {
    initial: InitialNode,
    condition: ConditionNode,
    action: ActionNode,
    conditionalOperator: ConditionalOperatorNode,
    ruleName: RuleNameNode,
    actionName: ActionNameNode,
    resizableGroup: ResizableGroupNode
};

// Expression symbols based on field types
export const expressionSymbols = {
    numeric: [
        { value: '>=', label: 'Greater than or equal' },
        { value: '<=', label: 'Less than or equal' },
        { value: '=', label: 'Equal to' },
        { value: '>', label: 'Greater than' },
        { value: '<', label: 'Less than' },
        { value: '!=', label: 'Not equal to' }
    ],
    integer: [
        { value: '>=', label: 'Greater than or equal' },
        { value: '<=', label: 'Less than or equal' },
        { value: '=', label: 'Equal to' },
        { value: '>', label: 'Greater than' },
        { value: '<', label: 'Less than' },
        { value: '!=', label: 'Not equal to' }
    ],
    varchar: [
        { value: 'contains', label: 'Contains' },
        { value: 'equals', label: 'Equals' },
        { value: 'starts with', label: 'Starts with' },
        { value: 'ends with', label: 'Ends with' },
        { value: '!=', label: 'Not equal to' }
    ],
    date: [
        { value: '>=', label: 'Greater than or equal' },
        { value: '<=', label: 'Less than or equal' },
        { value: '=', label: 'Equal to' },
        { value: '>', label: 'After' },
        { value: '<', label: 'Before' },
        { value: '!=', label: 'Not equal to' }
    ]
};

// Action types
export const actionTypes = [
    { value: 'onSuccess', label: 'On Success' },
    { value: 'onFailure', label: 'On Failure' },
    { value: 'onError', label: 'On Error' },
    { value: 'onComplete', label: 'On Complete' }
];

// Conditional operators
export const conditionalOperators = [
    { value: 'AND', label: 'AND' },
    { value: 'OR', label: 'OR' },
    { value: 'NOT', label: 'NOT' }
];

// Node colors
export const nodeColors = {
    initial: '#3b82f6',      // Blue
    rule: '#8b5cf6',         // Purple
    condition: '#ef4444',    // Red
    action: '#14b8a6',       // Teal
    conditionalOperator: '#f59e0b' // Amber
};