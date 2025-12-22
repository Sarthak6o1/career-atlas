import React, { useRef } from 'react';
import Button from '../common/Button';
import { Upload, Zap, AlignLeft, Briefcase, Mic, FileText } from 'lucide-react';
import { useChat } from '../../hooks/useChat.js';

const ChatToolbar = ({ triggerAction }) => {
    const { resumeText, handleUpload } = useChat();
    const fileInputRef = useRef(null);

    const onFileChange = (e) => {
        if (e.target.files?.[0]) handleUpload(e.target.files[0]);
    };

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', width: '100%' }}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={onFileChange}
                style={{ display: 'none' }}
                accept="application/pdf"
            />
            <Button onClick={() => fileInputRef.current.click()} icon={Upload}>
                Upload PDF
            </Button>

            <div style={{ width: '1px', background: 'var(--glass-border)', margin: '0 0.5rem' }} />

            <Button onClick={() => triggerAction('analyze')} disabled={!resumeText} icon={Zap}>
                Analyze Job Fit
            </Button>
            <Button onClick={() => triggerAction('summary')} disabled={!resumeText} icon={AlignLeft}>
                Summary
            </Button>
            <Button onClick={() => triggerAction('enhance')} disabled={!resumeText} icon={Briefcase}>
                Enhance
            </Button>
            <Button onClick={() => triggerAction('interview')} disabled={!resumeText} icon={Mic}>
                Interview
            </Button>
            <Button onClick={() => triggerAction('cover')} disabled={!resumeText} icon={FileText}>
                Cover Letter
            </Button>
        </div>
    );
};

export default ChatToolbar;
