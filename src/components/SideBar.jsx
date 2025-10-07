import React from 'react';

const SideBar = ({ onAddNode, onAddConditionToGroup, nodes, selectedGroupId, setSelectedGroupId, onGenerateJson, onLoadFromJson, onSaveFlow, onViewFlowJson }) => {
    const nodeTypes = [
        {
            type: 'initial',
            label: 'Initial Node',
            icon: '🚀',
            color: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
        },
        // {
        //     type: 'ruleName',
        //     label: 'Rule Name',
        //     icon: '📋',
        //     color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
        // },
        {
            type: 'resizableGroup',
            label: 'Rule Group',
            icon: '📦',
            color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
        },
        {
            type: 'condition',
            label: 'Condition',
            icon: '🔍',
            color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
        },
        {
            type: 'action',
            label: 'Action',
            icon: '⚡',
            color: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
        },
        {
            type: 'conditionalOperator',
            label: 'Operator',
            icon: '🔗',
            color: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'
        },
        // {
        //     type: 'actionName',
        //     label: 'Action Name',
        //     icon: '📝',
        //     color: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)'
        // }
    ];

    // Get available groups for selection
    const availableGroups = nodes
        .filter(node => node.type === 'resizableGroup')
        .map(node => ({
            id: node.id,
            label: node.data?.label || `Group ${node.id}`
        }));

    const selectedGroup = availableGroups.find(group => group.id === selectedGroupId);

    return (
        <div style={{
            width: '280px',
            padding: '20px',
            borderRight: '2px solid #e5e7eb',
            background: '#f9fafb',
            height: '100vh',
            overflowY: 'auto'
        }}>
            <h3 style={{
                color: '#1f2937',
                marginBottom: '20px',
                fontSize: '18px',
                fontWeight: 'bold'
            }}>
                Rule Engine Builder
            </h3>

            {/* Main Action Buttons - 4 Buttons */}
            <div style={{
                marginBottom: '20px',
                padding: '15px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '8px',
                border: '2px solid #4f46e5',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
                <h4 style={{
                    margin: '0 0 15px 0',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    textAlign: 'center'
                }}>
                    🚀 Workflow Actions
                </h4>

                {/* 1. Save Flow Button */}
                <button
                    onClick={onSaveFlow}
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)',
                        marginBottom: '10px'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 4px 8px rgba(16, 185, 129, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 4px rgba(16, 185, 129, 0.2)';
                    }}
                >
                    <span>💾</span>
                    <span>Save Flow</span>
                </button>

                {/* 2. Generate JSON Button */}
                <button
                    onClick={onGenerateJson}
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 4px rgba(245, 158, 11, 0.2)',
                        marginBottom: '10px'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 4px 8px rgba(245, 158, 11, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 4px rgba(245, 158, 11, 0.2)';
                    }}
                >
                    <span>📄</span>
                    <span>Generate JSON</span>
                </button>

                {/* 3. Load from JSON Button */}
                <button
                    onClick={onLoadFromJson}
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)',
                        marginBottom: '10px'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 4px 8px rgba(59, 130, 246, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 4px rgba(59, 130, 246, 0.2)';
                    }}
                >
                    <span>📂</span>
                    <span>Load from JSON</span>
                </button>

                {/* 4. View Flow JSON Button */}
                <button
                    onClick={onViewFlowJson}
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 4px rgba(139, 92, 246, 0.2)'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 4px 8px rgba(139, 92, 246, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 4px rgba(139, 92, 246, 0.2)';
                    }}
                >
                    <span>👁️</span>
                    <span>View Flow JSON</span>
                </button>

                <p style={{
                    margin: '8px 0 0 0',
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    textAlign: 'center'
                }}>
                    Save: ruleJson + flowJson | Generate: Show JSON | Load: Restore | View: Flow JSON
                </p>
            </div>

            {/* Node Types Section */}
            <div style={{
                marginBottom: '25px',
                padding: '15px',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
            }}>
                <h4 style={{
                    margin: '0 0 15px 0',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: 'bold'
                }}>
                    Add Nodes:
                </h4>

                {nodeTypes.map((nodeType) => (
                    <button
                        key={nodeType.type}
                        onClick={() => onAddNode(nodeType.type)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            marginBottom: '8px',
                            background: nodeType.color,
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                        }}
                    >
                        <span style={{ fontSize: '14px' }}>{nodeType.icon}</span>
                        <span>{nodeType.label}</span>
                    </button>
                ))}
            </div>

            {/* Selected Group Indicator */}
            {selectedGroup && (
                <div style={{
                    marginBottom: '20px',
                    padding: '12px',
                    background: '#fef3c7',
                    borderRadius: '8px',
                    border: '2px solid #f59e0b'
                }}>
                    <h4 style={{
                        margin: '0 0 8px 0',
                        color: '#92400e',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    }}>
                        Selected Group:
                    </h4>
                    <p style={{
                        margin: '0',
                        fontSize: '12px',
                        color: '#92400e',
                        fontWeight: '500'
                    }}>
                        {selectedGroup.label}
                    </p>
                </div>
            )}

            {/* Add Condition to Group Section */}
            {selectedGroup && (
                <div style={{
                    marginBottom: '25px',
                    padding: '15px',
                    background: '#f0fdf4',
                    borderRadius: '8px',
                    border: '1px solid #bbf7d0'
                }}>
                    <h4 style={{
                        margin: '0 0 15px 0',
                        color: '#166534',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    }}>
                        Add to Selected Group:
                    </h4>

                    <button
                        onClick={() => onAddConditionToGroup(selectedGroup.id)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 1px 3px rgba(16, 185, 129, 0.2)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = '0 2px 6px rgba(16, 185, 129, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 1px 3px rgba(16, 185, 129, 0.2)';
                        }}
                    >
                        <span>➕</span>
                        <span>Add Condition</span>
                    </button>
                </div>
            )}

            {/* Available Groups Section */}
            {availableGroups.length > 0 && (
                <div style={{
                    marginBottom: '25px',
                    padding: '15px',
                    background: '#fef7ff',
                    borderRadius: '8px',
                    border: '1px solid #e9d5ff'
                }}>
                    <h4 style={{
                        margin: '0 0 15px 0',
                        color: '#7c3aed',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    }}>
                        Available Groups:
                    </h4>

                    {availableGroups.map((group) => (
                        <button
                            key={group.id}
                            onClick={() => setSelectedGroupId(group.id)}
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                marginBottom: '6px',
                                background: selectedGroupId === group.id ? '#7c3aed' : '#f3f4f6',
                                color: selectedGroupId === group.id ? 'white' : '#374151',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                            }}
                            onMouseEnter={(e) => {
                                if (selectedGroupId !== group.id) {
                                    e.target.style.background = '#e5e7eb';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (selectedGroupId !== group.id) {
                                    e.target.style.background = '#f3f4f6';
                                }
                            }}
                        >
                            {group.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SideBar;