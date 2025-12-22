import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';

const MessageItem = ({ message }) => {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';

    if (isSystem) {
        return (
            <div style={{ textAlign: 'center', margin: '1rem 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                {message.content}
            </div>
        )
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: isUser ? 'flex-end' : 'flex-start',
            marginBottom: '1.5rem',
            animation: 'fadeIn 0.3s ease'
        }}>
            {!isUser && (
                <div style={{ position: 'absolute', top: '-20px', left: '10px', fontSize: '0.75rem', fontWeight: 'bold', color: '#c084fc', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    AI-Guide
                </div>
            )}
            <div style={{
                position: 'relative',
                maxWidth: '80%',
                padding: '1.5rem', /* Larger padding */
                borderRadius: '24px', /* Rounder corners */
                borderTopRightRadius: isUser ? '4px' : '24px',
                borderTopLeftRadius: isUser ? '24px' : '4px',
                backgroundColor: isUser ? 'var(--accent)' : 'var(--card-bg)',
                border: isUser ? 'none' : '1px solid var(--glass-border)',
                color: 'var(--text-primary)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                fontSize: '1.1rem', /* Larger font */
                lineHeight: '1.6'
            }}>
                {message.type === 'markdown' ? (
                    <div className="markdown-content">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                ) : (
                    <p style={{ margin: 0, lineHeight: 1.5 }}>{message.content}</p>
                )}

                {message.sources && message.sources.length > 0 && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8', marginBottom: '0.5rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399' }}></span>
                            RAG Sources
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {message.sources.map((src, idx) => (
                                <div key={idx} style={{ fontSize: '0.8rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '8px', borderLeft: '2px solid #c084fc' }}>
                                    <div style={{ fontWeight: '600', color: '#e2e8f0', marginBottom: '0.2rem' }}>{src.category}</div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{src.snippet}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageItem;
