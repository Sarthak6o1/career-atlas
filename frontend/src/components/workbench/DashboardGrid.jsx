import React from 'react';
import { Zap, AlignLeft, Briefcase, Mic, FileText, ArrowRight, Sparkles } from 'lucide-react';

export const ACTIONS = [
    { id: 'analyze', label: 'Job Fit Analysis', icon: Zap, color: '#f59e0b', desc: "Match skills to market" },
    { id: 'summary', label: 'Executive Summary', icon: AlignLeft, color: '#3b82f6', desc: "Professional bio writing" },
    { id: 'enhance', label: 'Enhance Resume', icon: Briefcase, color: '#10b981', desc: "Tailor for specific role" },
    { id: 'interview', label: 'Interview Prep', icon: Mic, color: '#8b5cf6', desc: "Mock questions & tips" },
    { id: 'cover', label: 'Cover Letter', icon: FileText, color: '#ec4899', desc: "Strategy & drafting" },
    { id: 'jobs', label: 'Job Scout', icon: Briefcase, color: '#14b8a6', desc: "Agentic Job Search" },
];

const DashboardGrid = ({ onSelect }) => {
    return (
        <div>
            <div style={{ marginBottom: '3rem' }}>
                <h3 style={{
                    marginBottom: '1.5rem',
                    fontWeight: '700',
                    fontSize: '1.2rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <Sparkles size={20} color="#22d3ee" />
                    Quick Essentials
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                    {ACTIONS.filter(a => !['jobs', 'interview'].includes(a.id)).map(action => (
                        <div
                            key={action.id}
                            onClick={() => onSelect(action.id)}
                            className="glass-panel"
                            style={{
                                padding: '1.5rem',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                borderRadius: '24px',
                                border: '1px solid rgba(6, 182, 212, 0.3)',
                                background: 'linear-gradient(145deg, rgba(6, 182, 212, 0.15), rgba(37, 99, 235, 0.15))',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 0 20px rgba(6, 182, 212, 0.15)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                                e.currentTarget.style.background = 'linear-gradient(145deg, rgba(6, 182, 212, 0.25), rgba(37, 99, 235, 0.25))';
                                e.currentTarget.style.boxShadow = '0 0 30px rgba(6, 182, 212, 0.3)';
                                e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.6)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.background = 'linear-gradient(145deg, rgba(6, 182, 212, 0.15), rgba(37, 99, 235, 0.15))';
                                e.currentTarget.style.boxShadow = '0 0 20px rgba(6, 182, 212, 0.15)';
                                e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ padding: '0.8rem', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '14px', border: '1px solid rgba(6, 182, 212, 0.2)', boxShadow: '0 0 10px rgba(6, 182, 212, 0.1)' }}>
                                    <action.icon size={26} color="#22d3ee" />
                                </div>
                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <ArrowRight size={14} color="#a5f3fc" />
                                </div>
                            </div>

                            <div>
                                <h4 style={{ margin: '0 0 0.3rem', color: '#e0f2fe', fontWeight: '700', fontSize: '1.1rem', textShadow: '0 0 10px rgba(6, 182, 212, 0.3)' }}>{action.label}</h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#bae6fd' }}>{action.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 style={{
                    marginBottom: '1.5rem',
                    fontWeight: '800',
                    fontSize: '1.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    background: 'linear-gradient(to right, #34d399, #3b82f6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    <Zap size={24} color="#34d399" fill="#34d399" />
                    Agentic Deep Research
                    <span style={{ fontSize: '0.8rem', background: 'rgba(52, 211, 153, 0.2)', color: '#34d399', padding: '0.2rem 0.6rem', borderRadius: '12px', border: '1px solid rgba(52, 211, 153, 0.3)', verticalAlign: 'middle' }}>LIVE WEB</span>
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {ACTIONS.filter(a => ['jobs', 'interview'].includes(a.id)).map(action => (
                        <div
                            key={action.id}
                            onClick={() => onSelect(action.id)}
                            className="glass-panel"
                            style={{
                                padding: '1.8rem',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                borderRadius: '24px',
                                border: '1px solid rgba(52, 211, 153, 0.3)',
                                transition: 'all 0.3s ease',
                                background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.1), rgba(6, 78, 59, 0.4))',
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: '0 10px 30px -10px rgba(16, 185, 129, 0.3)'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(16, 185, 129, 0.5)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 10px 30px -10px rgba(16, 185, 129, 0.3)'; }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ padding: '1rem', background: 'rgba(52, 211, 153, 0.2)', borderRadius: '16px', boxShadow: '0 0 15px rgba(52, 211, 153, 0.2)' }}>
                                    <action.icon size={32} color="#34d399" />
                                </div>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <ArrowRight size={18} color="white" />
                                </div>
                            </div>

                            <div style={{ marginTop: '0.5rem' }}>
                                <h4 style={{ margin: '0 0 0.4rem', color: 'white', fontWeight: '800', fontSize: '1.4rem' }}>{action.label}</h4>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#d1fae5', lineHeight: '1.5' }}>{action.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardGrid;
