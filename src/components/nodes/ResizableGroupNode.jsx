import React from 'react';
import { NodeResizer } from '@xyflow/react';

const ResizableGroupNode = ({ data, selected }) => {
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                backgroundColor: data.backgroundColor || 'rgba(139, 92, 246, 0.1)',
                border: data.border || '2px solid #8b5cf6',
                borderRadius: '8px',
                position: 'relative',
                minWidth: 200,
                minHeight: 150
            }}
        >
            <NodeResizer
                color="#8b5cf6"
                isVisible={selected}
                minWidth={200}
                minHeight={150}
            />
            {data.label && (
                <div
                    style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#8b5cf6',
                        pointerEvents: 'none'
                    }}
                >
                    {data.label}
                </div>
            )}
        </div>
    );
};

export default ResizableGroupNode;
