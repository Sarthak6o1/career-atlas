import React, { useState } from 'react';
import { useChat } from '../hooks/useChat.js';
import { Zap, Mic, FileText, ArrowRight, X, RefreshCw, Square } from 'lucide-react';
import ChatContainer from '../components/chat/ChatContainer';

// Modular Components
import LandingView from '../components/workbench/LandingView';
import DashboardGrid, { ACTIONS } from '../components/workbench/DashboardGrid';
import FloatingAssistant from '../components/workbench/FloatingAssistant';

const Workbench = () => {
    const { resumeText, handleUpload, setResumeText, setFileName, handleAction, loadingTasks, activeTab, setActiveTab, messagesByTab, clearChat, stopAction, uploadProgress } = useChat();

    // Filter Inputs (kept here as they control the active tool execution)
    const [roleInput, setRoleInput] = useState('');
    const [companyInput, setCompanyInput] = useState('');
    const [jobTypeInput, setJobTypeInput] = useState('');
    const [experienceInput, setExperienceInput] = useState('');

    const resetSession = () => {
        setResumeText('');
        setFileName('');
        setRoleInput('');
        setCompanyInput('');
        setActiveTab('dashboard');
    };

    const handleTextSubmit = (text) => {
        setResumeText(text);
        setFileName("Raw Text Input");
        setActiveTab('dashboard');
    };

    const actions = ACTIONS; // Alias for existing logic

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-family)', background: 'var(--bg-color)', backgroundImage: 'var(--bg-gradient)' }}>

            {/* HEADER */}
            <div style={{ padding: '1.5rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(10px)' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.8rem', margin: 0 }}>
                    <div style={{ padding: '0.5rem', background: 'white', borderRadius: '8px', display: 'flex' }}><Zap size={20} color="black" fill="black" /></div>
                    <span style={{ background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Career Atlas</span>
                </h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    {resumeText && (
                        <button onClick={resetSession} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                            <X size={16} /> New Upload
                        </button>
                    )}
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto', flex: 1, display: 'flex', flexDirection: 'column' }}>

                        {!resumeText ? (
                            <LandingView
                                onUpload={handleUpload}
                                uploadProgress={uploadProgress}
                                onTextSubmit={handleTextSubmit}
                            />
                        ) : (
                            <div className="animate-slide-up" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                {activeTab === 'dashboard' ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                                        {/* Resume Context Card */}
                                        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '24px', background: 'rgba(255,255,255,0.03)', height: '220px', display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem', color: '#94a3b8' }}>
                                                <FileText size={20} color="var(--accent)" />
                                                <span style={{ fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Resume Context</span>
                                            </div>
                                            <div style={{ flex: 1, overflowY: 'auto', fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.6', background: 'rgba(0,0,0,0.2)', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{resumeText ? (resumeText.length > 800 ? resumeText.slice(0, 800) + '...' : resumeText) : 'No resume loaded.'}</p>
                                            </div>
                                        </div>

                                        <DashboardGrid onSelect={setActiveTab} />
                                    </div>
                                ) : (
                                    /* ACTIVE TOOL VIEW */
                                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
                                        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <button
                                                onClick={() => setActiveTab('dashboard')}
                                                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: '500' }}
                                            >
                                                <ArrowRight size={20} style={{ transform: 'rotate(180deg)' }} /> Back to Tools
                                            </button>

                                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', margin: 0 }}>
                                                {actions.find(a => a.id === activeTab)?.label}
                                            </h2>
                                        </div>

                                        {['tailor', 'cover', 'interview-agentic', 'jobs', 'enhance'].includes(activeTab) && (
                                            <div className="glass-panel" style={{ marginBottom: '1.5rem', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(30, 41, 59, 0.4)' }}>
                                                <h4 style={{ color: '#94a3b8', margin: '0 0 1rem 0', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                    {activeTab === 'jobs' ? 'Search Parameters' :
                                                        activeTab === 'tailor' ? 'Job Description (Required)' :
                                                            'Target Context (Required)'}
                                                </h4>

                                                <div style={{ display: 'grid', gridTemplateColumns: activeTab === 'tailor' ? '1fr' : '1fr 1fr', gap: '1rem' }}>

                                                    {activeTab === 'tailor' ? (
                                                        <textarea
                                                            placeholder="Paste the full Job Description here..."
                                                            value={roleInput}
                                                            onChange={(e) => setRoleInput(e.target.value)}
                                                            rows={6}
                                                            style={{
                                                                padding: '1rem',
                                                                borderRadius: '12px',
                                                                background: 'rgba(0,0,0,0.3)',
                                                                border: '1px solid var(--glass-border)',
                                                                color: 'white',
                                                                outline: 'none',
                                                                resize: 'vertical',
                                                                width: '100%',
                                                                fontFamily: 'inherit'
                                                            }}
                                                        />
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            placeholder={activeTab === 'jobs' ? 'Job Title / Keywords' : "Target Role (e.g. Senior PM)"}
                                                            value={roleInput}
                                                            onChange={(e) => setRoleInput(e.target.value)}
                                                            style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }}
                                                        />
                                                    )}

                                                    {['cover', 'interview-agentic', 'enhance'].includes(activeTab) && (
                                                        <input
                                                            type="text"
                                                            placeholder="Target Company (e.g. Google)"
                                                            value={companyInput}
                                                            onChange={(e) => setCompanyInput(e.target.value)}
                                                            style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }}
                                                        />
                                                    )}

                                                    {activeTab === 'jobs' && (
                                                        <input
                                                            type="text"
                                                            placeholder="Location (e.g. Remote, NY)"
                                                            value={companyInput}
                                                            onChange={(e) => setCompanyInput(e.target.value)}
                                                            style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* ACTION BAR: Clear, Stop, Generate Together */}
                                        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '16px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                                            <button
                                                onClick={() => clearChat(activeTab)}
                                                style={{
                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    borderRadius: '12px',
                                                    padding: '0.8rem 1.2rem',
                                                    color: 'var(--text-secondary)',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    transition: 'all 0.2s',
                                                    fontWeight: '600'
                                                }}
                                                title="Clear Chat History"
                                                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.color = '#ef4444'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                                            >
                                                <RefreshCw size={18} /> Clear Chat
                                            </button>

                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                {loadingTasks[activeTab] && (
                                                    <button
                                                        onClick={() => stopAction(activeTab)}
                                                        className="animate-fade-in"
                                                        style={{
                                                            padding: '0.8rem 1.5rem',
                                                            background: '#ef4444',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '12px',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.5rem',
                                                            fontWeight: '700'
                                                        }}
                                                    >
                                                        <Square size={16} fill="white" /> Stop
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => handleAction(
                                                        activeTab,
                                                        {
                                                            text: resumeText,
                                                            role: roleInput || null,
                                                            company: companyInput || null, // For Jobs: Location; For others: Company
                                                            jobType: jobTypeInput || null,
                                                            experienceLevel: experienceInput || null // For Jobs: Date Posted
                                                        }
                                                    )}
                                                    disabled={
                                                        loadingTasks[activeTab] ||
                                                        (['cover', 'interview-agentic', 'enhance'].includes(activeTab) && (!roleInput || !companyInput)) ||
                                                        (activeTab === 'tailor' && !roleInput) ||
                                                        (activeTab === 'jobs' && !roleInput)
                                                    }
                                                    className="snap-pill"
                                                    style={{
                                                        padding: '0.8rem 2rem',
                                                        background: 'var(--accent)',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '12px',
                                                        cursor: 'pointer',
                                                        fontWeight: '700',
                                                        fontSize: '1rem',
                                                        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                                                        opacity: 1,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        filter: (loadingTasks[activeTab] ||
                                                            (['cover', 'interview-agentic', 'enhance'].includes(activeTab) && (!roleInput || !companyInput)) ||
                                                            (activeTab === 'tailor' && !roleInput) ||
                                                            (activeTab === 'jobs' && !roleInput)) ? 'grayscale(100%) opacity(0.5)' : 'none'
                                                    }}
                                                >
                                                    {loadingTasks[activeTab] ? "Processing..." : (
                                                        <><Zap size={18} fill="white" /> Run {actions.find(a => a.id === activeTab)?.label}</>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                            {messagesByTab[activeTab]?.length > 0 ? (
                                                <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                                    <ChatContainer
                                                        showInput={false}
                                                        messages={messagesByTab[activeTab]}
                                                        isLoading={loadingTasks[activeTab]}
                                                    />
                                                </div>
                                            ) : (
                                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '24px', background: 'rgba(0,0,0,0.1)' }}>
                                                    <p>Results will appear here...</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div style={{ padding: '1.5rem', textAlign: 'center', borderTop: '1px solid var(--glass-border)', color: '#64748b', fontSize: '0.9rem', marginTop: 'auto' }}>
                                    © 2025 Career Atlas. All rights reserved.
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                <FloatingAssistant
                    messages={messagesByTab['ai-assistant']}
                    isLoading={loadingTasks['ai-assistant']}
                    onSend={(text) => handleAction('ai-assistant', { text })}
                />
            </div>
        </div>
    );
};

export default Workbench;
