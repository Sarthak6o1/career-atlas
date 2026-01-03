import React, { createContext, useState, useEffect, useRef } from 'react';
import {
    analyzeJobFit,
    generateSummary,
    enhanceResume,
    generateInterview,
    generateCoverLetter,
    uploadResume,
    chatAiAssistant,
    findJobs,
    generateAgenticInterview,
    tailorResume,
    fetchChatHistory,
    persistMessage,
    auditResume,
    fetchSessions,
    deleteSession,
    updateSessionContext,
    fetchSessionDetails
} from '../services/chatService.js';
import { getProfile, isAuthenticated } from '../services/authService.js';
import { v4 as uuidv4 } from 'uuid';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    // Initial message state
    const [messagesByTab, setMessagesByTab] = useState({
        dashboard: [{ id: 'welcome', role: 'assistant', content: "Hi! Welcome to **Career Atlas**. I'm your AI-Guide. Upload a resume or select a tool to get started!", timestamp: new Date() }],
        audit: [],
        analyze: [],
        tailor: [],
        'interview-agentic': [],
        cover: [],
        jobs: [],
        'ai-assistant': []
    });

    const [loadingTasks, setLoadingTasks] = useState({});
    const [resumeText, setResumeText] = useState('');
    const [fileName, setFileName] = useState('');
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [sessions, setSessions] = useState([]);

    // Lazy initialize activeTab from localStorage or Hash
    const [activeTab, setActiveTab] = useState(() => {
        const hash = window.location.hash.replace('#', '');
        return hash || localStorage.getItem('activeTab') || 'dashboard';
    });

    const [uploadProgress, setUploadProgress] = useState(0);
    const [isRestoring, setIsRestoring] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    const messages = messagesByTab[activeTab] || [];

    // Persist Tab Selection
    // Persist Tab Selection (Handled by lazy init)



    const handleTabChange = (tab) => {
        setActiveTab(tab);
        localStorage.setItem('activeTab', tab);

        // Hash Routing
        const newHash = tab === 'dashboard' ? '' : `#${tab}`;
        if (window.location.hash !== newHash) {
            window.history.pushState(null, '', newHash || window.location.pathname);
        }
    };

    // Listen for Back Button
    useEffect(() => {
        const handlePopState = () => {
            const hash = window.location.hash.replace('#', '');
            const target = hash || 'dashboard';
            setActiveTab(target);
            localStorage.setItem('activeTab', target);
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const addMessage = (role, content, type = 'text', targetTab = activeTab, sources = [], explicitSessionId = undefined) => {
        const targetSid = (explicitSessionId !== undefined) ? explicitSessionId : currentSessionId;

        const newMessage = {
            id: uuidv4(),
            role,
            content,
            type,
            tab: targetTab,
            timestamp: new Date(),
            sources
        };

        // Only update UI if the message belongs to the active session
        // This prevents "leakage" where a background task from Session A displays in Session B
        if (targetSid === currentSessionId) {
            setMessagesByTab(prev => ({
                ...prev,
                [targetTab]: [
                    ...(prev[targetTab] || []),
                    newMessage
                ]
            }));
        }

        // Persist to Backend
        if (isAuthenticated()) {
            persistMessage({
                role,
                content,
                type,
                tab: targetTab,
                sources,
                session_id: targetSid
            }).then(res => {
                // If we started a fresh session and are still on it, update the ID
                if (res.data.session_id && !currentSessionId && targetSid === currentSessionId) {
                    setCurrentSessionId(res.data.session_id);
                    fetchSessions().then(setSessions).catch(console.error);
                }
            }).catch(err => console.error("Failed to save message", err));
        }
    };



    const loadSession = async (sessionId) => {
        setIsRestoring(true);
        setIsUploading(false);
        setCurrentSessionId(sessionId);
        setResumeText('');
        setFileName('');

        try {
            const sessionData = await fetchSessionDetails(sessionId);

            if (sessionData.resume_text) setResumeText(sessionData.resume_text);
            if (sessionData.filename) setFileName(sessionData.filename);

            // Reset State
            setMessagesByTab({
                dashboard: [{ id: uuidv4(), role: 'assistant', content: "Session Restored.", timestamp: new Date() }],
                audit: [], analyze: [], tailor: [], 'interview-agentic': [], cover: [], jobs: [], 'ai-assistant': []
            });

            const history = sessionData.messages || [];
            if (history.length > 0) {
                setMessagesByTab(prev => {
                    const newState = { ...prev };
                    history.forEach(msg => {
                        if (!newState[msg.tab]) newState[msg.tab] = [];
                        newState[msg.tab].push(msg);
                    });
                    return newState;
                });
            }
        } catch (e) {
            console.error("Failed to load session", e);
        } finally {
            setIsRestoring(false);
        }
    };

    const createNewSession = () => {
        setCurrentSessionId(null);
        setResumeText('');
        setFileName('');
        setIsUploading(true);
        setMessagesByTab({
            dashboard: [{ id: uuidv4(), role: 'assistant', content: "Started a **New Session**.", timestamp: new Date() }],
            audit: [], analyze: [], tailor: [], 'interview-agentic': [], cover: [], jobs: [], 'ai-assistant': []
        });
    };

    const removeSession = async (sessionId) => {
        if (!sessionId) return;
        console.log("Removing session:", sessionId);

        setSessions(prev => prev.filter(s => s.id !== sessionId));

        if (currentSessionId === sessionId) {
            createNewSession();
        }
        try {
            await deleteSession(sessionId);
            console.log("Session deleted from backend.");
        } catch (error) {
            console.error("Failed to delete session", error);
            fetchSessions().then(setSessions);
            throw error;
        }
    };

    const loadUserContext = async () => {
        if (isAuthenticated()) {
            let profileData = null;

            // 1. Get Profile
            try {
                const profile = await getProfile();
                profileData = profile;
                if (profile.resume_text) {
                    setResumeText(profile.resume_text);
                    setFileName(profile.resume_filename || 'Restored Resume');
                }
            } catch (error) {
                console.error("Failed to load user profile", error);
            }

            // 2. Get Chat History
            try {
                const sessList = await fetchSessions();
                setSessions(sessList);
                let activeId = null;
                if (sessList.length > 0) activeId = sessList[0].id;
                setCurrentSessionId(activeId);

                const history = await fetchChatHistory(activeId);
                if (history && history.length > 0) {
                    setMessagesByTab(prev => {
                        const newState = { ...prev };
                        history.forEach(msg => {
                            if (!newState[msg.tab]) newState[msg.tab] = [];
                            const exists = newState[msg.tab].some(m => m.id === msg.id);
                            if (!exists) {
                                newState[msg.tab].push(msg);
                            }
                        });
                        return newState;
                    });
                } else if (profileData && profileData.resume_text) {
                    setMessagesByTab(prev => {
                        if (prev.dashboard.length <= 1) {
                            return {
                                ...prev,
                                dashboard: [
                                    ...prev.dashboard,
                                    {
                                        id: uuidv4(),
                                        role: 'assistant',
                                        content: `Welcome back, **${profileData.email.split('@')[0]}**! I've restored your active resume context.`,
                                        type: 'text',
                                        timestamp: new Date()
                                    }
                                ]
                            };
                        }
                        return prev;
                    });
                }
            } catch (error) {
                console.error("Failed to load sessions", error);
            } finally {
                const savedTab = localStorage.getItem('activeTab');
                if (savedTab) {
                    setActiveTab(savedTab);
                }
                setIsRestoring(false);
            }
        } else {
            setIsRestoring(false);
        }
    };

    // Load User Data & Chat History on Mount
    useEffect(() => {
        loadUserContext();
    }, []);

    const handleUpload = async (file) => {
        setLoadingTasks(prev => ({ ...prev, upload: true }));
        setUploadProgress(0);
        try {
            const data = await uploadResume(file, (percent) => setUploadProgress(percent));
            setResumeText(data.text);
            setFileName(data.filename);
            setUploadProgress(100);

            setIsUploading(false);

            // Always create a NEW session for a new upload (Store All)
            const targetSid = uuidv4();
            setCurrentSessionId(targetSid);

            updateSessionContext(targetSid, {
                title: data.filename,
                resume_text: data.text,
                filename: data.filename
            }).then(() => fetchSessions().then(setSessions)).catch(console.error);

            // Broadcast success to dashboard
            addMessage('assistant', `Resume **${data.filename}** successfully loaded and saved to your profile.`, 'markdown', 'dashboard');

        } catch (error) {
            addMessage('system', `Failed to upload: ${error.message}`, 'error', 'dashboard');
        } finally {
            setLoadingTasks(prev => ({ ...prev, upload: false }));
            setTimeout(() => setUploadProgress(0), 1000); // Reset after delay
        }
    };

    const activeControllers = useRef({});

    const handleAction = async (action, payload) => {
        let uiTab = action;
        const sessionAtStart = currentSessionId; // Capture Session ID at initiation

        // Only abort ONLY the previous request for THIS specific tab/action
        if (activeControllers.current[uiTab]) {
            activeControllers.current[uiTab].abort();
        }

        const controller = new AbortController();
        activeControllers.current[uiTab] = controller;

        setLoadingTasks(prev => ({
            ...prev,
            [sessionAtStart]: { ...(prev[sessionAtStart] || {}), [uiTab]: true }
        }));

        const labels = {
            audit: "Auditing Resume for Red Flags & Mistakes...",
            analyze: "Running Job Fit Analysis...",
            summary: "Drafting Executive Summary...",
            enhance: "Generating Skill Enhancements...",
            tailor: "Tailoring Resume...",
            cover: "Drafting Cover Letter...",
            'interview-agentic': "Gathering Interview Intelligence...",
            jobs: "Scouting Opportunities..."
        };
        const isChatAction = action === 'dashboard' || action === 'ai-assistant';
        const displayContent = isChatAction ? payload.text : (labels[action] || action);

        // Pass sessionAtStart explicitly to ensure correct thread
        addMessage('user', displayContent, 'text', uiTab, [], sessionAtStart);

        try {
            // Check for abort before starting heavy work
            if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError');

            let result;
            let content = "";
            let sources = [];

            switch (action) {
                case 'audit':
                    result = await auditResume(payload.text, controller.signal);
                    break;
                case 'analyze':
                    result = await analyzeJobFit(payload.text, controller.signal);
                    break;
                case 'summary':
                    result = await generateSummary(payload.text, controller.signal);
                    break;
                case 'enhance':
                    result = await enhanceResume(payload.text, payload.role, payload.company, controller.signal);
                    break;
                case 'tailor':
                    result = await tailorResume(payload.text, payload.role, controller.signal);
                    break;
                case 'cover':
                    result = await generateCoverLetter(payload.text, payload.role, payload.company, controller.signal);
                    break;
                case 'interview-agentic':
                    result = await generateAgenticInterview(payload.text, payload.role, payload.company, controller.signal);
                    break;
                case 'jobs':
                    result = await findJobs(payload.text, payload.role, payload.company, payload.jobType, payload.experienceLevel, controller.signal);
                    break;
                case 'ai-assistant':
                case 'dashboard':
                    result = await chatAiAssistant(payload.text, resumeText, controller.signal);
                    break;
                default:
                    break;
            }

            if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError');

            // Extract content based on result structure
            if (result) {
                if (action === 'analyze') content = result.summary_analysis;
                else if (action === 'summary') content = result.summary_md;
                else if (action === 'enhance') content = result.enhancement_md;
                else if (action === 'tailor') content = result.tailored_content + "\n\n" + result.diff_analysis;
                else if (action === 'cover') content = result.result_md;
                else if (action === 'interview-agentic') content = result.result_md;
                else if (action === 'jobs') content = result.result_md;
                else if (['ai-assistant', 'dashboard'].includes(action)) {
                    content = result.reply;
                    sources = result.sources || [];
                }
            }

            if (content) {
                // Pass sessionAtStart explicitly
                addMessage('assistant', content, 'markdown', uiTab, sources, sessionAtStart);
            }


        } catch (error) {
            if (error.name === 'AbortError') {
                addMessage('system', 'Action stopped by user.', 'info', uiTab, [], sessionAtStart);
            } else {
                addMessage('system', `Error: ${error.message}`, 'error', uiTab, [], sessionAtStart);
            }
        } finally {
            setLoadingTasks(prev => ({
                ...prev,
                [sessionAtStart]: { ...(prev[sessionAtStart] || {}), [uiTab]: false }
            }));
            // Clean up the controller for this tab
            if (activeControllers.current[uiTab] === controller) {
                delete activeControllers.current[uiTab];
            }
        }
    };

    const stopAction = (tabName) => {
        const target = tabName || activeTab; // Default to active tab if no target specified
        if (activeControllers.current[target]) {
            activeControllers.current[target].abort();
            delete activeControllers.current[target];
        }
    };

    const clearChat = (tabName = activeTab) => {
        setMessagesByTab(prev => ({
            ...prev,
            [tabName]: []
        }));
    };

    return (
        <ChatContext.Provider value={{
            messages,
            messagesByTab,
            loadingTasks,
            isLoading: (currentSessionId && loadingTasks[currentSessionId] && loadingTasks[currentSessionId][activeTab]) || false,
            resumeText,
            fileName,
            activeTab,
            setActiveTab: handleTabChange,
            addMessage,
            handleAction,
            handleUpload,
            setResumeText,
            setFileName,
            clearChat,
            stopAction,
            uploadProgress,
            isRestoring,
            currentSessionId,
            sessions,
            loadSession,
            createNewSession,
            deleteSession: removeSession,
            isUploading,
            refreshContext: loadUserContext
        }}>
            {children}
        </ChatContext.Provider>
    );
};
