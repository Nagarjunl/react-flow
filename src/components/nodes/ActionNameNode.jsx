import React, { useState, useCallback } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { nodeColors, actionTypes } from '../../types/nodeTypes';

const ActionNameNode = ({ data, isConnectable, id }) => {
    const [actionType, setActionType] = useState(data.actionType || '');
    const [actionName, setActionName] = useState(data.actionName || '');
    const [isValid, setIsValid] = useState(true);
    const { updateNodeData } = useReactFlow();

    const validateFields = useCallback((type, name) => {
        const valid = type.trim() !== '' && name.trim() !== '';
        setIsValid(valid);

        // Update the node data using React Flow's recommended approach
        updateNodeData(id, {
            actionType: type,
            actionName: name,
            isValid: valid
        });
    }, [id, updateNodeData]);

    const handleActionTypeChange = useCallback((e) => {
        const value = e.target.value;
        setActionType(value);
        validateFields(value, actionName);
    }, [actionName, validateFields]);

    const handleActionNameChange = useCallback((e) => {
        const value = e.target.value;
        setActionName(value);
        validateFields(actionType, value);
    }, [actionType, validateFields]);

    return (
        <div
            style={{
                background: `linear-gradient(135deg, ${nodeColors.action} 0%, ${nodeColors.action}dd 100%)`,
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
                    border: '2px solid #14b8a6'
                }}
                isConnectable={isConnectable}
            />
            <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '12px' }}>
                ⚡ Action
            </div>

            <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', fontSize: '10px', marginBottom: '2px' }}>
                    Type *
                </label>
                <select
                    value={actionType}
                    onChange={handleActionTypeChange}
                    style={{
                        width: '100%',
                        padding: '4px',
                        border: '1px solid #ccc',
                        borderRadius: '3px',
                        fontSize: '10px',
                        backgroundColor: 'white',
                        color: '#333'
                    }}
                >
                    <option value="">Select type</option>
                    {actionTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                </select>
            </div>

            <div>
                <label style={{ display: 'block', fontSize: '10px', marginBottom: '2px' }}>
                    Name *
                </label>
                <input
                    type="text"
                    value={actionName}
                    onChange={handleActionNameChange}
                    placeholder="Enter action name"
                    style={{
                        width: '100%',
                        padding: '4px',
                        border: '1px solid #ccc',
                        borderRadius: '3px',
                        fontSize: '10px',
                        backgroundColor: 'white',
                        color: '#333'
                    }}
                />
            </div>

            {!isValid && (
                <div style={{ color: '#ef4444', fontSize: '9px', marginTop: '4px' }}>
                    Both fields required
                </div>
            )}
        </div>
    );
};

export default ActionNameNode;
