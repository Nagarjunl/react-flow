import React, { useState, useCallback } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { nodeColors } from '../../types/nodeTypes';

const InitialNode = ({ data, isConnectable, id }) => {
    const [workflowName, setWorkflowName] = useState(data.workflowName || '');
    const [isValid, setIsValid] = useState(true);
    const { updateNodeData } = useReactFlow();

    const handleWorkflowNameChange = useCallback((e) => {
        const value = e.target.value;
        setWorkflowName(value);
        const valid = value.trim() !== '';
        setIsValid(valid);

        // Update the node data using React Flow's recommended approach
        updateNodeData(id, {
            workflowName: value,
            isValid: valid
        });
    }, [id, updateNodeData]);

    return (
        <div
            style={{
                background: `linear-gradient(135deg, ${nodeColors.initial} 0%, ${nodeColors.initial}dd 100%)`,
                color: 'white',
                padding: '15px',
                borderRadius: '8px',
                minWidth: '200px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: isValid ? '2px solid transparent' : '2px solid #ef4444',
                transition: 'all 0.2s ease'
            }}
        >
            <div style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '14px' }}>
                🚀 Initial Node
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>
                    Workflow Name *
                </label>
                <input
                    type="text"
                    value={workflowName}
                    onChange={handleWorkflowNameChange}
                    placeholder="Enter workflow name"
                    style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '12px',
                        backgroundColor: 'white',
                        color: '#333'
                    }}
                />
                {!isValid && (
                    <div style={{ color: '#ef4444', fontSize: '10px', marginTop: '4px' }}>
                        Workflow name is required
                    </div>
                )}
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                id="bottom"
                style={{
                    background: '#fff',
                    width: '10px',
                    height: '10px',
                    border: '2px solid #3b82f6'
                }}
                isConnectable={isConnectable}
            />
        </div>
    );
};

export default InitialNode;
