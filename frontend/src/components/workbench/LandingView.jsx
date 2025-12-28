import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText } from 'lucide-react';

const LandingView = ({ onUpload, uploadProgress, onTextSubmit }) => {
    const fileInputRef = useRef(null);
    const [heroIndex, setHeroIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [inputText, setInputText] = useState('');

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

    const onFileChange = (e) => {
        if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files?.[0]) setSelectedFile(e.dataTransfer.files[0]);
    };

    const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const onDragLeave = () => { setIsDragging(false); };

    const confirmUpload = () => {
        if (selectedFile) onUpload(selectedFile);
    };

    return (
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
                onClick={() => !selectedFile && fileInputRef.current.click()}
                onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
                className="snap-pill"
                style={{
                    width: '100%', maxWidth: '600px', padding: '3rem',
                    border: isDragging ? '2px dashed var(--accent)' : '2px dashed rgba(255,255,255,0.1)',
                    background: isDragging ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.02)',
                    borderRadius: '32px', cursor: selectedFile ? 'default' : 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem',
                    transition: 'all 0.3s'
                }}
            >
                <input type="file" ref={fileInputRef} onChange={onFileChange} style={{ display: 'none' }} accept=".pdf,.txt,.md,.jpg,.jpeg,.png" />

                {uploadProgress > 0 && uploadProgress < 100 ? (
                    <div style={{ textAlign: 'center', width: '100%' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent)', marginBottom: '0.5rem' }}>{uploadProgress}%</div>
                        <div style={{ width: '60%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', margin: '0 auto', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${uploadProgress}%`, background: 'var(--accent)', transition: 'width 0.2s ease' }}></div>
                        </div>
                        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Processing Document...</p>
                    </div>
                ) : selectedFile ? (
                    <div style={{ textAlign: 'center', width: '100%' }}>
                        <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '16px', display: 'inline-flex', marginBottom: '1rem' }}>
                            <FileText size={32} color="#60a5fa" />
                        </div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'white', marginBottom: '0.2rem' }}>{selectedFile.name}</h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{(selectedFile.size / 1024).toFixed(1)} KB • Ready to Process</p>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                                style={{ padding: '0.8rem 1.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); confirmUpload(); }}
                                className="btn-3d-accent"
                                style={{
                                    padding: '1rem 3rem',
                                    color: 'white',
                                    borderRadius: '16px',
                                    cursor: 'pointer',
                                    fontWeight: '800',
                                    fontSize: '1.2rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.8rem',
                                    letterSpacing: '0.5px'
                                }}
                            >
                                {uploadProgress > 0 ? (
                                    <>
                                        <div className="spinner" style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Upload size={24} strokeWidth={3} /> PROCESS RESUME
                                    </>
                                )}
                            </button>
                            <style>{`
                                @keyframes spin { to { transform: rotate(360deg); } }
                            `}</style>
                        </div>
                    </div>
                ) : (
                    <>
                        <div style={{ padding: '1.5rem', background: 'var(--card-bg)', borderRadius: '50%' }}><Upload size={40} color="var(--accent)" /></div>
                        <div style={{ textAlign: 'center' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>Upload Document</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>PDF, TXT, MD, JPG, PNG supported</p>
                        </div>
                    </>
                )}
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
                    onClick={() => onTextSubmit(inputText)}
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
    );
};

export default LandingView;
