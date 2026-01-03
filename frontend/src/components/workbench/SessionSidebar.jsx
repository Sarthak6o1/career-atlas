/* eslint-disable react/prop-types */
import React from 'react';
import { Eye, Trash2 } from 'lucide-react';

const SessionSidebar = ({ sessions, currentSessionId, loadSession, setActiveTab }) => {
    return (
        <div style={{
            width: '260px',
            background: 'var(--card-bg)',
            borderRight: '1px solid var(--glass-border)',
            display: 'flex',
            flexDirection: 'column',
            padding: '1rem',
            flexShrink: 0,
            transition: 'background 0.3s ease, border 0.3s ease'
        }}>
            <div style={{ flex: 1, overflowY: 'auto', marginTop: '1rem' }}>
                <h4 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.8rem', paddingLeft: '0.5rem', fontWeight: 'bold', letterSpacing: '1px' }}>Resume Uploads History</h4>

                {sessions && sessions.length > 0 ? sessions.slice(0, 20).map(sess => (
                    <div key={sess.id} className="session-item" style={{
                        padding: '0.8rem',
                        borderRadius: '8px',
                        marginBottom: '0.5rem',
                        cursor: 'default',
                        background: sess.id === currentSessionId ? 'var(--glass-border)' : 'transparent',
                        border: sess.id === currentSessionId ? '1px solid var(--glass-border)' : '1px solid transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s',
                        fontSize: '0.9rem',
                        color: 'var(--text-primary)'
                    }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1, marginRight: '0.5rem' }}>
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: sess.id === currentSessionId ? '600' : '400' }} title={sess.title}>
                                {sess.title || "Untitled Resume"}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                {new Date(sess.updated_at).toLocaleDateString()}
                            </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    loadSession(sess.id);
                                    setActiveTab('dashboard'); // Switch to Dashboard on view
                                }}
                                style={{
                                    background: 'var(--accent)',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    display: 'flex', alignItems: 'center', gap: '4px',
                                    fontSize: '0.75rem', fontWeight: '600'
                                }}
                                title="View Resume Workspace"
                            >
                                <Eye size={14} /> View
                            </button>
                        </div>
                    </div>
                )) : (
                    <div style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', fontStyle: 'italic' }}>No resumes uploaded yet</div>
                )}
            </div>
        </div>
    );
};

export default SessionSidebar;
