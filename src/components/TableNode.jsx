// TableNode.jsx
import { Handle, Position } from '@xyflow/react';
import { useState } from 'react';

export default function TableNode({ data, onDelete }) {
    const [selectedFields, setSelectedFields] = useState([]);

    const handleFieldClick = (field) => {
        setSelectedFields(prev => {
            const exists = prev.find(f => f.name === field.name);
            if (exists) {
                return prev.filter(f => f.name !== field.name);
            } else {
                return [...prev, field];
            }
        });
    };

    const handleCreateCondition = () => {
        if (selectedFields.length === 0) {
            alert('Please select at least one field first');
            return;
        }

        const event = new CustomEvent('createCondition', {
            detail: {
                tableName: data.tableName,
                selectedFields: selectedFields
            }
        });
        window.dispatchEvent(event);
    };

    const handleCreateAction = () => {
        const event = new CustomEvent('createAction', {
            detail: {
                tableName: data.tableName,
                fields: data.fields
            }
        });
        window.dispatchEvent(event);
    };

    return (
        <div
            style={{
                padding: 15,
                border: '2px solid #8b5cf6',
                borderRadius: 8,
                background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
                minWidth: 200,
                boxShadow: '0 4px 6px rgba(139, 92, 246, 0.1)',
                position: 'relative'
            }}
        >
            <Handle type="target" position={Position.Top} style={{ background: '#8b5cf6' }} />

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

            <div style={{ fontWeight: 'bold', color: '#6b21a8', marginBottom: 10, fontSize: '16px' }}>
                {data.tableName}
            </div>

            <div style={{ marginBottom: 10 }}>
                {data.fields.map(field => {
                    const isSelected = selectedFields.find(f => f.name === field.name);
                    return (
                        <div
                            key={field.name}
                            onClick={() => handleFieldClick(field)}
                            style={{
                                cursor: 'pointer',
                                padding: '4px 8px',
                                margin: '2px 0',
                                borderRadius: '4px',
                                background: isSelected ? '#8b5cf6' : '#f8fafc',
                                color: isSelected ? 'white' : '#374151',
                                fontSize: '12px',
                                border: isSelected ? '1px solid #7c3aed' : '1px solid #e5e7eb'
                            }}
                        >
                            {field.name} ({field.type})
                        </div>
                    );
                })}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button
                    onClick={handleCreateCondition}
                    disabled={selectedFields.length === 0}
                    style={{
                        padding: '6px 12px',
                        background: selectedFields.length === 0 ? '#d1d5db' : '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: selectedFields.length === 0 ? 'not-allowed' : 'pointer',
                        fontSize: '11px',
                        flex: 1
                    }}
                >
                    Create Condition
                </button>
                <button
                    onClick={handleCreateAction}
                    style={{
                        padding: '6px 12px',
                        background: '#14b8a6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '11px',
                        flex: 1
                    }}
                >
                    Create Action
                </button>
            </div>

            <Handle type="source" position={Position.Bottom} style={{ background: '#8b5cf6' }} />
        </div>
    );
}