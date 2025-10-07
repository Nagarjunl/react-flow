import React, { useState, useCallback } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { nodeColors } from '../../types/nodeTypes';
import { Box, Typography, TextField, Alert } from '@mui/material';

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
        <Box
            sx={{
                background: `linear-gradient(135deg, ${nodeColors.initial} 0%, ${nodeColors.initial}dd 100%)`,
                color: 'white',
                p: 2,
                borderRadius: 2,
                minWidth: '200px',
                boxShadow: 3,
                border: isValid ? '2px solid transparent' : '2px solid #ef4444',
                transition: 'all 0.2s ease',
                position: 'relative'
            }}
        >
            <Typography
                variant="subtitle2"
                sx={{
                    mb: 1.5,
                    fontWeight: 'bold',
                    color: 'white'
                }}
            >
                🚀 Initial Node
            </Typography>

            <TextField
                size="small"
                value={workflowName}
                onChange={handleWorkflowNameChange}
                placeholder="Enter workflow name"
                label="Workflow Name *"
                variant="outlined"
                fullWidth
                sx={{
                    mb: 1,
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        fontSize: '0.75rem',
                        '& .MuiOutlinedInput-input': {
                            color: '#333'
                        }
                    },
                    '& .MuiInputLabel-root': {
                        fontSize: '0.75rem',
                        color: '#666'
                    }
                }}
            />

            {!isValid && (
                <Alert
                    severity="error"
                    sx={{
                        fontSize: '0.7rem',
                        '& .MuiAlert-message': {
                            fontSize: '0.7rem'
                        }
                    }}
                >
                    Workflow name is required
                </Alert>
            )}

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
        </Box>
    );
};

export default InitialNode;
