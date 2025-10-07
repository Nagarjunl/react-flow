import React, { useState, useCallback } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { nodeColors, conditionalOperators } from '../../types/nodeTypes';

const ConditionalOperatorNode = ({ data, isConnectable, id }) => {
    const [operator, setOperator] = useState(data.operator || '');
    const [isValid, setIsValid] = useState(true);
    const { updateNodeData } = useReactFlow();

    const handleOperatorChange = useCallback((e) => {
        const value = e.target.value;
        setOperator(value);
        const valid = value.trim() !== '';
        setIsValid(valid);

        // Update the node data using React Flow's recommended approach
        updateNodeData(id, {
            operator: value,
            isValid: valid
        });
    }, [id, updateNodeData]);

    return (
        <div
            style={{
                background: `linear-gradient(135deg, ${nodeColors.conditionalOperator} 0%, ${nodeColors.conditionalOperator}dd 100%)`,
                color: 'white',
                padding: '15px',
                borderRadius: '8px',
                minWidth: '200px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: isValid ? '2px solid transparent' : '2px solid #ef4444',
                transition: 'all 0.2s ease'
            }}
        >
            <div style={{ marginBottom: '15px', fontWeight: 'bold', fontSize: '14px' }}>
                🔗 Conditional Operator
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>
                    Operator *
                </label>
                <select
                    value={operator}
                    onChange={handleOperatorChange}
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
                    <option value="">Select operator</option>
                    {conditionalOperators.map(op => (
                        <option key={op.value} value={op.value}>{op.label}</option>
                    ))}
                </select>
                {!isValid && (
                    <div style={{ color: '#ef4444', fontSize: '10px', marginTop: '4px' }}>
                        Operator is required
                    </div>
                )}
            </div>

            <Handle
                type="target"
                position={Position.Top}
                id="top"
                style={{
                    background: '#fff',
                    width: '10px',
                    height: '10px',
                    border: '2px solid #f59e0b'
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
                    border: '2px solid #f59e0b'
                }}
                isConnectable={isConnectable}
            />
        </div>
    );
};

export default ConditionalOperatorNode;
