import { Handle, Position } from '@xyflow/react';
import { useState, useEffect } from 'react';

export default function ConditionNode({ data, onDelete }) {
    const [selectedTable, setSelectedTable] = useState(data.selectedTable || '');
    const [selectedField, setSelectedField] = useState(data.selectedField || '');
    const [operator, setOperator] = useState(data.operator || '=');
    const [value, setValue] = useState(data.value || '');
    const [availableFields, setAvailableFields] = useState(data.availableFields || []);

    const operators = [
        { value: '=', label: 'Equals (=)' },
        { value: '>', label: 'Greater than (>)' },
        { value: '<', label: 'Less than (<)' },
        { value: '>=', label: 'Greater or equal (>=)' },
        { value: '<=', label: 'Less or equal (<=)' },
        { value: '!=', label: 'Not equal (!=)' },
        { value: 'LIKE', label: 'Contains (LIKE)' },
        { value: 'IN', label: 'In list (IN)' }
    ];

    useEffect(() => {
        // Update data when values change
        data.selectedTable = selectedTable;
        data.selectedField = selectedField;
        data.operator = operator;
        data.value = value;
    }, [selectedTable, selectedField, operator, value, data]);

    useEffect(() => {
        const handleTableFieldsResponse = (event) => {
            const { tableName, fields } = event.detail;
            if (tableName === selectedTable) {
                setAvailableFields(fields);
            }
        };

        window.addEventListener('tableFieldsResponse', handleTableFieldsResponse);
        return () => window.removeEventListener('tableFieldsResponse', handleTableFieldsResponse);
    }, [selectedTable]);

    const handleTableChange = (e) => {
        const tableName = e.target.value;
        setSelectedTable(tableName);
        setSelectedField('');

        // Find fields for this table
        const event = new CustomEvent('getTableFields', {
            detail: { tableName }
        });
        window.dispatchEvent(event);
    };

    const handleFieldChange = (e) => {
        setSelectedField(e.target.value);
    };

    const getFieldType = () => {
        const field = availableFields.find(f => f.name === selectedField);
        return field ? field.type : '';
    };

    return (
        <div
            style={{
                padding: 15,
                border: '2px solid #ef4444',
                borderRadius: 8,
                background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                minWidth: 250,
                boxShadow: '0 4px 6px rgba(239, 68, 68, 0.1)',
                position: 'relative'
            }}
        >
            <Handle type="target" position={Position.Top} style={{ background: '#ef4444' }} />

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

            <div style={{ fontWeight: 'bold', color: '#dc2626', marginBottom: 15, fontSize: '16px' }}>
                Condition
            </div>

            {/* Table Selection */}
            <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#374151', marginBottom: '4px' }}>
                    Table:
                </label>
                <select
                    value={selectedTable}
                    onChange={handleTableChange}
                    style={{
                        width: '100%',
                        padding: '6px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '12px'
                    }}
                >
                    <option value="">Select table...</option>
                    <option value="metrics">metrics</option>
                    <option value="user">user</option>
                    <option value="sales">sales</option>
                    <option value="orders">orders</option>
                    <option value="products">products</option>
                    <option value="customers">customers</option>
                </select>
            </div>

            {/* Field Selection */}
            <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#374151', marginBottom: '4px' }}>
                    Field:
                </label>
                <select
                    value={selectedField}
                    onChange={handleFieldChange}
                    disabled={!selectedTable}
                    style={{
                        width: '100%',
                        padding: '6px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '12px',
                        // background: !selectedTable ? '#f9fafb' : 'white'
                    }}
                >
                    <option value="">Select field...</option>
                    {availableFields.map(field => (
                        <option key={field.name} value={field.name}>
                            {field.name} ({field.type})
                        </option>
                    ))}
                </select>
            </div>

            {/* Operator Selection */}
            <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#374151', marginBottom: '4px' }}>
                    Operator:
                </label>
                <select
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '6px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '12px'
                    }}
                >
                    {operators.map(op => (
                        <option key={op.value} value={op.value}>
                            {op.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Value Input */}
            <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#374151', marginBottom: '4px' }}>
                    Value:
                </label>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={`Enter ${getFieldType()} value...`}
                    style={{
                        width: '100%',
                        padding: '6px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '12px'
                    }}
                />
            </div>

            {/* Condition Preview */}
            {selectedTable && selectedField && value && (
                <div style={{
                    padding: '8px',
                    background: '#f3f4f6',
                    borderRadius: '4px',
                    fontSize: '11px',
                    color: '#374151',
                    marginTop: '10px'
                }}>
                    <strong>Condition:</strong> {selectedTable}.{selectedField} {operator} {value}
                </div>
            )}

            <Handle type="source" position={Position.Bottom} style={{ background: '#ef4444' }} />
        </div>
    );
}
