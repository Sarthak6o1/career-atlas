import React from 'react';
import { useChat } from '../../hooks/useChat.js';
import { Zap, AlignLeft, Briefcase, Mic, FileText } from 'lucide-react';

const EmptyState = () => {
    const { activeTab } = useChat();

    const content = {
        analyze: {
            icon: Zap,
            title: "Analysis Ready",
            description: "Click 'Run Analysis' to match your resume against market standards."
        },
        summary: {
            icon: AlignLeft,
            title: "Smart Summary",
            description: "Generate a powerful professional summary in seconds."
        },
        enhance: {
            icon: Briefcase,
            title: "Role Enhancer",
            description: "Target a specific role? We'll optimize your resume keywords."
        },
        interview: {
            icon: Mic,
            title: "Interview Prep",
            description: "Get tailored interview questions based on your profile."
        },
        cover: {
            icon: FileText,
            title: "Cover Letter",
            description: "Draft a compelling cover letter for your dream job."
        }
    };

    const activeContent = content[activeTab] || content.analyze;
    const Icon = activeContent.icon;

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.5,
            padding: '2rem',
            textAlign: 'center'
        }}>
            <div style={{ padding: '1.5rem', background: 'var(--bg-color)', borderRadius: '50%', marginBottom: '1.5rem' }}>
                <Icon size={48} color="var(--accent)" />
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>{activeContent.title}</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{activeContent.description}</p>
        </div>
    );
};

export default EmptyState;
