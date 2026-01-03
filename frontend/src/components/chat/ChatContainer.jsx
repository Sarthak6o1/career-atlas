import React from 'react';
import MessageList from './MessageList';
import InputArea from './InputArea';


const ChatContainer = ({ showInput = false, messages, isLoading, onSend, suggestions }) => {
    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
        }}>
            <div style={{ flex: 1, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                <MessageList messages={messages} isLoading={isLoading} />
            </div>

            {suggestions && suggestions.length > 0 && (
                <div style={{ padding: '0 1rem 0.5rem', display: 'flex', gap: '0.5rem', overflowX: 'auto', scrollbarWidth: 'none' }}>
                    {suggestions.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => onSend(s)}
                            style={{
                                background: 'var(--glass-border)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '16px',
                                padding: '0.4rem 0.8rem',
                                color: 'var(--text-secondary)',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = 'white'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--glass-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}

            {showInput && <InputArea onSend={onSend} />}
        </div>
    );
};

export default ChatContainer;
