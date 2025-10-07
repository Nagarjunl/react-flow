import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import {
    Box,
    Button,
    Typography,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Paper,
    Modal,
    IconButton,
    Alert,
} from '@mui/material';
import {
    Save as SaveIcon,
    PlayArrow as PlayIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
} from '@mui/icons-material';


// Set axios base URL
axios.defaults.baseURL = 'https://localhost:7013'; // Adjust to your backend URL

// Custom node for flowchart view
const CustomNode = ({ data }) => {
    return (
        <Box sx={{ px: 2, py: 1, boxShadow: 3, borderRadius: 1, bgcolor: 'white', border: '2px solid blue' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{data.label}</Typography>
            <Typography variant="body2">{data.description}</Typography>
        </Box>
    );
};

const nodeTypes = {
    custom: CustomNode,
};

// Rule Builder Component
const CommissionRuleBuilder = () => {
    const [rules, setRules] = useState([]);
    const [currentRule, setCurrentRule] = useState({
        id: null,
        name: '',
        description: '',
        conditions: [{ field: '', operator: '', value: '', logicalOperator: 'AND' }],
        actions: [{ type: 'percentage', value: 0 }],
        priority: 1,
        active: true,
    });
    const [testData, setTestData] = useState({
        Sales: 5000,
        Region: 'USA',
        Store: 'USA Store',
        UserType: 'common',
    });
    const [testResult, setTestResult] = useState(null);
    const [selectedRuleForFlow, setSelectedRuleForFlow] = useState(null);
    const [countries, setCountries] = useState([]);
    const [stores, setStores] = useState([]);
    const [userTypes, setUserTypes] = useState([]);

    // Available fields for rule conditions (aligned with backend data)
    const availableFields = [
        { value: 'Sales', label: 'Sales Amount', type: 'number' },
        { value: 'Region', label: 'Region', type: 'select', options: countries.map(c => c.name) },
        { value: 'Store', label: 'Store Name', type: 'select', options: stores.map(s => s.name) },
        { value: 'UserType', label: 'User Type', type: 'select', options: userTypes },
    ];

    // Available operators
    const operators = {
        number: [
            { value: '>', label: 'Greater than' },
            { value: '>=', label: 'Greater than or equal' },
            { value: '<', label: 'Less than' },
            { value: '<=', label: 'Less than or equal' },
            { value: '==', label: 'Equal to' },
            { value: '!=', label: 'Not equal to' },
        ],
        select: [
            { value: '==', label: 'Equal to' },
            { value: '!=', label: 'Not equal to' },
            { value: 'in', label: 'In list' },
            { value: 'not_in', label: 'Not in list' },
        ],
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [countriesRes, storesRes, usersRes] = await Promise.all([
                    axios.get('/api/entities/countries'),
                    axios.get('/api/entities/stores'),
                    axios.get('/api/entities/users'),
                ]);
                setCountries(countriesRes.data);
                setStores(storesRes.data);
                const typesSet = new Set(usersRes.data.map(u => u.ruleType).filter(Boolean));
                setUserTypes([...typesSet]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchRules();
        fetchData();
    }, []);

    const fetchRules = async () => {
        try {
            const res = await axios.get('/api/entities/rules');
            setRules(res.data);
        } catch (error) {
            console.error('Error fetching rules:', error);
        }
    };

    // Add new condition
    const addCondition = () => {
        setCurrentRule((prev) => ({
            ...prev,
            conditions: [...prev.conditions, { field: '', operator: '', value: '', logicalOperator: 'AND' }],
        }));
    };

    // Remove condition
    const removeCondition = (index) => {
        setCurrentRule((prev) => ({
            ...prev,
            conditions: prev.conditions.filter((_, i) => i !== index),
        }));
    };

    // Update condition
    const updateCondition = (index, field, value) => {
        setCurrentRule((prev) => ({
            ...prev,
            conditions: prev.conditions.map((condition, i) =>
                i === index ? { ...condition, [field]: value } : condition
            ),
        }));
    };

    // Add new action
    const addAction = () => {
        setCurrentRule((prev) => ({
            ...prev,
            actions: [...prev.actions, { type: 'percentage', value: 0 }],
        }));
    };

    // Remove action
    const removeAction = (index) => {
        setCurrentRule((prev) => ({
            ...prev,
            actions: prev.actions.filter((_, i) => i !== index),
        }));
    };

    // Update action
    const updateAction = (index, field, value) => {
        setCurrentRule((prev) => ({
            ...prev,
            actions: prev.actions.map((action, i) =>
                i === index ? { ...action, [field]: value } : action
            ),
        }));
    };

    // Save rule to backend
    const saveRule = async () => {
        if (!currentRule.name || currentRule.conditions.length === 0) {
            alert('Please provide a rule name and at least one condition');
            return;
        }

        const jsonRule = generateJsonRule(currentRule);
        const ruleToSave = {
            name: currentRule.name,
            description: currentRule.description,
            ruleJson: JSON.stringify(jsonRule),
            priority: currentRule.priority,
            isActive: currentRule.active,
            userId: null, // Assuming global rules; adjust if per-user
        };

        try {
            if (currentRule.id) {
                await axios.put(`/api/entities/rules/${currentRule.id}`, { ...ruleToSave, id: currentRule.id });
            } else {
                const res = await axios.post('/api/entities/rules', ruleToSave);
                // Update local id
                setCurrentRule((prev) => ({ ...prev, id: res.data.id }));
            }
            fetchRules();

            // Reset form
            setCurrentRule({
                id: null,
                name: '',
                description: '',
                conditions: [{ field: '', operator: '', value: '', logicalOperator: 'AND' }],
                actions: [{ type: 'percentage', value: 0 }],
                priority: 1,
                active: true,
            });
        } catch (error) {
            console.error('Error saving rule:', error);
            alert('Failed to save rule');
        }
    };

    // Generate JSON rule compatible with C# RulesEngine
    const generateJsonRule = (rule) => {
        const conditions = rule.conditions
            .filter((c) => c.field && c.operator && c.value !== '')
            .map((condition, index) => {
                const field = availableFields.find((f) => f.value === condition.field);
                let expression;

                if (field?.type === 'number') {
                    expression = `input.${condition.field} ${condition.operator} ${condition.value}`;
                } else {
                    expression =
                        condition.operator === 'in'
                            ? `new[] {"${condition.value.split(',').join('","')}"}.Contains(input.${condition.field})`
                            : condition.operator === 'not_in'
                                ? `!new[] {"${condition.value.split(',').join('","')}"}.Contains(input.${condition.field})`
                                : `input.${condition.field} ${condition.operator === '==' ? '==' : '!='} "${condition.value}"`;
                }

                return index === 0 ? expression : ` ${condition.logicalOperator} ${expression}`;
            })
            .join('');

        const actionExpressions = rule.actions.map((action) => {
            switch (action.type) {
                case 'percentage':
                    return `input.Sales * ${action.value / 100}`;
                case 'fixed':
                    return action.value.toString();
                case 'formula':
                    return action.value;
                default:
                    return '0';
            }
        });

        const outputExpression = actionExpressions.join(' + ') || '0';

        return {
            WorkflowName: 'CommissionWorkflow',
            Rules: [
                {
                    RuleName: rule.name,
                    Expression: conditions || 'true',
                    Priority: rule.priority,
                    Enabled: rule.active,
                    Actions: {
                        OnSuccess: {
                            Name: 'OutputExpression',
                            Context: {
                                Expression: outputExpression
                            }
                        }
                    }
                }
            ]
        };
    };

    // Test rule (local simulation; could be extended to call backend if endpoint added)
    const testRule = () => {
        const ruleJson = generateJsonRule(currentRule);
        const rule = ruleJson.Rules[0];

        try {
            const result = evaluateRule(rule, testData);
            setTestResult(result);
        } catch (error) {
            setTestResult({ error: error.message });
        }
    };

    // Simple rule evaluation for testing (simulation of backend logic)
    const evaluateRule = (rule, data) => {
        try {
            const expression = rule.Expression.replace(/input\./g, 'data.');
            const condResult = eval(`(function(data) { return ${expression}; })(data)`);

            if (condResult) {
                const outputExp = rule.Actions.OnSuccess.Context.Expression.replace(/input\./g, 'data.');
                const output = eval(`(function(data) { return ${outputExp}; })(data)`);
                return { success: true, commission: output, ruleName: rule.RuleName };
            }
            return { success: false, commission: 0, ruleName: rule.RuleName };
        } catch (error) {
            return { error: error.message };
        }
    };

    // Edit existing rule
    const editRule = (rule) => {
        setCurrentRule({
            id: rule.id,
            name: rule.name,
            description: rule.description || '',
            // Note: Conditions and actions are not stored in backend RulesEntity;
            // you'd need to parse them from RuleJson if you want to edit visually.
            // For simplicity, resetting to default when editing - extend parsing if needed.
            conditions: [{ field: '', operator: '', value: '', logicalOperator: 'AND' }],
            actions: [{ type: 'percentage', value: 0 }],
            priority: rule.priority,
            active: rule.isActive,
        });
        // TODO: Parse RuleJson to populate conditions/actions for full editability
    };

    // Delete rule
    const deleteRule = async (id) => {
        try {
            await axios.delete(`/api/entities/rules/${id}`);
            fetchRules();
        } catch (error) {
            console.error('Error deleting rule:', error);
        }
    };

    // Generate flowchart nodes and edges for a rule
    const getFlowElements = (rule) => {
        const nodes = [
            { id: 'start', type: 'input', data: { label: 'Start' }, position: { x: 250, y: 0 } },
        ];
        const edges = [];

        // Add condition nodes
        rule.conditions.forEach((cond, index) => {
            const nodeId = `cond-${index}`;
            nodes.push({
                id: nodeId,
                type: 'custom',
                data: { label: 'Condition', description: `${cond.field} ${cond.operator} ${cond.value}` },
                position: { x: 250, y: 100 + index * 100 },
            });
            edges.push({
                id: `e-start-${nodeId}`,
                source: index === 0 ? 'start' : `cond-${index - 1}`,
                target: nodeId,
                label: cond.logicalOperator,
            });
        });

        // Add action nodes
        rule.actions.forEach((act, index) => {
            const nodeId = `act-${index}`;
            nodes.push({
                id: nodeId,
                type: 'custom',
                data: { label: 'Action', description: `${act.type}: ${act.value}` },
                position: { x: 250, y: 100 + rule.conditions.length * 100 + index * 100 },
            });
            edges.push({
                id: `e-cond-act-${nodeId}`,
                source: index === 0 ? `cond-${rule.conditions.length - 1}` : `act-${index - 1}`,
                target: nodeId,
            });
        });

        // End node
        const endY = 100 + rule.conditions.length * 100 + rule.actions.length * 100;
        nodes.push({ id: 'end', type: 'output', data: { label: 'End' }, position: { x: 250, y: endY } });
        edges.push({ id: 'e-end', source: `act-${rule.actions.length - 1}`, target: 'end' });

        return { nodes, edges };
    };

    const viewFlow = (rule) => {
        setSelectedRuleForFlow(rule);
    };

    return (
        <>
            sdksfdkjslj
            <Box sx={{ maxWidth: '6xl', mx: 'auto', p: 3, bgcolor: 'grey.100', minHeight: '100vh' }}>
                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Commission Rule Builder
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                        Create and manage dynamic commission rules connected to backend
                    </Typography>

                    <Grid container spacing={3}>
                        {/* Rule Builder Form */}
                        <Grid item xs={12} lg={6}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <TextField
                                    label="Rule Name *"
                                    value={currentRule.name}
                                    onChange={(e) => setCurrentRule((prev) => ({ ...prev, name: e.target.value }))}
                                    fullWidth
                                    variant="outlined"
                                />

                                <TextField
                                    label="Description"
                                    value={currentRule.description}
                                    onChange={(e) => setCurrentRule((prev) => ({ ...prev, description: e.target.value }))}
                                    fullWidth
                                    variant="outlined"
                                    multiline
                                    rows={2}
                                />

                                {/* Conditions */}
                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="subtitle1">Conditions *</Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={addCondition}
                                            startIcon={<AddIcon />}
                                            size="small"
                                        >
                                            Add Condition
                                        </Button>
                                    </Box>

                                    {currentRule.conditions.map((condition, index) => (
                                        <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
                                            {index > 0 && (
                                                <FormControl fullWidth sx={{ mb: 2 }}>
                                                    <InputLabel>Logical Operator</InputLabel>
                                                    <Select
                                                        value={condition.logicalOperator}
                                                        onChange={(e) => updateCondition(index, 'logicalOperator', e.target.value)}
                                                        label="Logical Operator"
                                                    >
                                                        <MenuItem value="AND">AND</MenuItem>
                                                        <MenuItem value="OR">OR</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            )}

                                            <Grid container spacing={2} sx={{ mb: 1 }}>
                                                <Grid item xs={4}>
                                                    <FormControl fullWidth>
                                                        <InputLabel>Field</InputLabel>
                                                        <Select
                                                            value={condition.field}
                                                            onChange={(e) => updateCondition(index, 'field', e.target.value)}
                                                            label="Field"
                                                        >
                                                            <MenuItem value="">Select Field</MenuItem>
                                                            {availableFields.map((field) => (
                                                                <MenuItem key={field.value} value={field.value}>
                                                                    {field.label}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={4}>
                                                    <FormControl fullWidth>
                                                        <InputLabel>Operator</InputLabel>
                                                        <Select
                                                            value={condition.operator}
                                                            onChange={(e) => updateCondition(index, 'operator', e.target.value)}
                                                            label="Operator"
                                                            disabled={!condition.field}
                                                        >
                                                            <MenuItem value="">Select Operator</MenuItem>
                                                            {condition.field &&
                                                                operators[availableFields.find((f) => f.value === condition.field)?.type]?.map((op) => (
                                                                    <MenuItem key={op.value} value={op.value}>
                                                                        {op.label}
                                                                    </MenuItem>
                                                                ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={4}>
                                                    {condition.field &&
                                                        availableFields.find((f) => f.value === condition.field)?.type === 'select' ? (
                                                        <FormControl fullWidth>
                                                            <InputLabel>Value</InputLabel>
                                                            <Select
                                                                value={condition.value}
                                                                onChange={(e) => updateCondition(index, 'value', e.target.value)}
                                                                label="Value"
                                                            >
                                                                <MenuItem value="">Select Value</MenuItem>
                                                                {availableFields
                                                                    .find((f) => f.value === condition.field)
                                                                    ?.options?.map((option) => (
                                                                        <MenuItem key={option} value={option}>
                                                                            {option}
                                                                        </MenuItem>
                                                                    ))}
                                                            </Select>
                                                        </FormControl>
                                                    ) : (
                                                        <TextField
                                                            label="Value"
                                                            type={
                                                                availableFields.find((f) => f.value === condition.field)?.type === 'number'
                                                                    ? 'number'
                                                                    : 'text'
                                                            }
                                                            value={condition.value}
                                                            onChange={(e) => updateCondition(index, 'value', e.target.value)}
                                                            fullWidth
                                                            variant="outlined"
                                                        />
                                                    )}
                                                </Grid>
                                            </Grid>

                                            {currentRule.conditions.length > 1 && (
                                                <Button
                                                    color="error"
                                                    startIcon={<DeleteIcon />}
                                                    onClick={() => removeCondition(index)}
                                                    size="small"
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </Paper>
                                    ))}
                                </Box>

                                {/* Actions */}
                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="subtitle1">Commission Actions *</Typography>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={addAction}
                                            startIcon={<AddIcon />}
                                            size="small"
                                        >
                                            Add Action
                                        </Button>
                                    </Box>

                                    {currentRule.actions.map((action, index) => (
                                        <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
                                            <Grid container spacing={2} sx={{ mb: 1 }}>
                                                <Grid item xs={6}>
                                                    <FormControl fullWidth>
                                                        <InputLabel>Type</InputLabel>
                                                        <Select
                                                            value={action.type}
                                                            onChange={(e) => updateAction(index, 'type', e.target.value)}
                                                            label="Type"
                                                        >
                                                            <MenuItem value="percentage">Percentage of Sales</MenuItem>
                                                            <MenuItem value="fixed">Fixed Amount</MenuItem>
                                                            <MenuItem value="formula">Custom Formula</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={6}>
                                                    {action.type === 'formula' ? (
                                                        <TextField
                                                            label="Formula"
                                                            value={action.value}
                                                            onChange={(e) => updateAction(index, 'value', e.target.value)}
                                                            fullWidth
                                                            variant="outlined"
                                                        />
                                                    ) : (
                                                        <TextField
                                                            label={action.type === 'percentage' ? 'Percentage' : 'Amount'}
                                                            type="number"
                                                            step="0.01"
                                                            value={action.value}
                                                            onChange={(e) => updateAction(index, 'value', parseFloat(e.target.value))}
                                                            fullWidth
                                                            variant="outlined"
                                                        />
                                                    )}
                                                </Grid>
                                            </Grid>

                                            {currentRule.actions.length > 1 && (
                                                <Button
                                                    color="error"
                                                    startIcon={<DeleteIcon />}
                                                    onClick={() => removeAction(index)}
                                                    size="small"
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </Paper>
                                    ))}
                                </Box>

                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Priority"
                                            type="number"
                                            value={currentRule.priority}
                                            onChange={(e) => setCurrentRule((prev) => ({ ...prev, priority: parseInt(e.target.value) }))}
                                            fullWidth
                                            variant="outlined"
                                        />
                                    </Grid>

                                    <Grid item xs={6}>
                                        <FormControl fullWidth>
                                            <InputLabel>Status</InputLabel>
                                            <Select
                                                value={currentRule.active}
                                                onChange={(e) => setCurrentRule((prev) => ({ ...prev, active: e.target.value === 'true' }))}
                                                label="Status"
                                            >
                                                <MenuItem value="true">Active</MenuItem>
                                                <MenuItem value="false">Inactive</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>

                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={saveRule}
                                        startIcon={<SaveIcon />}
                                    >
                                        Save Rule
                                    </Button>

                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={testRule}
                                        startIcon={<PlayIcon />}
                                    >
                                        Test Rule
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Test Panel & Results */}
                        <Grid item xs={12} lg={6}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                {/* Test Data */}
                                <Paper variant="outlined" sx={{ p: 2 }}>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        Test Data
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {Object.entries(testData).map(([key, value]) => (
                                            <Grid item xs={6} key={key}>
                                                <TextField
                                                    label={key}
                                                    type={typeof value === 'number' ? 'number' : 'text'}
                                                    value={value}
                                                    onChange={(e) =>
                                                        setTestData((prev) => ({
                                                            ...prev,
                                                            [key]:
                                                                typeof value === 'number' ? parseFloat(e.target.value) || 0 : e.target.value,
                                                        }))
                                                    }
                                                    fullWidth
                                                    variant="outlined"
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Paper>

                                {/* Test Result */}
                                {testResult && (
                                    <Alert
                                        severity={testResult.error ? 'error' : testResult.success ? 'success' : 'warning'}
                                        sx={{ p: 2 }}
                                    >
                                        <Typography variant="h6" sx={{ mb: 1 }}>
                                            Test Result
                                        </Typography>
                                        {testResult.error ? (
                                            <Typography>Error: {testResult.error}</Typography>
                                        ) : (
                                            <>
                                                <Typography>
                                                    Rule: {testResult.success ? 'Matched' : 'Not Matched'}
                                                </Typography>
                                                <Typography>Commission: ${testResult.commission?.toFixed(2) || '0.00'}</Typography>
                                            </>
                                        )}
                                    </Alert>
                                )}

                                {/* JSON Preview */}
                                <Paper variant="outlined" sx={{ p: 2 }}>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        Generated JSON Rule
                                    </Typography>
                                    <Box component="pre" sx={{ fontSize: '0.75rem', bgcolor: 'white', p: 2, borderRadius: 1, border: 1, overflowX: 'auto' }}>
                                        {JSON.stringify(generateJsonRule(currentRule), null, 2)}
                                    </Box>
                                </Paper>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Saved Rules List */}
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Saved Rules ({rules.length})
                    </Typography>

                    {rules.length === 0 ? (
                        <Typography sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
                            No rules created yet. Create your first commission rule above!
                        </Typography>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {rules.map((rule) => (
                                <Paper key={rule.id} variant="outlined" sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                {rule.name}
                                            </Typography>
                                            <Box
                                                component="span"
                                                sx={{
                                                    px: 1,
                                                    py: 0.5,
                                                    borderRadius: 1,
                                                    fontSize: '0.75rem',
                                                    bgcolor: rule.isActive ? 'success.light' : 'grey.200',
                                                    color: rule.isActive ? 'success.dark' : 'grey.600',
                                                }}
                                            >
                                                {rule.isActive ? 'Active' : 'Inactive'}
                                            </Box>
                                            <Box
                                                component="span"
                                                sx={{
                                                    px: 1,
                                                    py: 0.5,
                                                    borderRadius: 1,
                                                    fontSize: '0.75rem',
                                                    bgcolor: 'info.light',
                                                    color: 'info.dark',
                                                }}
                                            >
                                                Priority: {rule.priority}
                                            </Box>
                                        </Box>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            {rule.description}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <IconButton color="primary" onClick={() => editRule(rule)} title="Edit Rule">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => deleteRule(rule.id)} title="Delete Rule">
                                            <DeleteIcon />
                                        </IconButton>
                                        <IconButton color="secondary" onClick={() => viewFlow(currentRule.id === rule.id ? currentRule : rule)} title="View Flowchart">
                                            <PlayIcon />
                                        </IconButton>
                                    </Box>
                                </Paper>
                            ))}
                        </Box>
                    )}
                </Paper>

                {/* Flowchart Modal/View */}
                <Modal
                    open={!!selectedRuleForFlow}
                    onClose={() => setSelectedRuleForFlow(null)}
                    aria-labelledby="flowchart-modal"
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'background.paper',
                            p: 2,
                            borderRadius: 1,
                            width: '75%',
                            height: '75%',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Flowchart for {selectedRuleForFlow?.name}
                        </Typography>
                        <Box sx={{ flex: 1 }}>
                            <ReactFlow
                                nodes={selectedRuleForFlow ? getFlowElements(selectedRuleForFlow).nodes : []}
                                edges={selectedRuleForFlow ? getFlowElements(selectedRuleForFlow).edges : []}
                                nodeTypes={nodeTypes}
                                fitView
                            >
                                <Background />
                                <Controls />
                            </ReactFlow>
                        </Box>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => setSelectedRuleForFlow(null)}
                            sx={{ mt: 2 }}
                        >
                            Close
                        </Button>
                    </Box>
                </Modal>
            </Box>
        </>
    );
};

export default CommissionRuleBuilder;
