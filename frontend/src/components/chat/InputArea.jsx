import React, { useState } from 'react';
import { useChat } from '../../hooks/useChat.js';
import Button from '../common/Button';
import { Send } from 'lucide-react';

const InputArea = ({ onSend }) => {
    const { addMessage, activeTab, handleAction } = useChat();
    const [inputValue, setInputValue] = useState('');

    const handleSend = () => {
        if (!inputValue.trim()) return;

        if (onSend) {
            onSend(inputValue);
        } else {
            // Send to the handler for the current context (e.g., 'dashboard' -> resuphyus)
            handleAction(activeTab, { text: inputValue });
        }
        setInputValue('');
    };

    return (
        <div style={{
            padding: '1.2rem',
            background: 'var(--card-bg)',
            borderTop: '1px solid var(--glass-border)',
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            backdropFilter: 'blur(20px)'
        }}>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your instruction..."
                style={{
                    flex: 1,
                    padding: '1rem 1.5rem',
                    borderRadius: '50px',
                    border: '1px solid var(--glass-border)',
                    background: 'rgba(0,0,0,0.3)',
                    color: 'white',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.2)'
                }}
                onFocus={(e) => {
                    e.target.style.borderColor = 'var(--accent)';
                    e.target.style.background = 'rgba(0,0,0,0.5)';
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = 'var(--glass-border)';
                    e.target.style.background = 'rgba(0,0,0,0.3)';
                }}
            />
            <button
                onClick={handleSend}
                className="snap-pill"
                style={{
                    padding: '1rem',
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
                }}
            >
                <Send size={20} />
            </button>
        </div>
    );
};

export default InputArea;
