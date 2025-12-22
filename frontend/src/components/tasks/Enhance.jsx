import React, { useState } from 'react';
import { useChat } from '../../hooks/useChat.js';
import { Briefcase } from 'lucide-react';

const Enhance = () => {
    const { handleAction, resumeText, isLoading } = useChat();
    const [targetRole, setTargetRole] = useState('');

    return (
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Role Enhancer</h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Optimize your resume for a specific job title.
            </p>

            <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAction('enhance', { text: resumeText, role: targetRole })}
                placeholder="Enter Target Role (e.g. Product Manager)"
                style={{
                    padding: '1rem 1.5rem',
                    fontSize: '1.1rem',
                    width: '100%',
                    maxWidth: '500px',
                    borderRadius: '12px',
                    border: '1px solid var(--glass-border)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    marginBottom: '2rem',
                    outline: 'none',
                    textAlign: 'center'
                }}
            />

            <button
                onClick={() => handleAction('enhance', { text: resumeText, role: targetRole })}
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
                <Briefcase size={24} />
                Enhance Resume
            </button>
        </div>
    );
};

export default Enhance;
