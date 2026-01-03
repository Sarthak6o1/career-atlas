import React, { useState, useEffect } from 'react';
import { useChat } from '../hooks/useChat.js';
import { logout } from '../services/authService';
import { Zap, FileText, ArrowRight, RefreshCw, Square, Upload } from 'lucide-react';
import ChatContainer from '../components/chat/ChatContainer';
import { clearChatHistory, updateSessionContext } from '../services/chatService.js';

// Modular Components
import LandingView from '../components/workbench/LandingView';
import DashboardGrid, { ACTIONS } from '../components/workbench/DashboardGrid';
import FloatingAssistant from '../components/workbench/FloatingAssistant';
import WorkbenchHeader from '../components/workbench/WorkbenchHeader';
import SessionSidebar from '../components/workbench/SessionSidebar';
import SavedJobs from '../components/workbench/SavedJobs';

const Workbench = () => {
    const { resumeText, handleUpload, setResumeText, setFileName, handleAction, loadingTasks, activeTab, setActiveTab, messagesByTab, clearChat, stopAction, uploadProgress, isRestoring, sessions, currentSessionId, loadSession, createNewSession, deleteSession, isUploading, refreshContext } = useChat();

    // Theme State
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        if (refreshContext) refreshContext();
    }, []);

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    // Filter Inputs (kept here as they control the active tool execution)
    const [roleInput, setRoleInput] = useState('');
    const [companyInput, setCompanyInput] = useState('');
    const [jobTypeInput, setJobTypeInput] = useState('');
    const [experienceInput, setExperienceInput] = useState('');

    const handleTextSubmit = (text) => {
        setResumeText(text);
        setFileName("Raw Text Input");
        setActiveTab('dashboard');
    };

    const actions = ACTIONS;

    if (isRestoring) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', backgroundImage: 'var(--bg-gradient)', color: 'white' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <RefreshCw size={32} className="animate-spin" color="var(--accent)" />
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', letterSpacing: '0.5px' }}>RESTORING SESSION...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-family)', background: 'var(--bg-color)', backgroundImage: 'var(--bg-gradient)' }}>

            {/* HEADER */}
            <WorkbenchHeader
                theme={theme}
                toggleTheme={toggleTheme}
                createNewSession={createNewSession}
                setActiveTab={setActiveTab}
                logout={logout}
                currentSessionId={currentSessionId}
            />

            {/* MAIN CONTENT */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

                {/* SESSION SIDEBAR */}
                <SessionSidebar
                    sessions={sessions}
                    currentSessionId={currentSessionId}
                    loadSession={loadSession}
                    setActiveTab={setActiveTab}
                />

                <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto', flex: 1, display: 'flex', flexDirection: 'column' }}>

                        {((isUploading || !resumeText) && activeTab === 'dashboard') ? (
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
                                        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '24px', background: 'var(--card-bg)', height: '220px', display: 'flex', flexDirection: 'column', border: '1px solid var(--glass-border)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                                                <FileText size={20} color="var(--accent)" />
                                                <span style={{ fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Resume Context</span>
                                            </div>
                                            <div style={{ flex: 1, overflowY: 'auto', fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.6', background: 'var(--bg-color)', padding: '1.2rem', borderRadius: '16px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {resumeText ? (
                                                    <p style={{ margin: 0, whiteSpace: 'pre-wrap', width: '100%', textAlign: 'left' }}>{resumeText.length > 800 ? resumeText.slice(0, 800) + '...' : resumeText}</p>
                                                ) : (
                                                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                                                        <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>No resume text found in this session.</p>
                                                        <label style={{
                                                            background: 'var(--accent)',
                                                            color: 'white',
                                                            padding: '0.6rem 1.2rem',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer',
                                                            fontWeight: '600',
                                                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                                            transition: 'transform 0.2s',
                                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                                        }}>
                                                            <Upload size={16} /> Upload Resume to Session
                                                            <input type="file" hidden onChange={(e) => handleUpload(e.target.files[0])} accept=".pdf,.docx,.txt,.md,.png,.jpg" />
                                                        </label>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <DashboardGrid onSelect={(id) => {
                                            console.log("Selecting Tool:", id);
                                            setActiveTab(id);
                                            localStorage.setItem('activeTab', id);
                                        }} />
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

                                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                                                {actions.find(a => a.id === activeTab)?.label}
                                            </h2>
                                        </div>

                                        {activeTab === 'saved-jobs' ? (
                                            <SavedJobs />
                                        ) : (
                                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                                {['tailor', 'cover', 'interview-agentic', 'jobs', 'enhance'].includes(activeTab) && (
                                                    <div className="glass-panel" style={{ marginBottom: '1.5rem', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--glass-border)', background: 'var(--card-bg)' }}>
                                                        <h4 style={{ color: 'var(--text-secondary)', margin: '0 0 1rem 0', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
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
                                                                        background: 'var(--bg-color)',
                                                                        border: '1px solid var(--glass-border)',
                                                                        color: 'var(--text-primary)',
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
                                                                    style={{ padding: '1rem', borderRadius: '12px', background: 'var(--bg-color)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', outline: 'none' }}
                                                                />
                                                            )}

                                                            {['cover', 'interview-agentic', 'enhance'].includes(activeTab) && (
                                                                <input
                                                                    type="text"
                                                                    placeholder="Target Company (e.g. Google)"
                                                                    value={companyInput}
                                                                    onChange={(e) => setCompanyInput(e.target.value)}
                                                                    style={{ padding: '1rem', borderRadius: '12px', background: 'var(--bg-color)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', outline: 'none' }}
                                                                />
                                                            )}

                                                            {activeTab === 'jobs' && (
                                                                <input
                                                                    type="text"
                                                                    placeholder="Location (e.g. Remote, NY)"
                                                                    value={companyInput}
                                                                    onChange={(e) => setCompanyInput(e.target.value)}
                                                                    style={{ padding: '1rem', borderRadius: '12px', background: 'var(--bg-color)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', outline: 'none' }}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* ACTION BAR: Clear, Stop, Generate Together */}
                                                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                                                    <button
                                                        onClick={() => clearChat(activeTab)}
                                                        style={{
                                                            background: 'transparent',
                                                            border: '1px solid var(--glass-border)',
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
                                                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--glass-border)'; e.currentTarget.style.color = '#ef4444'; }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
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
                        )}
                    </div>
                </div>
            </div>

            <FloatingAssistant
                messages={messagesByTab['ai-assistant'] || []}
                isLoading={loadingTasks[currentSessionId]?.['ai-assistant'] || false}
                onSend={(text) => handleAction('ai-assistant', { text })}
            />
        </div>
    );
};

export default Workbench;
