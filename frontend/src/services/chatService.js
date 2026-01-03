import axios from '../api/client';

// Service for Chat and Job Management API calls
export const fetchSessions = async () => {
    const response = await axios.get('/chat/sessions');
    return response.data;
};

export const fetchChatHistory = async (sessionId) => {
    const params = sessionId ? { session_id: sessionId } : {};
    const response = await axios.get('/chat/history', { params });
    return response.data;
};

export const clearChatHistory = async () => {
    const response = await axios.delete('/chat/history');
    return response.data;
};

export const deleteSession = async (sessionId) => {
    return axios.delete(`/chat/sessions/${sessionId}`);
};

export const updateSessionContext = async (sessionId, updates) => {
    return axios.put(`/chat/sessions/${sessionId}`, updates);
};

export const fetchSessionDetails = async (sessionId) => {
    const response = await axios.get(`/chat/sessions/${sessionId}`);
    return response.data;
};

export const persistMessage = async (messageData) => {
    // messageData: { role, content, type, tab, sources, session_id }
    return axios.post('/chat/message', messageData);
};

// Returns { ...jobData }
export const saveJob = async (jobData) => {
    const response = await axios.post('/jobs', jobData);
    return response.data;
};

export const getJobs = async () => {
    const response = await axios.get('/jobs');
    return response.data;
};

export const deleteJob = async (jobId) => {
    const response = await axios.delete(`/jobs/${jobId}`);
    return response.data;
};

export const updateJobStatus = async (jobId, status) => {
    const response = await axios.patch(`/jobs/${jobId}`, { status });
    return response.data;
};

export const uploadResume = async (file, onProgress, signal) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post('/parse/resume', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
            if (onProgress) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress(percentCompleted);
            }
        },
        signal
    });
    return response.data;
};

export const analyzeJobFit = async (resumeText, signal) => {
    const response = await axios.post('/job-fit', { resume_text: resumeText }, { signal });
    return response.data;
};

export const generateSummary = async (resumeText, signal) => {
    const response = await axios.post('/summary', { resume_text: resumeText }, { signal });
    return response.data;
};

export const auditResume = async (resumeText, signal) => {
    const response = await axios.post('/audit', { resume_text: resumeText }, { signal });
    return response.data;
};

export const enhanceResume = async (resumeText, targetRole, targetCompany, signal) => {
    const response = await axios.post('/enhance', { resume_text: resumeText, target_role: targetRole, target_company: targetCompany }, { signal });
    return response.data;
};

export const generateInterview = async (resumeText, targetRole, targetCompany, signal) => {
    const response = await axios.post('/interview', { resume_text: resumeText, target_role: targetRole, target_company: targetCompany }, { signal });
    return response.data;
};

export const generateAgenticInterview = async (resumeText, targetRole, targetCompany, signal) => {
    const response = await axios.post('/interview/agentic', { resume_text: resumeText, target_role: targetRole, target_company: targetCompany }, { signal });
    return response.data;
};

export const generateCoverLetter = async (resumeText, targetRole, targetCompany, signal) => {
    const response = await axios.post('/cover-letter', { resume_text: resumeText, target_role: targetRole, target_company: targetCompany }, { signal });
    return response.data;
};

export const chatAiAssistant = async (message, resumeText, signal) => {
    const response = await axios.post('/ai-assistant/chat', { message, resume_text: resumeText }, { signal });
    return response.data;
};

export const findJobs = async (resumeText, targetRole, location, jobType, experienceLevel, signal) => {
    const response = await axios.post('/find-jobs', { resume_text: resumeText, target_role: targetRole, location: location, job_type: jobType, experience_level: experienceLevel }, { signal });
    return response.data;
};

export const tailorResume = async (resumeText, jobDescription, signal) => {
    const response = await axios.post('/tailor', { resume_text: resumeText, job_description: jobDescription }, { signal });
    return response.data;
};
