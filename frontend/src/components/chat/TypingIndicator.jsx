import React from 'react';

const TypingIndicator = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
            <div style={{
                padding: '1rem',
                borderRadius: '12px',
                background: 'var(--card-bg)',
                border: '1px solid var(--glass-border)',
                display: 'flex',
                gap: '0.4rem',
                alignItems: 'center'
            }}>
                <div style={{ width: '6px', height: '6px', background: 'var(--text-secondary)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both' }}></div>
                <div style={{ width: '6px', height: '6px', background: 'var(--text-secondary)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.16s' }}></div>
                <div style={{ width: '6px', height: '6px', background: 'var(--text-secondary)', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.32s' }}></div>
            </div>
            <style>{`
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); opacity: 0.5; }
                    50% { transform: translateY(-5px); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default TypingIndicator;
