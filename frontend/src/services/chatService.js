import axios from '../api/client';

export const uploadResume = async (file, signal) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post('/parse/resume', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
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
