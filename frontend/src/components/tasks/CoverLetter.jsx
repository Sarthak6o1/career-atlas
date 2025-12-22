import React, { useState } from 'react';
import { useChat } from '../../hooks/useChat.js';
import { FileText } from 'lucide-react';

const CoverLetter = () => {
    const { handleAction, resumeText, isLoading } = useChat();
    const [targetRole, setTargetRole] = useState('');

    return (
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Cover Letter Generator</h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Draft a compelling cover letter for your application.
            </p>

            <textarea
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Paste the Job Description or Title here..."
                rows={4}
                style={{
                    padding: '1rem 1.5rem',
                    fontSize: '1rem',
                    width: '100%',
                    maxWidth: '600px',
                    borderRadius: '12px',
                    border: '1px solid var(--glass-border)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    marginBottom: '2rem',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                }}
            />

            <br />

            <button
                onClick={() => handleAction('cover', { text: resumeText, role: targetRole })}
                disabled={!resumeText || !targetRole || isLoading}
                style={{
                    padding: '1rem 2.5rem',
                    fontSize: '1.2rem',
                    borderRadius: '16px',
                    background: 'var(--accent)',
                    color: 'white',
                    border: 'none',
                    cursor: (!resumeText || !targetRole || isLoading) ? 'not-allowed' : 'pointer',
                    opacity: (!resumeText || !targetRole || isLoading) ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    margin: '0 auto',
                    fontWeight: '600',
                    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)'
                }}
            >
                <FileText size={24} />
                Generate Strategy
            </button>
        </div>
    );
};

export default CoverLetter;
