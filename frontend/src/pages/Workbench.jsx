import React, { useRef, useState, useEffect } from 'react';
import { useChat } from '../hooks/useChat.js';
import { Upload, Zap, AlignLeft, Briefcase, Mic, FileText, ArrowRight, X, Bot, Sparkles, RefreshCw, Square } from 'lucide-react';
import ChatContainer from '../components/chat/ChatContainer';

const Workbench = () => {
    const { resumeText, handleUpload, fileName, setResumeText, setFileName, handleAction, loadingTasks, activeTab, setActiveTab, messages, messagesByTab, clearChat, stopAction } = useChat();
    const fileInputRef = useRef(null);
    const [inputText, setInputText] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [heroIndex, setHeroIndex] = useState(0);
    const [showGuide, setShowGuide] = useState(false);
    const [roleInput, setRoleInput] = useState('');
    const [companyInput, setCompanyInput] = useState('');
    const [jobTypeInput, setJobTypeInput] = useState('');
    const [experienceInput, setExperienceInput] = useState('');
    const [isActiveAgentic, setIsActiveAgentic] = useState(false);

    const [showChat, setShowChat] = useState(false);

    const onFileChange = (e) => {
        if (e.target.files?.[0]) handleUpload(e.target.files[0]);
    };


    useEffect(() => {
        const interval = setInterval(() => {
            setHeroIndex((prev) => (prev + 1) % 4);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const heroPhrases = [
        "Make your resume better...",
        "Apply for this role...",
        "Draft the perfect cover letter...",
        "Ace your interview..."
    ];

    const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const onDragLeave = () => { setIsDragging(false); };
    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files?.[0]) handleUpload(e.dataTransfer.files[0]);
    };

    const resetSession = () => {
        setResumeText('');
        setFileName('');
        setInputText('');
        setActiveTab('dashboard');
    };


    const actions = [
        { id: 'analyze', label: 'Job Fit Analysis', icon: Zap, color: '#f59e0b', desc: "Match skills to market" },
        { id: 'summary', label: 'Executive Summary', icon: AlignLeft, color: '#3b82f6', desc: "Professional bio writing" },
        { id: 'enhance', label: 'Enhance Resume', icon: Briefcase, color: '#10b981', desc: "Tailor for specific role" },
        { id: 'interview', label: 'Interview Prep', icon: Mic, color: '#8b5cf6', desc: "Mock questions & tips" },
        { id: 'cover', label: 'Cover Letter', icon: FileText, color: '#ec4899', desc: "Strategy & drafting" },
        { id: 'jobs', label: 'Job Scout', icon: Briefcase, color: '#14b8a6', desc: "Agentic Job Search" },
    ];

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-family)', background: 'var(--bg-color)', backgroundImage: 'var(--bg-gradient)' }}>


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

            {/* Main Content Area with Sidebar */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

                {/* LEFT PANEL: Work Area */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto', flex: 1, display: 'flex', flexDirection: 'column' }}>

                        {!resumeText ? (
                            <div className="animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ textAlign: 'center', marginBottom: '3rem', minHeight: '180px' }}>
                                    <h2 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1rem', color: 'white', lineHeight: 1.2 }}>
                                        AI that helps you <br />
                                        <span style={{
                                            background: 'linear-gradient(to right, #6366f1, #a855f7)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            display: 'inline-block',
                                            animation: 'fadeIn 0.5s ease'
                                        }} key={heroIndex}>
                                            {heroPhrases[heroIndex]}
                                        </span>
                                    </h2>
                                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Upload your resume to get started.</p>
                                </div>

                                <div
                                    onClick={() => fileInputRef.current.click()}
                                    onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
                                    className="snap-pill"
                                    style={{
                                        width: '100%', maxWidth: '600px', padding: '4rem',
                                        border: isDragging ? '2px dashed var(--accent)' : '2px dashed rgba(255,255,255,0.1)',
                                        background: isDragging ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.02)',
                                        borderRadius: '32px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    <input type="file" ref={fileInputRef} onChange={onFileChange} style={{ display: 'none' }} accept=".pdf,.txt,.md,.jpg,.jpeg,.png" />
                                    <div style={{ padding: '1.5rem', background: 'var(--card-bg)', borderRadius: '50%' }}><Upload size={40} color="var(--accent)" /></div>
                                    <div style={{ textAlign: 'center' }}>
                                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>Upload Document</h3>
                                        <p style={{ color: 'var(--text-secondary)' }}>PDF, TXT, MD, JPG, PNG supported</p>
                                    </div>
                                </div>

                                <div style={{ margin: '2rem 0', opacity: 0.5 }}>OR</div>

                                <div style={{ width: '100%', maxWidth: '600px', position: 'relative' }}>
                                    <textarea
                                        value={inputText} onChange={(e) => setInputText(e.target.value)}
                                        placeholder="Paste resume text here to start..."
                                        rows={3}
                                        style={{ width: '100%', padding: '1.5rem', paddingBottom: '3.5rem', borderRadius: '20px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white', fontSize: '1rem', outline: 'none' }}
                                    />
                                    <button
                                        onClick={() => { setResumeText(inputText); setFileName("Raw Text Input"); setActiveTab('dashboard'); }}
                                        disabled={inputText.length < 10}
                                        className="snap-pill"
                                        style={{
                                            position: 'absolute',
                                            bottom: '1rem',
                                            right: '1rem',
                                            padding: '0.6rem 1.5rem',
                                            background: inputText.length < 10 ? 'rgba(255,255,255,0.1)' : 'var(--accent)',
                                            border: 'none',
                                            color: inputText.length < 10 ? 'rgba(255,255,255,0.3)' : 'white',
                                            cursor: inputText.length < 10 ? 'not-allowed' : 'pointer',
                                            fontWeight: '600',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        Start Session
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-slide-up" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                {activeTab === 'dashboard' ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                                        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '24px', background: 'rgba(255,255,255,0.03)', height: '220px', display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem', color: '#94a3b8' }}>
                                                <FileText size={20} color="var(--accent)" />
                                                <span style={{ fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Resume Context</span>
                                            </div>
                                            <div style={{ flex: 1, overflowY: 'auto', fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.6', background: 'rgba(0,0,0,0.2)', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{resumeText ? (resumeText.length > 800 ? resumeText.slice(0, 800) + '...' : resumeText) : 'No resume loaded.'}</p>
                                            </div>
                                        </div>

                                        {/* 2. DASHBOARD ACTIONS GRID */}
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
                                                    {actions.filter(a => !['jobs', 'interview'].includes(a.id)).map(action => (
                                                        <div
                                                            key={action.id}
                                                            onClick={() => setActiveTab(action.id)}
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
                                                    {actions.filter(a => ['jobs', 'interview'].includes(a.id)).map(action => (
                                                        <div
                                                            key={action.id}
                                                            onClick={() => setActiveTab(action.id)}
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
                                    </div>
                                ) : (
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

                                        {['enhance', 'interview', 'cover', 'jobs'].includes(activeTab) && (
                                            <div className="glass-panel" style={{ marginBottom: '1.5rem', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(30, 41, 59, 0.4)' }}>
                                                <h4 style={{ color: '#94a3b8', margin: '0 0 1rem 0', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                    {activeTab === 'jobs' ? 'Search Parameters' : 'Target Context (Required)'}
                                                </h4>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                    <input
                                                        type="text"
                                                        placeholder="Target Role (e.g. Senior PM)"
                                                        value={roleInput}
                                                        onChange={(e) => setRoleInput(e.target.value)}
                                                        style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }}
                                                    />

                                                    {['enhance', 'interview', 'cover'].includes(activeTab) && (
                                                        <input
                                                            type="text"
                                                            placeholder="Target Company (e.g. Google)"
                                                            value={companyInput}
                                                            onChange={(e) => setCompanyInput(e.target.value)}
                                                            style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }}
                                                        />
                                                    )}

                                                    {activeTab === 'jobs' && (
                                                        <>
                                                            <input
                                                                type="text"
                                                                placeholder="Preferred Location (e.g. Remote, NY)"
                                                                value={companyInput}
                                                                onChange={(e) => setCompanyInput(e.target.value)}
                                                                style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }}
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder="Experience (e.g. 5+ years)"
                                                                value={experienceInput}
                                                                onChange={(e) => setExperienceInput(e.target.value)}
                                                                style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }}
                                                            />
                                                            <select
                                                                value={jobTypeInput}
                                                                onChange={(e) => setJobTypeInput(e.target.value)}
                                                                style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }}
                                                            >
                                                                <option value="" disabled>Job Type (Any)</option>
                                                                <option value="Remote">Remote</option>
                                                                <option value="On-site">On-site</option>
                                                                <option value="Hybrid">Hybrid</option>
                                                                <option value="Contract">Contract</option>
                                                            </select>
                                                        </>
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
                                                        activeTab === 'interview' ? 'interview-agentic' : activeTab,
                                                        {
                                                            text: resumeText,
                                                            role: roleInput || null,
                                                            company: companyInput || null,
                                                            jobType: jobTypeInput || null,
                                                            experienceLevel: experienceInput || null
                                                        }
                                                    )}
                                                    disabled={loadingTasks[activeTab] || (['enhance', 'interview', 'cover'].includes(activeTab) && (!roleInput || !companyInput)) || (activeTab === 'jobs' && !roleInput)}
                                                    className="snap-pill"
                                                    style={{
                                                        padding: '0.8rem 2rem',
                                                        background: (loadingTasks[activeTab] || (['enhance', 'interview', 'cover'].includes(activeTab) && (!roleInput || !companyInput)) || (activeTab === 'jobs' && !roleInput)) ? 'rgba(255,255,255,0.1)' : 'var(--accent)',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '12px',
                                                        cursor: (loadingTasks[activeTab] || (['enhance', 'interview', 'cover'].includes(activeTab) && (!roleInput || !companyInput)) || (activeTab === 'jobs' && !roleInput)) ? 'not-allowed' : 'pointer',
                                                        fontWeight: '700',
                                                        fontSize: '1rem',
                                                        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                                                        opacity: (loadingTasks[activeTab] || (['enhance', 'interview', 'cover'].includes(activeTab) && (!roleInput || !companyInput)) || (activeTab === 'jobs' && !roleInput)) ? 0.5 : 1,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem'
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
                                )
                                }

                                <div style={{ padding: '1.5rem', textAlign: 'center', borderTop: '1px solid var(--glass-border)', color: '#64748b', fontSize: '0.9rem', marginTop: 'auto' }}>
                                    © 2025 Career Atlas. All rights reserved.
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* FLOATING CHAT WIDGET */}
                <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>

                    {/* Chat Window */}
                    {showChat && (
                        <div className="animate-slide-up" style={{
                            width: '400px',
                            height: '600px',
                            maxHeight: 'calc(100vh - 120px)',
                            background: 'var(--card-bg)',
                            borderRadius: '24px',
                            border: '1px solid rgba(255,255,255,0.15)',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(20px)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            marginBottom: '0.5rem'
                        }}>
                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Bot size={18} color="var(--accent)" /> Atlas Assistant
                                    </h3>
                                    <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem', marginLeft: '1.6rem', marginTop: '0.2rem' }}>
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 5px #10b981' }}></span> Online
                                    </span>
                                </div>
                                <button onClick={() => setShowChat(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                                    <X size={18} />
                                </button>
                            </div>
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                <ChatContainer
                                    showInput={true}
                                    messages={messagesByTab['ai-assistant']}
                                    isLoading={loadingTasks['ai-assistant']}
                                    onSend={(text) => handleAction('ai-assistant', { text })}
                                    suggestions={[
                                        "How do I improve my resume?",
                                        "Analyze my job fit",
                                        "Prepare for an interview",
                                        "Find remote jobs"
                                    ]}
                                />
                            </div>
                        </div>
                    )}

                    {/* Toggle Button (FAB) */}
                    <button
                        onClick={() => setShowChat(!showChat)}
                        className="animate-bounce"
                        style={{
                            minWidth: showChat ? '60px' : 'auto',
                            padding: showChat ? '0' : '0 1.5rem',
                            height: '60px',
                            borderRadius: '30px',
                            background: showChat ? '#ef4444' : 'var(--accent)',
                            border: '4px solid rgba(0,0,0,0.2)',
                            boxShadow: '0 10px 25px rgba(59, 130, 246, 0.5)',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.8rem',
                            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            transform: 'rotate(0deg)'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = `scale(1.05)`; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = `scale(1)`; }}
                    >
                        {showChat ? <X size={28} /> : (
                            <>
                                <Bot size={28} fill="white" />
                                <span style={{ fontWeight: '700', fontSize: '1rem', whiteSpace: 'nowrap' }}>AI Assistant</span>
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div >
    );
};

export default Workbench;
