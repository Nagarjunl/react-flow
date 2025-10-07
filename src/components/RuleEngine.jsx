import { useState, useCallback, useEffect } from 'react';
import { apiService, availableFields, operators } from '../services/apiService';

export default function RuleEngine({ nodes, edges, onRuleGenerated }) {
    const [ruleResult, setRuleResult] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [savedRules, setSavedRules] = useState([]);
    const [testData, setTestData] = useState({
        Sales: 5000,
        Region: 'USA',
        Store: 'USA Store',
        UserType: 'common',
        TargetAchievement: 120,
        AttendancePercentage: 95,
        StoreKpiAchievement: 90,
        PresentDays: 25,
        AbsentDays: 0,
        ApprovedLeaveDays: 0,
        TotalWorkingDays: 30,
        NumberOfMcUplDays: 2,
        StoreTargetAchievement: 100,
        Designation: 'Manager',
        Name: 'John Doe',
        Amount: 10000,
        Quantity: 5,
        Date: '2024-01-15'
    });
    const [testResult, setTestResult] = useState(null);
    const [showTestPanel, setShowTestPanel] = useState(false);
    const [showRuleManagement, setShowRuleManagement] = useState(false);
    const [selectedRule, setSelectedRule] = useState(null);
    const [countries, setCountries] = useState([]);
    const [stores, setStores] = useState([]);
    const [userTypes, setUserTypes] = useState([]);


    const getWorkflowName = useCallback((ruleType) => {
        switch (ruleType) {
            case 'commission':
                return 'CommissionCalculation';
            case 'bonus':
                return 'BonusCalculation';
            case 'incentive':
                return 'IncentiveCalculation';
            case 'penalty':
                return 'PenaltyCalculation';
            default:
                return 'CommissionCalculation';
        }
    }, []);

    // Data fetching
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [countriesData, storesData, usersData] = await Promise.all([
                    apiService.getCountries(),
                    apiService.getStores(),
                    apiService.getUsers()
                ]);
                setCountries(countriesData);
                setStores(storesData);
                const typesSet = new Set(usersData.map(u => u.ruleType).filter(Boolean));
                setUserTypes([...typesSet]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
        fetchSavedRules();
    }, []);

    // Fetch saved rules
    const fetchSavedRules = async () => {
        try {
            const rules = await apiService.getRules();
            setSavedRules(rules);
        } catch (error) {
            console.error('Error fetching saved rules:', error);
        }
    };

    // Save rule to backend
    const saveRuleToBackend = async (ruleData) => {
        try {
            const ruleToSave = {
                name: ruleData.RuleName,
                description: `Generated from visual flow - ${ruleData.RuleName}`,
                ruleJson: JSON.stringify(ruleData),
                priority: 1,
                isActive: true,
                userId: null
            };

            await apiService.createRule(ruleToSave);
            fetchSavedRules();
            return true;
        } catch (error) {
            console.error('Error saving rule:', error);
            return false;
        }
    };

    // Test rule with current test data
    const testRule = async (ruleData) => {
        try {
            const result = await apiService.testRule(ruleData, testData);
            setTestResult(result);
            return result;
        } catch (error) {
            console.error('Error testing rule:', error);
            setTestResult({ error: error.message });
            return { error: error.message };
        }
    };

    // Delete saved rule
    const deleteRule = async (id) => {
        try {
            await apiService.deleteRule(id);
            fetchSavedRules();
            return true;
        } catch (error) {
            console.error('Error deleting rule:', error);
            return false;
        }
    };

    const extractNumber = useCallback((str) => {
        const match = str.match(/\d+(\.\d+)?/);
        return match ? match[0] : null;
    }, []);

    const generateProperties = useCallback((actionNode, type) => {
        const expression = actionNode.data.expression || '';

        switch (type) {
            case 'commission':
                if (expression.includes('percentage') || expression.includes('%')) {
                    return {
                        CommissionType: 'percentage',
                        Percentage: extractNumber(expression) || '5',
                        MinAmount: '500',
                        MaxAmount: '10000'
                    };
                } else if (expression.includes('fixed') || expression.includes('amount')) {
                    return {
                        CommissionType: 'fixed',
                        CommissionAmount: extractNumber(expression) || '1000'
                    };
                } else if (expression.includes('tiered')) {
                    return {
                        CommissionType: 'tiered',
                        Tiers: '[{"MinAmount":0,"MaxAmount":50000,"Percentage":2},{"MinAmount":50000,"MaxAmount":100000,"Percentage":3.5},{"MinAmount":100000,"MaxAmount":200000,"Percentage":5},{"MinAmount":200000,"MaxAmount":999999999,"Percentage":7}]'
                    };
                } else if (expression.includes('target_based')) {
                    return {
                        CommissionType: 'target_based',
                        BasePercentage: '4',
                        BonusPercentage: '2'
                    };
                } else if (expression.includes('kpi_based')) {
                    return {
                        CommissionType: 'kpi_based',
                        BaseAmount: '3000',
                        KpiMultiplier: '1.5'
                    };
                } else if (expression.includes('attendance_based')) {
                    return {
                        CommissionType: 'attendance_based',
                        BaseCommission: '2000',
                        AttendanceMultiplier: '1.2'
                    };
                } else {
                    return {
                        CommissionType: 'percentage',
                        Percentage: '5',
                        MinAmount: '500',
                        MaxAmount: '10000'
                    };
                }
            case 'bonus':
                return {
                    CommissionType: 'fixed',
                    CommissionAmount: extractNumber(expression) || '5000'
                };
            case 'incentive':
                return {
                    CommissionType: 'fixed',
                    CommissionAmount: extractNumber(expression) || '2000'
                };
            case 'penalty':
                return {
                    CommissionType: 'fixed',
                    CommissionAmount: `-${extractNumber(expression) || '500'}`
                };
            default:
                return {
                    CommissionType: 'fixed',
                    CommissionAmount: '0'
                };
        }
    }, [extractNumber]);



    const processRules = () => {
        setIsProcessing(true);

        try {
            // Group nodes by type
            const tableNodes = nodes.filter(node => node.type === 'table');
            const conditionNodes = nodes.filter(node => node.type === 'condition');
            const actionNodes = nodes.filter(node => node.type === 'action');

            // Create workflows structure
            const workflows = [];

            // Group rules by workflow - create multiple workflows based on rule types
            const workflowGroups = {
                'CommissionCalculation': [],
                'BonusCalculation': [],
                'IncentiveCalculation': [],
                'PenaltyCalculation': []
            };

            // Process each action node and its connected conditions
            actionNodes.forEach((actionNode, index) => {
                const connectedEdges = edges.filter(edge =>
                    edge.target === actionNode.id || edge.source === actionNode.id
                );

                // Find connected condition nodes
                const connectedConditionIds = connectedEdges
                    .filter(edge => edge.source !== actionNode.id)
                    .map(edge => edge.source);

                const connectedConditions = conditionNodes.filter(conditionNode =>
                    connectedConditionIds.includes(conditionNode.id)
                );

                // Build expression from conditions
                const expressionParts = connectedConditions.map(conditionNode => {
                    if (conditionNode.data.selectedTable && conditionNode.data.selectedField && conditionNode.data.value) {
                        const table = conditionNode.data.selectedTable;
                        const field = conditionNode.data.selectedField;
                        const operator = conditionNode.data.operator;
                        const value = conditionNode.data.value;

                        // Convert to target format: metrics.FieldName
                        const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
                        return `${table}.${fieldName} ${operator} ${value}`;
                    }
                    return null;
                }).filter(Boolean);

                const expression = expressionParts.join(' AND ');

                // Get rule configuration from ActionNode data
                const nodeRuleName = actionNode.data.ruleName || `Rule_${index + 1}`;
                const nodeSuccessEvent = actionNode.data.successEvent || `${nodeRuleName} Applied`;
                const nodeErrorMessage = actionNode.data.errorMessage || `${nodeRuleName} criteria not met`;
                const nodeRuleType = actionNode.data.ruleType || 'commission';
                const nodeWorkflowName = actionNode.data.workflowName || getWorkflowName(nodeRuleType);

                // Create Properties object based on action data
                const ruleProperties = generateProperties(actionNode, nodeRuleType);

                // Create rule in target format
                const rule = {
                    RuleName: nodeRuleName,
                    SuccessEvent: nodeSuccessEvent,
                    ErrorMessage: nodeErrorMessage,
                    Expression: expression || 'true', // Default expression if no conditions
                    RuleExpressionType: 'LambdaExpression',
                    Properties: ruleProperties
                };

                // Add rule to appropriate workflow group
                workflowGroups[nodeWorkflowName].push(rule);
            });

            // Create workflows for each group that has rules
            Object.entries(workflowGroups).forEach(([workflowName, rules]) => {
                if (rules.length > 0) {
                    workflows.push({
                        WorkflowName: workflowName,
                        Rules: rules
                    });
                }
            });

            // Create the final result in target format
            const totalRules = Object.values(workflowGroups).reduce((sum, rules) => sum + rules.length, 0);
            const result = {
                workflows: workflows,
                metadata: {
                    generatedAt: new Date().toISOString(),
                    totalWorkflows: workflows.length,
                    totalRules: totalRules,
                    totalConditions: conditionNodes.length,
                    totalActions: actionNodes.length,
                    totalTables: tableNodes.length
                }
            };

            setRuleResult(result);
            onRuleGenerated && onRuleGenerated(result);

            // Auto-test the first rule if available
            if (workflows.length > 0 && workflows[0].Rules.length > 0) {
                const firstRule = workflows[0].Rules[0];
                testRule({
                    WorkflowName: workflows[0].WorkflowName,
                    Rules: [firstRule]
                });
            }

        } catch (error) {
            console.error('Error processing rules:', error);
            setRuleResult({
                error: 'Failed to process',
                details: error.message
            });
        } finally {
            setIsProcessing(false);
        }
    };


    // Removed automatic processRules call to prevent infinite loop
    // Users will manually trigger rule generation via the button

    return (
        <div style={{ marginTop: '10px' }}>
            {/* Header with Action Buttons */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px',
                padding: '10px',
                background: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #dee2e6'
            }}>
                <div>
                    <h3 style={{ margin: '0 0 5px 0', color: '#495057' }}>
                        🚀 Unified Rule Engine
                    </h3>
                    <p style={{ margin: 0, fontSize: '12px', color: '#6c757d' }}>
                        Visual flow editor + Backend integration + Rule testing
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => setShowTestPanel(!showTestPanel)}
                        style={{
                            padding: '8px 16px',
                            background: showTestPanel ? '#28a745' : '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                        }}
                    >
                        {showTestPanel ? 'Hide' : 'Show'} Test Panel
                    </button>
                    <button
                        onClick={() => setShowRuleManagement(!showRuleManagement)}
                        style={{
                            padding: '8px 16px',
                            background: showRuleManagement ? '#007bff' : '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                        }}
                    >
                        {showRuleManagement ? 'Hide' : 'Show'} Rule Management
                    </button>
                </div>
            </div>

            {/* Main Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <button
                    onClick={processRules}
                    disabled={isProcessing}
                    style={{
                        padding: '12px 24px',
                        background: isProcessing ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: isProcessing ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    }}
                >
                    {isProcessing ? '⏳ Processing...' : '🎯 Generate & Test Rules'}
                </button>

                {ruleResult && ruleResult.workflows && ruleResult.workflows.length > 0 && (
                    <button
                        onClick={() => saveRuleToBackend(ruleResult.workflows[0])}
                        style={{
                            padding: '12px 24px',
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold'
                        }}
                    >
                        💾 Save to Backend
                    </button>
                )}
            </div>

            {/* Test Panel */}
            {showTestPanel && (
                <div style={{
                    background: '#fff3cd',
                    border: '1px solid #ffeaa7',
                    borderRadius: '8px',
                    padding: '15px',
                    marginBottom: '15px'
                }}>
                    <h4 style={{ margin: '0 0 15px 0', color: '#856404' }}>
                        🧪 Rule Testing Panel
                    </h4>

                    {/* Test Data Input */}
                    <div style={{ marginBottom: '15px' }}>
                        <h5 style={{ margin: '0 0 10px 0', color: '#856404' }}>Test Data:</h5>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                            {Object.entries(testData).map(([key, value]) => (
                                <div key={key}>
                                    <label style={{ display: 'block', fontSize: '11px', color: '#856404', marginBottom: '2px' }}>
                                        {key}:
                                    </label>
                                    <input
                                        type={typeof value === 'number' ? 'number' : 'text'}
                                        value={value}
                                        onChange={(e) => setTestData(prev => ({
                                            ...prev,
                                            [key]: typeof value === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
                                        }))}
                                        style={{
                                            width: '100%',
                                            padding: '6px',
                                            border: '1px solid #ffeaa7',
                                            borderRadius: '4px',
                                            fontSize: '12px'
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Test Result */}
                    {testResult && (
                        <div style={{
                            background: testResult.error ? '#f8d7da' : testResult.success ? '#d4edda' : '#fff3cd',
                            border: `1px solid ${testResult.error ? '#f5c6cb' : testResult.success ? '#c3e6cb' : '#ffeaa7'}`,
                            borderRadius: '4px',
                            padding: '10px',
                            marginBottom: '10px'
                        }}>
                            <h5 style={{ margin: '0 0 5px 0', color: testResult.error ? '#721c24' : testResult.success ? '#155724' : '#856404' }}>
                                Test Result:
                            </h5>
                            {testResult.error ? (
                                <p style={{ margin: 0, fontSize: '12px', color: '#721c24' }}>
                                    ❌ Error: {testResult.error}
                                </p>
                            ) : (
                                <div style={{ fontSize: '12px', color: testResult.success ? '#155724' : '#856404' }}>
                                    <p style={{ margin: '0 0 5px 0' }}>
                                        {testResult.success ? '✅ Rule Matched' : '❌ Rule Not Matched'}
                                    </p>
                                    <p style={{ margin: 0 }}>
                                        💰 Commission: ${testResult.commission?.toFixed(2) || '0.00'}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Rule Management Panel */}
            {showRuleManagement && (
                <div style={{
                    background: '#e7f3ff',
                    border: '1px solid #b3d9ff',
                    borderRadius: '8px',
                    padding: '15px',
                    marginBottom: '15px'
                }}>
                    <h4 style={{ margin: '0 0 15px 0', color: '#004085' }}>
                        📚 Saved Rules ({savedRules.length})
                    </h4>

                    {savedRules.length === 0 ? (
                        <p style={{ margin: 0, color: '#6c757d', textAlign: 'center', padding: '20px' }}>
                            No saved rules yet. Generate and save your first rule!
                        </p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {savedRules.map((rule) => (
                                <div key={rule.id} style={{
                                    background: 'white',
                                    border: '1px solid #dee2e6',
                                    borderRadius: '6px',
                                    padding: '12px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                            <strong style={{ color: '#495057' }}>{rule.name}</strong>
                                            <span style={{
                                                padding: '2px 6px',
                                                borderRadius: '3px',
                                                fontSize: '10px',
                                                background: rule.isActive ? '#d4edda' : '#f8d7da',
                                                color: rule.isActive ? '#155724' : '#721c24'
                                            }}>
                                                {rule.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                            <span style={{
                                                padding: '2px 6px',
                                                borderRadius: '3px',
                                                fontSize: '10px',
                                                background: '#cce7ff',
                                                color: '#004085'
                                            }}>
                                                Priority: {rule.priority}
                                            </span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '11px', color: '#6c757d' }}>
                                            {rule.description}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <button
                                            onClick={() => deleteRule(rule.id)}
                                            style={{
                                                padding: '4px 8px',
                                                background: '#dc3545',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '3px',
                                                cursor: 'pointer',
                                                fontSize: '10px'
                                            }}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Generated JSON Result */}
            {ruleResult && (
                <div style={{
                    background: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '15px',
                    marginTop: '15px'
                }}>
                    <h4 style={{ margin: '0 0 15px 0', color: '#495057' }}>
                        📄 Generated JSON (Target Format)
                    </h4>
                    <div style={{
                        background: '#fff',
                        border: '1px solid #dee2e6',
                        borderRadius: '4px',
                        padding: '15px',
                        maxHeight: '400px',
                        overflow: 'auto'
                    }}>
                        <pre style={{
                            margin: 0,
                            fontSize: '12px',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word'
                        }}>
                            {JSON.stringify(ruleResult.workflows, null, 2)}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}
