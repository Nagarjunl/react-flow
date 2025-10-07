import { Handle, Position } from '@xyflow/react';
import { useState } from 'react';

export default function FieldNode({ data, isConnectable }) {
    const [isSelected, setIsSelected] = useState(false);

    const handleClick = () => {
        setIsSelected(!isSelected);
        // Emit event for field selection
        const event = new CustomEvent('fieldSelected', {
            detail: {
                fieldName: data.fieldName,
                fieldType: data.fieldType,
                tableName: data.tableName,
                nodeId: data.nodeId
            }
        });
        window.dispatchEvent(event);
    };

    return (
        <div
            style={{
                padding: 8,
                border: isSelected ? '2px solid #007bff' : '1px solid #28a745',
                borderRadius: 6,
                background: isSelected ? '#e3f2fd' : '#f8f9fa',
                minWidth: 120,
                textAlign: 'center',
                cursor: 'pointer',
                fontSize: '12px'
            }}
            onClick={handleClick}
        >
            <Handle
                type="target"
                position={Position.Top}
                isConnectable={isConnectable}
                style={{ background: '#28a745' }}
            />
            <div style={{ fontWeight: 'bold', color: '#28a745' }}>
                {data.tableName}.{data.fieldName}
            </div>
            <div style={{ fontSize: '10px', color: '#666', marginTop: 2 }}>
                {data.fieldType}
            </div>
            <Handle
                type="source"
                position={Position.Bottom}
                isConnectable={isConnectable}
                style={{ background: '#28a745' }}
            />
        </div>
    );
}
