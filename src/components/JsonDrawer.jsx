import React, { useState } from 'react';

const JsonDrawer = ({ isOpen, onClose, jsonData, onCopy, onDownload }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(jsonData);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            if (onCopy) onCopy();
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rule-engine-config.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        if (onDownload) onDownload();
    };

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                right: 0,
                width: '400px',
                height: '100vh',
                background: '#1a1a1a',
                borderLeft: '2px solid #333',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '-4px 0 12px rgba(0, 0, 0, 0.3)',
                transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.3s ease-in-out'
            }}
        >
            {/* Header */}
            <div
                style={{
                    padding: '20px',
                    borderBottom: '1px solid #333',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#2a2a2a'
                }}
            >
                <h3 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>
                    📄 Generated JSON
                </h3>
                <button
                    onClick={onClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#fff',
                        fontSize: '24px',
                        cursor: 'pointer',
                        padding: '5px'
                    }}
                >
                    ×
                </button>
            </div>

            {/* Actions */}
            <div
                style={{
                    padding: '15px 20px',
                    borderBottom: '1px solid #333',
                    display: 'flex',
                    gap: '10px'
                }}
            >
                <button
                    onClick={handleCopy}
                    style={{
                        background: copied ? '#22c55e' : '#3b82f6',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'background 0.2s'
                    }}
                >
                    {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
                <button
                    onClick={handleDownload}
                    style={{
                        background: '#8b5cf6',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}
                >
                    💾 Download
                </button>
            </div>

            {/* JSON Content */}
            <div
                style={{
                    flex: 1,
                    padding: '20px',
                    overflow: 'auto',
                    background: '#1a1a1a'
                }}
            >
                <pre
                    style={{
                        color: '#e5e5e5',
                        fontSize: '12px',
                        lineHeight: '1.5',
                        margin: 0,
                        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                    }}
                >
                    {jsonData}
                </pre>
            </div>

            {/* Footer */}
            <div
                style={{
                    padding: '15px 20px',
                    borderTop: '1px solid #333',
                    background: '#2a2a2a',
                    color: '#888',
                    fontSize: '12px'
                }}
            >
                💡 Tip: Copy the JSON to use in your rule engine
            </div>
        </div>
    );
};

export default JsonDrawer;
