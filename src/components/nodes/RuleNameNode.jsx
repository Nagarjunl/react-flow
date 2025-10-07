import React, { useState, useCallback } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { nodeColors } from '../../types/nodeTypes';

const RuleNameNode = ({ data, isConnectable, id }) => {
    const [ruleName, setRuleName] = useState(data.ruleName || '');
    const [isValid, setIsValid] = useState(true);
    const { updateNodeData } = useReactFlow();

    const handleRuleNameChange = useCallback((e) => {
        const value = e.target.value;
        setRuleName(value);
        const valid = value.trim() !== '';
        setIsValid(valid);

        // Update the node data using React Flow's recommended approach
        updateNodeData(id, {
            ruleName: value,
            isValid: valid
        });
    }, [id, updateNodeData]);

    return (
        <div
            style={{
                background: `linear-gradient(135deg, ${nodeColors.rule} 0%, ${nodeColors.rule}dd 100%)`,
                color: 'white',
                padding: '12px',
                borderRadius: '6px',
                minWidth: '200px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                border: isValid ? '1px solid transparent' : '1px solid #ef4444',
                transition: 'all 0.2s ease',
                position: 'relative'
            }}
        >
            <Handle
                type="target"
                position={Position.Top}
                id="top"
                style={{
                    background: '#fff',
                    width: '10px',
                    height: '10px',
                    border: '2px solid #8b5cf6'
                }}
                isConnectable={isConnectable}
            />
            <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '12px' }}>
                📋 Rule Name
            </div>

            <div>
                <input
                    type="text"
                    value={ruleName}
                    onChange={handleRuleNameChange}
                    placeholder="Enter rule name"
                    style={{
                        width: '100%',
                        padding: '6px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '11px',
                        backgroundColor: 'white',
                        color: '#333'
                    }}
                />
                {!isValid && (
                    <div style={{ color: '#ef4444', fontSize: '9px', marginTop: '2px' }}>
                        Required
                    </div>
                )}
            </div>
        </div>
    );
};

export default RuleNameNode;
