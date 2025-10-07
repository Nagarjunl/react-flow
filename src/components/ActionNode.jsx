import { Handle, Position } from '@xyflow/react';
import { useState, useEffect } from 'react';

export default function ActionNode({ data, onDelete }) {
    const [targetTable, setTargetTable] = useState(data.targetTable || '');
    const [targetField, setTargetField] = useState(data.targetField || '');
    const [expression, setExpression] = useState(data.expression || '');
    const [isEditing, setIsEditing] = useState(false);
    const [availableFields, setAvailableFields] = useState(data.availableFields || []);
    const [allTableFields, setAllTableFields] = useState(data.allTableFields || {});

    // Individual rule configuration for each ActionNode
    const [ruleName, setRuleName] = useState(data.ruleName || '');
    const [successEvent, setSuccessEvent] = useState(data.successEvent || '');
    const [errorMessage, setErrorMessage] = useState(data.errorMessage || '');
    const [ruleType, setRuleType] = useState(data.ruleType || 'commission');
    const [workflowName, setWorkflowName] = useState(data.workflowName || 'CommissionCalculation');
    const [priority, setPriority] = useState(data.priority || 1);
    const [isActive, setIsActive] = useState(data.isActive !== undefined ? data.isActive : true);
    const [description, setDescription] = useState(data.description || '');
    const [actionType, setActionType] = useState(data.actionType || 'percentage');
    const [actionValue, setActionValue] = useState(data.actionValue || 0);

    useEffect(() => {
        // Update data when values change
        data.targetTable = targetTable;
        data.targetField = targetField;
        data.expression = expression;
        data.ruleName = ruleName;
        data.successEvent = successEvent;
        data.errorMessage = errorMessage;
        data.ruleType = ruleType;
        data.workflowName = workflowName;
        data.priority = priority;
        data.isActive = isActive;
        data.description = description;
        data.actionType = actionType;
        data.actionValue = actionValue;
    }, [targetTable, targetField, expression, ruleName, successEvent, errorMessage, ruleType, workflowName, priority, isActive, description, actionType, actionValue, data]);

    useEffect(() => {
        const handleTableFieldsResponse = (event) => {
            const { tableName, fields } = event.detail;
            setAllTableFields(prev => ({
                ...prev,
                [tableName]: fields
            }));
            if (tableName === targetTable) {
                setAvailableFields(fields);
            }
        };

        window.addEventListener('tableFieldsResponse', handleTableFieldsResponse);
        return () => window.removeEventListener('tableFieldsResponse', handleTableFieldsResponse);
    }, [targetTable]);

    const handleTableChange = (e) => {
        const tableName = e.target.value;
        setTargetTable(tableName);
        setTargetField('');

        // Find fields for this table
        const event = new CustomEvent('getTableFields', {
            detail: { tableName }
        });
        window.dispatchEvent(event);
    };

    const handleFieldChange = (e) => {
        setTargetField(e.target.value);
    };

    const handleExpressionChange = (e) => {
        setExpression(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            setIsEditing(false);
        }
    };

    const insertField = (field) => {
        const fieldRef = `${field.tableName}.${field.fieldName}`;
        setExpression(prev => prev + fieldRef);
        setIsEditing(true);
    };


    return (
        <div
            style={{
                padding: 15,
                border: '2px solid #14b8a6',
                borderRadius: 8,
                background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
                minWidth: 280,
                boxShadow: '0 4px 6px rgba(20, 184, 166, 0.1)',
                position: 'relative'
            }}
        >
            <Handle type="target" position={Position.Top} style={{ background: '#14b8a6' }} />

            {/* Delete button */}
            <button
                onClick={() => onDelete && onDelete()}
                style={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                ×
            </button>

            <div style={{ fontWeight: 'bold', color: '#0f766e', marginBottom: 15, fontSize: '16px' }}>
                Action
            </div>

            {/* Target Table Selection */}
            <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#374151', marginBottom: '4px' }}>
                    Target Table:
                </label>
                <select
                    value={targetTable}
                    onChange={handleTableChange}
                    style={{
                        width: '100%',
                        padding: '6px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '12px'
                    }}
                >
                    <option value="">Select target table...</option>
                    <option value="metrics">metrics</option>
                    <option value="user">user</option>
                    <option value="sales">sales</option>
                    <option value="orders">orders</option>
                    <option value="products">products</option>
                    <option value="customers">customers</option>
                </select>
            </div>

            {/* Target Field Selection */}
            <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#374151', marginBottom: '4px' }}>
                    Target Field:
                </label>
                <select
                    value={targetField}
                    onChange={handleFieldChange}
                    disabled={!targetTable}
                    style={{
                        width: '100%',
                        padding: '6px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '12px',
                        // background: !targetTable ? '#f9fafb' : 'white'
                    }}
                >
                    <option value="">Select target field...</option>
                    {availableFields.map(field => (
                        <option key={field.name} value={field.name}>
                            {field.name} ({field.type})
                        </option>
                    ))}
                </select>
            </div>

            {/* Expression Input */}
            <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#374151', marginBottom: '4px' }}>
                    Expression:
                </label>
                {isEditing ? (
                    <textarea
                        value={expression}
                        onChange={handleExpressionChange}
                        onKeyPress={handleKeyPress}
                        onBlur={() => setIsEditing(false)}
                        placeholder="Enter calculation expression..."
                        style={{
                            width: '100%',
                            height: '80px',
                            padding: '6px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            fontSize: '11px',
                            resize: 'vertical'
                        }}
                        autoFocus
                    />
                ) : (
                    <div
                        onClick={() => setIsEditing(true)}
                        style={{
                            padding: '6px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            minHeight: '80px',
                            background: 'white',
                            cursor: 'pointer',
                            fontSize: '11px',
                            textAlign: 'left',
                            whiteSpace: 'pre-wrap'
                        }}
                    >
                        {expression || 'Click to enter expression...'}
                    </div>
                )}
            </div>

            {/* Rule Configuration */}
            <div style={{ marginBottom: 10, padding: '10px', background: '#f8f9fa', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    ⚙️ Rule Configuration
                    <span style={{
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '8px',
                        background: isActive ? '#d4edda' : '#f8d7da',
                        color: isActive ? '#155724' : '#721c24'
                    }}>
                        {isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>

                {/* Basic Rule Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '8px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '9px', color: '#6b7280', marginBottom: '2px' }}>
                            Rule Name *:
                        </label>
                        <input
                            type="text"
                            value={ruleName}
                            onChange={(e) => setRuleName(e.target.value)}
                            placeholder="e.g., HighPerformerCommission"
                            style={{
                                width: '100%',
                                padding: '4px',
                                border: '1px solid #d1d5db',
                                borderRadius: '3px',
                                fontSize: '10px'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '9px', color: '#6b7280', marginBottom: '2px' }}>
                            Rule Type:
                        </label>
                        <select
                            value={ruleType}
                            onChange={(e) => setRuleType(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '4px',
                                border: '1px solid #d1d5db',
                                borderRadius: '3px',
                                fontSize: '10px'
                            }}
                        >
                            <option value="commission">Commission</option>
                            <option value="bonus">Bonus</option>
                            <option value="incentive">Incentive</option>
                            <option value="penalty">Penalty</option>
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div style={{ marginBottom: '8px' }}>
                    <label style={{ display: 'block', fontSize: '9px', color: '#6b7280', marginBottom: '2px' }}>
                        Description:
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe what this rule does..."
                        style={{
                            width: '100%',
                            padding: '4px',
                            border: '1px solid #d1d5db',
                            borderRadius: '3px',
                            fontSize: '10px',
                            height: '40px',
                            resize: 'vertical'
                        }}
                    />
                </div>

                {/* Events and Messages */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '8px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '9px', color: '#6b7280', marginBottom: '2px' }}>
                            Success Event:
                        </label>
                        <input
                            type="text"
                            value={successEvent}
                            onChange={(e) => setSuccessEvent(e.target.value)}
                            placeholder="e.g., Commission Applied"
                            style={{
                                width: '100%',
                                padding: '4px',
                                border: '1px solid #d1d5db',
                                borderRadius: '3px',
                                fontSize: '10px'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '9px', color: '#6b7280', marginBottom: '2px' }}>
                            Error Message:
                        </label>
                        <input
                            type="text"
                            value={errorMessage}
                            onChange={(e) => setErrorMessage(e.target.value)}
                            placeholder="e.g., Criteria not met"
                            style={{
                                width: '100%',
                                padding: '4px',
                                border: '1px solid #d1d5db',
                                borderRadius: '3px',
                                fontSize: '10px'
                            }}
                        />
                    </div>
                </div>

                {/* Workflow and Priority */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '8px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '9px', color: '#6b7280', marginBottom: '2px' }}>
                            Workflow Name:
                        </label>
                        <input
                            type="text"
                            value={workflowName}
                            onChange={(e) => setWorkflowName(e.target.value)}
                            placeholder="e.g., CommissionCalculation"
                            style={{
                                width: '100%',
                                padding: '4px',
                                border: '1px solid #d1d5db',
                                borderRadius: '3px',
                                fontSize: '10px'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '9px', color: '#6b7280', marginBottom: '2px' }}>
                            Priority:
                        </label>
                        <input
                            type="number"
                            value={priority}
                            onChange={(e) => setPriority(parseInt(e.target.value) || 1)}
                            min="1"
                            max="100"
                            style={{
                                width: '100%',
                                padding: '4px',
                                border: '1px solid #d1d5db',
                                borderRadius: '3px',
                                fontSize: '10px'
                            }}
                        />
                    </div>
                </div>

                {/* Action Configuration */}
                <div style={{ marginBottom: '8px' }}>
                    <label style={{ display: 'block', fontSize: '9px', color: '#6b7280', marginBottom: '4px' }}>
                        Action Configuration:
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '8px', color: '#6b7280', marginBottom: '2px' }}>
                                Type:
                            </label>
                            <select
                                value={actionType}
                                onChange={(e) => setActionType(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '4px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '3px',
                                    fontSize: '10px'
                                }}
                            >
                                <option value="percentage">Percentage</option>
                                <option value="fixed">Fixed Amount</option>
                                <option value="formula">Custom Formula</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '8px', color: '#6b7280', marginBottom: '2px' }}>
                                Value:
                            </label>
                            <input
                                type={actionType === 'formula' ? 'text' : 'number'}
                                value={actionValue}
                                onChange={(e) => setActionValue(actionType === 'formula' ? e.target.value : parseFloat(e.target.value) || 0)}
                                placeholder={actionType === 'formula' ? 'e.g., Sales * 0.05' : actionType === 'percentage' ? '5' : '1000'}
                                style={{
                                    width: '100%',
                                    padding: '4px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '3px',
                                    fontSize: '10px'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Status Toggle */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '9px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            style={{ margin: 0 }}
                        />
                        Rule is Active
                    </label>
                </div>
            </div>

            {/* Dynamic Field Reference Buttons */}
            {Object.keys(allTableFields).length > 0 && (
                <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: '10px', color: '#374151', marginBottom: 4 }}>
                        Quick Insert Fields:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {/* Show target table fields first */}
                        {targetTable && allTableFields[targetTable] && (
                            <div>
                                <div style={{ fontSize: '9px', color: '#6b21a8', fontWeight: 'bold', marginBottom: '2px' }}>
                                    {targetTable} (target):
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                    {allTableFields[targetTable].map(field => (
                                        <button
                                            key={`${targetTable}.${field.name}`}
                                            onClick={() => insertField({ tableName: targetTable, fieldName: field.name })}
                                            style={{
                                                fontSize: '9px',
                                                padding: '4px 6px',
                                                background: '#8b5cf6',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '3px',
                                                cursor: 'pointer'
                                            }}
                                            title={`${targetTable}.${field.name} (${field.type})`}
                                        >
                                            {field.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Show other table fields in a more organized way */}
                        <div>
                            <div style={{ fontSize: '9px', color: '#6b7280', fontWeight: 'bold', marginBottom: '2px' }}>
                                Other tables:
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxHeight: '80px', overflowY: 'auto' }}>
                                {Object.entries(allTableFields)
                                    .filter(([tableName]) => tableName !== targetTable)
                                    .slice(0, 3) // Limit to first 3 tables to avoid clutter
                                    .map(([tableName, fields]) =>
                                        fields.slice(0, 4).map(field => ( // Limit to first 4 fields per table
                                            <button
                                                key={`${tableName}.${field.name}`}
                                                onClick={() => insertField({ tableName, fieldName: field.name })}
                                                style={{
                                                    fontSize: '8px',
                                                    padding: '3px 5px',
                                                    background: '#6b7280',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '3px',
                                                    cursor: 'pointer'
                                                }}
                                                title={`${tableName}.${field.name} (${field.type})`}
                                            >
                                                {tableName}.{field.name}
                                            </button>
                                        ))
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Preview */}
            {targetTable && targetField && expression && (
                <div style={{
                    padding: '8px',
                    background: '#f3f4f6',
                    borderRadius: '4px',
                    fontSize: '11px',
                    color: '#374151',
                    marginTop: '10px'
                }}>
                    <strong>Action:</strong> SET {targetTable}.{targetField} = {expression}
                </div>
            )}

            <Handle type="source" position={Position.Bottom} style={{ background: '#14b8a6' }} />
        </div>
    );
}
