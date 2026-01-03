/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Zap, Sun, Moon, Upload, LogOut, Trash2, AlertTriangle, X } from 'lucide-react';

const WorkbenchHeader = ({ theme, toggleTheme, createNewSession, setActiveTab, logout, currentSessionId }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const executeDelete = async () => {
        if (!currentSessionId) return;
        setIsDeleting(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/chat/sessions/${currentSessionId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                // Success - Reload
                window.location.reload();
            } else {
                const text = await res.text();
                alert(`Delete Failed (${res.status}): ${text}`);
                setIsDeleting(false);
                setShowDeleteModal(false);
            }
        } catch (err) {
            alert("Network Error: " + err.message);
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    return (
        <>
            <div style={{ padding: '1.5rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(10px)', position: 'relative', zIndex: 1000 }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.8rem', margin: 0 }}>
                    <div style={{ padding: '0.5rem', background: 'white', borderRadius: '8px', display: 'flex' }}><Zap size={20} color="black" fill="black" /></div>
                    <span style={{ background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Career Atlas</span>
                </h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '0.5rem', borderRadius: '8px' }} title="Toggle Theme">
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)', margin: '0 0.5rem' }}></div>

                    {currentSessionId && (
                        <button
                            type="button"
                            onClick={() => setShowDeleteModal(true)}
                            style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                color: '#ef4444',
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                fontSize: '0.9rem', fontWeight: '500',
                                marginRight: '0.5rem',
                                zIndex: 1001,
                                pointerEvents: 'auto',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Trash2 size={16} /> Clear Session
                        </button>
                    )}

                    <button
                        onClick={() => {
                            createNewSession();
                            setActiveTab('dashboard');
                        }}
                        style={{
                            background: 'var(--accent)',
                            border: 'none',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            fontSize: '0.9rem', fontWeight: '500'
                        }}
                    >
                        <Upload size={16} /> New Upload
                    </button>

                    <button onClick={logout} style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.5rem 1rem', borderRadius: '8px', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', transition: 'all 0.2s', marginLeft: '0.5rem' }}>
                        <LogOut size={16} /> Log Out
                    </button>
                </div>
            </div>

            {/* CUSTOM DELETE MODAL */}
            {showDeleteModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '16px',
                        padding: '2rem',
                        maxWidth: '400px',
                        width: '90%',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                        position: 'relative',
                        display: 'flex', flexDirection: 'column', gap: '1.5rem'
                    }}>
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                        >
                            <X size={20} />
                        </button>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%' }}>
                                <Trash2 size={32} color="#ef4444" />
                            </div>
                            <div>
                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: 'white' }}>Delete Session?</h3>
                                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                    This will permanently remove the current resume session and all its chat history. This action cannot be undone.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                style={{
                                    flex: 1,
                                    padding: '0.8rem',
                                    borderRadius: '8px',
                                    background: 'transparent',
                                    border: '1px solid var(--glass-border)',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontWeight: '500'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={executeDelete}
                                disabled={isDeleting}
                                style={{
                                    flex: 1,
                                    padding: '0.8rem',
                                    borderRadius: '8px',
                                    background: '#ef4444',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    opacity: isDeleting ? 0.7 : 1
                                }}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete Forever'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default WorkbenchHeader;
