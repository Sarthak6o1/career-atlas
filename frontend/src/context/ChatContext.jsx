import React, { createContext, useState } from 'react';
import {
    analyzeJobFit,
    generateSummary,
    enhanceResume,
    generateInterview,
    generateCoverLetter,
    uploadResume,
    chatAiAssistant,
    findJobs,
    generateAgenticInterview
} from '../services/chatService.js';
import { v4 as uuidv4 } from 'uuid';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [messagesByTab, setMessagesByTab] = useState({
        dashboard: [{ id: 'welcome', role: 'assistant', content: "Hi! Welcome to **Career Atlas**. I'm your AI-Guide. Upload a resume or select a tool to get started!", timestamp: new Date() }],
        analyze: [],
        summary: [],
        enhance: [],
        interview: [],
        cover: [],
        jobs: [],
        'ai-assistant': []
    });

    const [loadingTasks, setLoadingTasks] = useState({});
    const [resumeText, setResumeText] = useState('');
    const [fileName, setFileName] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');

    const messages = messagesByTab[activeTab] || [];

    const addMessage = (role, content, type = 'text', targetTab = activeTab, sources = []) => {
        setMessagesByTab(prev => ({
            ...prev,
            [targetTab]: [
                ...(prev[targetTab] || []),
                {
                    id: uuidv4(),
                    role,
                    content,
                    type,
                    timestamp: new Date(),
                    sources
                }
            ]
        }));
    };

    const [uploadProgress, setUploadProgress] = useState(0);

    const handleUpload = async (file) => {
        setLoadingTasks(prev => ({ ...prev, upload: true }));
        setUploadProgress(0);
        try {
            const data = await uploadResume(file, (percent) => setUploadProgress(percent));
            setResumeText(data.text);
            setFileName(data.filename);
            setUploadProgress(100);

            // Broadcast success to dashboard
            addMessage('assistant', `Resume **${data.filename}** successfully loaded. Please select an analysis tool from the command center.`, 'markdown', 'dashboard');

        } catch (error) {
            addMessage('system', `Failed to upload: ${error.message}`, 'error', 'dashboard');
        } finally {
            setLoadingTasks(prev => ({ ...prev, upload: false }));
            setTimeout(() => setUploadProgress(0), 1000); // Reset after delay
        }
    };

    const activeControllers = React.useRef({});

    const handleAction = async (action, payload) => {
        let uiTab = action;
        if (action === 'interview-agentic') uiTab = 'interview';

        // Only abort ONLY the previous request for THIS specific tab/action
        if (activeControllers.current[uiTab]) {
            activeControllers.current[uiTab].abort();
        }

        const controller = new AbortController();
        activeControllers.current[uiTab] = controller;

        setLoadingTasks(prev => ({ ...prev, [uiTab]: true }));

        const labels = {
            analyze: "Analyze my Job Fit",
            summary: "Generate Executive Summary",
            enhance: "Enhance for Target Role",
            interview: "Prepare Interview Questions",
            'interview-agentic': "Run Agentic Deep Research",
            cover: "Draft Cover Letter strategy",
            jobs: "Find relevant Job postings"
        };
        const isChatAction = action === 'dashboard' || action === 'ai-assistant';
        const displayContent = isChatAction ? payload.text : (labels[action] || action);

        addMessage('user', displayContent, 'text', uiTab);

        try {
            // Check for abort before starting heavy work
            if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError');

            let result;
            let content = "";
            let sources = [];

            // Pass signal to service calls if they support it, otherwise we just check state
            // For now, we wrap the await and check signal after

            switch (action) {
                case 'analyze':
                    result = await analyzeJobFit(payload.text, controller.signal);
                    break;
                case 'summary':
                    result = await generateSummary(payload.text, controller.signal);
                    break;
                case 'enhance':
                    result = await enhanceResume(payload.text, payload.role, payload.company, controller.signal);
                    break;
                case 'interview':
                    result = await generateInterview(payload.text, payload.role, payload.company, controller.signal);
                    break;
                case 'interview-agentic':
                    result = await generateAgenticInterview(payload.text, payload.role, payload.company, controller.signal);
                    break;
                case 'cover':
                    result = await generateCoverLetter(payload.text, payload.role, payload.company, controller.signal);
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

            // Extract content based on result structure (simplified from original mapped logic)
            if (result) {
                if (action === 'analyze') content = result.summary_analysis;
                else if (action === 'summary') content = result.summary_md;
                else if (action === 'enhance') content = result.enhancement_md;
                else if (action === 'interview') content = result.result_md;
                else if (action === 'interview-agentic') content = result.result_md;
                else if (action === 'cover') content = result.result_md;
                else if (action === 'jobs') content = result.result_md;
                else if (['ai-assistant', 'dashboard'].includes(action)) {
                    content = result.reply;
                    sources = result.sources || [];
                }
            }

            if (content) {
                addMessage('assistant', content, 'markdown', uiTab, sources);
            }


        } catch (error) {
            if (error.name === 'AbortError') {
                addMessage('system', 'Action stopped by user.', 'info', uiTab);
            } else {
                addMessage('system', `Error: ${error.message}`, 'error', uiTab);
            }
        } finally {
            setLoadingTasks(prev => ({ ...prev, [uiTab]: false }));
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
            isLoading: loadingTasks[activeTab] || false,
            resumeText,
            fileName,
            activeTab,
            setActiveTab,
            addMessage,
            handleAction,
            handleUpload,
            setResumeText,
            setFileName,
            clearChat,
            stopAction, // Exporting stopAction
            uploadProgress
        }}>
            {children}
        </ChatContext.Provider>
    );
};
