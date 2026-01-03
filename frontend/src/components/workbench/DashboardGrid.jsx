import React from 'react';
import { Zap, AlignLeft, Briefcase, Mic, FileText, ArrowRight, Sparkles, Target, Globe, Search } from 'lucide-react';

export const ACTIONS = [
    {
        id: 'audit',
        label: 'Resume Audit',
        icon: Search,
        color: '#ef4444',
        desc: "Find critical mistakes & red flags",
        gradient: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
        border: '#FCA5A5'
    },
    {
        id: 'analyze',
        label: 'Job Fit Analysis',
        icon: Zap,
        color: '#f59e0b',
        desc: "Match skills to market & identify gaps",
        gradient: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
        border: '#FDBA74'
    },
    {
        id: 'summary',
        label: 'Executive Summary',
        icon: AlignLeft,
        color: '#3b82f6',
        desc: "Write a professional career narrative",
        gradient: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
        border: '#93C5FD'
    },
    {
        id: 'enhance',
        label: 'Enhance Resume',
        icon: Sparkles,
        color: '#10b981',
        desc: "Future proof skills & keywords",
        gradient: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
        border: '#6EE7B7'
    },
    {
        id: 'tailor',
        label: 'Smart Tailor',
        icon: Target,
        color: '#ec4899',
        desc: "Rewrite bullets for specific JDs",
        gradient: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)',
        border: '#F9A8D4'
    },
    {
        id: 'cover',
        label: 'Cover Letter',
        icon: FileText,
        color: '#8b5cf6',
        desc: "Strategic drafting for applications",
        gradient: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
        border: '#C4B5FD'
    },
    {
        id: 'interview-agentic',
        label: 'Interview Prep',
        icon: Mic,
        color: '#3b82f6',
        desc: "Deep-dive company research & questions",
        gradient: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
        border: '#93C5FD'
    },
    {
        id: 'jobs',
        label: 'Job Scout',
        icon: Globe,
        color: '#14b8a6',
        desc: "Find direct-apply ATS roles",
        gradient: 'linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%)',
        border: '#5EEAD4'
    }
];

const DashboardGrid = ({ onSelect }) => {
    const vectorTools = ['analyze', 'summary', 'enhance', 'tailor', 'cover'];
    const agenticTools = ['interview-agentic', 'jobs'];

    const renderGrid = (toolIds, title, icon) => (
        <div style={{ marginBottom: '3rem' }}>
            <h3 style={{
                marginBottom: '1.5rem',
                fontWeight: '800',
                fontSize: '1.4rem',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                letterSpacing: '-0.02em'
            }}>
                {icon}
                {title}
            </h3>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem'
            }}>
                {ACTIONS.filter(action => toolIds.includes(action.id)).map(action => (
                    <div
                        key={action.id}
                        onClick={() => onSelect(action.id)}
                        className="glass-panel"
                        style={{
                            padding: '1.8rem',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '1.2rem',
                            borderRadius: '24px',
                            border: `1px solid ${action.border}30`,
                            background: 'var(--card-bg)',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = `0 20px 25px -5px ${action.color}20, 0 10px 10px -5px ${action.color}10`;
                            e.currentTarget.style.borderColor = `${action.border}60`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                            e.currentTarget.style.borderColor = `${action.border}30`;
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{
                                padding: '1rem',
                                background: `${action.color}15`,
                                borderRadius: '16px',
                                border: `1px solid ${action.color}30`
                            }}>
                                <action.icon size={28} color={action.color} />
                            </div>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <ArrowRight size={16} color="var(--text-secondary)" />
                            </div>
                        </div>

                        <div>
                            <h4 style={{
                                margin: '0 0 0.5rem',
                                color: 'var(--text-primary)',
                                fontWeight: '700',
                                fontSize: '1.25rem',
                                letterSpacing: '-0.01em'
                            }}>
                                {action.label}
                            </h4>
                            <p style={{
                                margin: 0,
                                fontSize: '0.95rem',
                                color: 'var(--text-secondary)',
                                lineHeight: '1.5'
                            }}>
                                {action.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div style={{ padding: '1rem 0' }}>
            {renderGrid(vectorTools, 'Resume & Application', <Sparkles size={24} color="#22d3ee" fill="#22d3ee" />)}
            {renderGrid(agenticTools, 'Job Market Research', <Globe size={24} color="#10b981" />)}
        </div>
    );
};

export default DashboardGrid;
