import React, { useState } from 'react';
import { Bot, X } from 'lucide-react';
import ChatContainer from '../chat/ChatContainer';

const FloatingAssistant = ({ messages, isLoading, onSend }) => {
    const [showChat, setShowChat] = useState(false);

    return (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>

            {/* Chat Window */}
            {showChat && (
                <div className="animate-slide-up" style={{
                    width: '400px',
                    height: '600px',
                    maxHeight: 'calc(100vh - 120px)',
                    background: 'var(--card-bg)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(20px)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    marginBottom: '0.5rem'
                }}>
                    <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Bot size={18} color="var(--accent)" /> Atlas Assistant
                            </h3>
                            <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem', marginLeft: '1.6rem', marginTop: '0.2rem' }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 5px #10b981' }}></span> Online
                            </span>
                        </div>
                        <button onClick={() => setShowChat(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                            <X size={18} />
                        </button>
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <ChatContainer
                            showInput={true}
                            messages={messages}
                            isLoading={isLoading}
                            onSend={onSend}
                            suggestions={[
                                "How do I improve my resume?",
                                "Analyze my job fit",
                                "Prepare for an interview",
                                "Find remote jobs"
                            ]}
                        />
                    </div>
                </div>
            )}

            {/* Toggle Button (FAB) */}
            <button
                onClick={() => setShowChat(!showChat)}
                className="animate-bounce"
                style={{
                    minWidth: showChat ? '60px' : 'auto',
                    padding: showChat ? '0' : '0 1.5rem',
                    height: '60px',
                    borderRadius: '30px',
                    background: showChat ? '#ef4444' : 'var(--accent)',
                    border: '4px solid rgba(0,0,0,0.2)',
                    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.5)',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.8rem',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: 'rotate(0deg)'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = `scale(1.05)`; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = `scale(1)`; }}
            >
                {showChat ? <X size={28} /> : (
                    <>
                        <Bot size={28} fill="white" />
                        <span style={{ fontWeight: '700', fontSize: '1rem', whiteSpace: 'nowrap' }}>AI Assistant</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default FloatingAssistant;
