import React, { useState, useEffect } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { nodeColors, expressionSymbols } from '../../types/nodeTypes';
import { tableSchema } from '../../constants/constant';

const ConditionNode = ({ data, isConnectable, id }) => {
    const [selectedTable, setSelectedTable] = useState(data.selectedTable || '');
    const [selectedField, setSelectedField] = useState(data.selectedField || '');
    const [expression, setExpression] = useState(data.expression || '');
    const [value, setValue] = useState(data.value || '');
    const [isValid, setIsValid] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);

    const [availableFields, setAvailableFields] = useState([]);
    const [availableExpressions, setAvailableExpressions] = useState([]);
    const { updateNodeData } = useReactFlow();

    // Initialize available fields and expressions on first load
    useEffect(() => {
        if (!isInitialized) {
            if (selectedTable && tableSchema[selectedTable]) {
                setAvailableFields(tableSchema[selectedTable]);

                // If we have a selected field, set up expressions
                if (selectedField) {
                    const field = tableSchema[selectedTable].find(f => f.name === selectedField);
                    if (field) {
                        setAvailableExpressions(expressionSymbols[field.type] || []);
                    }
                }
            }
            setIsInitialized(true);
        }
    }, [selectedTable, selectedField, isInitialized]);

    // Update available fields when table changes (only after initialization)
    useEffect(() => {
        if (isInitialized && selectedTable && tableSchema[selectedTable]) {
            setAvailableFields(tableSchema[selectedTable]);
            // Only clear fields if this is a user-initiated change, not initial load
            if (data.selectedTable !== selectedTable) {
                setSelectedField('');
                setExpression('');
                setValue('');
            }
        } else if (isInitialized) {
            setAvailableFields([]);
        }
    }, [selectedTable, isInitialized, data.selectedTable]);

    // Update available expressions when field changes (only after initialization)
    useEffect(() => {
        if (isInitialized && selectedField && availableFields.length > 0) {
            const field = availableFields.find(f => f.name === selectedField);
            if (field) {
                setAvailableExpressions(expressionSymbols[field.type] || []);
                // Only clear expression and value if this is a user-initiated change, not initial load
                if (data.selectedField !== selectedField) {
                    setExpression('');
                    setValue('');
                }
            }
        } else if (isInitialized) {
            setAvailableExpressions([]);
        }
    }, [selectedField, availableFields, isInitialized, data.selectedField]);

    // Validate all fields and update node data using React Flow's approach
    useEffect(() => {
        const valid = selectedTable && selectedField && expression && value.trim() !== '';
        setIsValid(valid);

        // Update the node data using React Flow's recommended approach
        updateNodeData(id, {
            selectedTable,
            selectedField,
            expression,
            value,
            isValid: valid
        });
    }, [selectedTable, selectedField, expression, value, id, updateNodeData]);

    const handleTableChange = (e) => {
        setSelectedTable(e.target.value);
    };

    const handleFieldChange = (e) => {
        setSelectedField(e.target.value);
    };

    const handleExpressionChange = (e) => {
        setExpression(e.target.value);
    };

    const handleValueChange = (e) => {
        setValue(e.target.value);
    };

    const getInputType = () => {
        if (selectedField && availableFields.length > 0) {
            const field = availableFields.find(f => f.name === selectedField);
            if (field) {
                if (field.type === 'date') return 'date';
                if (field.type === 'numeric' || field.type === 'integer') return 'number';
                return 'text';
            }
        }
        return 'text';
    };

    const getValuePlaceholder = () => {
        if (selectedField && availableFields.length > 0) {
            const field = availableFields.find(f => f.name === selectedField);
            if (field) {
                if (field.type === 'date') return 'YYYY-MM-DD';
                if (field.type === 'numeric' || field.type === 'integer') return 'Enter number';
                return 'Enter text';
            }
        }
        return 'Enter value';
    };

    return (
        <div
            style={{
                background: `linear-gradient(135deg, ${nodeColors.condition} 0%, ${nodeColors.condition}dd 100%)`,
                color: 'white',
                padding: '15px',
                borderRadius: '8px',
                minWidth: '280px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: isValid ? '2px solid transparent' : '2px solid #ef4444',
                transition: 'all 0.2s ease'
            }}
        >
            <div style={{ marginBottom: '15px', fontWeight: 'bold', fontSize: '14px' }}>
                🔍 Condition Node
            </div>

            {/* 2x2 Grid Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {/* Table Selection */}
                <div>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>
                        Table *
                    </label>
                    <select
                        value={selectedTable}
                        onChange={handleTableChange}
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '12px',
                            backgroundColor: 'white',
                            color: '#333'
                        }}
                    >
                        <option value="">Select table</option>
                        {Object.keys(tableSchema).map(table => (
                            <option key={table} value={table}>{table}</option>
                        ))}
                    </select>
                </div>

                {/* Field Selection */}
                <div>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>
                        Field *
                    </label>
                    <select
                        value={selectedField}
                        onChange={handleFieldChange}
                        disabled={!selectedTable}
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '12px',
                            backgroundColor: selectedTable ? 'white' : '#f5f5f5',
                            color: '#333'
                        }}
                    >
                        <option value="">Select field</option>
                        {availableFields.map(field => (
                            <option key={field.name} value={field.name}>{field.name}</option>
                        ))}
                    </select>
                </div>

                {/* Expression Selection */}
                <div>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>
                        Expression *
                    </label>
                    <select
                        value={expression}
                        onChange={handleExpressionChange}
                        disabled={!selectedField}
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '12px',
                            backgroundColor: selectedField ? 'white' : '#f5f5f5',
                            color: '#333'
                        }}
                    >
                        <option value="">Select expression</option>
                        {availableExpressions.map(expr => (
                            <option key={expr.value} value={expr.value}>{expr.label}</option>
                        ))}
                    </select>
                </div>

                {/* Value Input */}
                <div>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>
                        Value *
                    </label>
                    <input
                        type={getInputType()}
                        value={value}
                        onChange={handleValueChange}
                        placeholder={getValuePlaceholder()}
                        disabled={!expression}
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '12px',
                            backgroundColor: expression ? 'white' : '#f5f5f5',
                            color: '#333'
                        }}
                    />
                </div>
            </div>

            {!isValid && (
                <div style={{ color: '#ef4444', fontSize: '10px', marginTop: '8px' }}>
                    All fields are required
                </div>
            )}

            <Handle
                type="target"
                position={Position.Top}
                id="top"
                style={{
                    background: '#fff',
                    width: '10px',
                    height: '10px',
                    border: '2px solid #ef4444'
                }}
                isConnectable={isConnectable}
            />
            <Handle
                type="source"
                position={Position.Bottom}
                id="bottom"
                style={{
                    background: '#fff',
                    width: '10px',
                    height: '10px',
                    border: '2px solid #ef4444'
                }}
                isConnectable={isConnectable}
            />
        </div>
    );
};

export default ConditionNode;
