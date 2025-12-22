import React from 'react';
import { useChat } from '../../hooks/useChat.js';
import { Zap, Activity } from 'lucide-react';

const JobFit = () => {
    const { handleAction, resumeText, isLoading } = useChat();

    return (
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Job Fit Analysis</h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Upload your resume to see how well you match potential roles.
            </p>

            <button
                onClick={() => handleAction('analyze', { text: resumeText })}
                disabled={!resumeText || isLoading}
                style={{
                    padding: '1rem 2.5rem',
                    fontSize: '1.2rem',
                    borderRadius: '16px',
                    background: 'var(--accent)',
                    color: 'white',
                    border: 'none',
                    cursor: (!resumeText || isLoading) ? 'not-allowed' : 'pointer',
                    opacity: (!resumeText || isLoading) ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    margin: '0 auto',
                    fontWeight: '600',
                    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)'
                }}
            >
                {isLoading ? <Activity className="animate-spin" /> : <Zap size={24} />}
                {isLoading ? "Analyzing..." : "Analyze Capabilities"}
            </button>
        </div>
    );
};

export default JobFit;
