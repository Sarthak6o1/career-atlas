import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Download } from 'lucide-react';

const MessageItem = ({ message }) => {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';

    if (isSystem) {
        return (
            <div style={{ textAlign: 'center', margin: '1rem 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                {message.content}
            </div>
        )
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: isUser ? 'flex-end' : 'flex-start',
            marginBottom: '1.5rem',
            animation: 'fadeIn 0.3s ease'
        }}>
            {!isUser && (
                <div style={{ position: 'absolute', top: '-20px', left: '10px', fontSize: '0.75rem', fontWeight: 'bold', color: '#c084fc', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    AI-Guide
                </div>
            )}
            <div style={{
                position: 'relative',
                maxWidth: '80%',
                padding: '1.5rem', /* Larger padding */
                borderRadius: '24px', /* Rounder corners */
                borderTopRightRadius: isUser ? '4px' : '24px',
                borderTopLeftRadius: isUser ? '24px' : '4px',
                backgroundColor: isUser ? 'var(--accent)' : 'var(--card-bg)',
                border: isUser ? 'none' : '1px solid var(--glass-border)',
                color: 'var(--text-primary)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                fontSize: '1.1rem', /* Larger font */
                lineHeight: '1.6'
            }}>
                {message.type === 'markdown' ? (
                    <div className="markdown-content">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                ) : (
                    <p style={{ margin: 0, lineHeight: 1.5 }}>{message.content}</p>
                )}

                {message.sources && message.sources.length > 0 && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399' }}></span>
                            RAG Sources
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {message.sources.map((src, idx) => (
                                <div key={idx} style={{ fontSize: '0.8rem', background: 'var(--bg-color)', padding: '0.5rem', borderRadius: '8px', borderLeft: '2px solid #c084fc', border: '1px solid var(--glass-border)' }}>
                                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{src.category}</div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{src.snippet}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* PDF Download Button for AI Messages */}
                {!isUser && ['enhance', 'cover'].includes(message.tab) && (
                    <div style={{ marginTop: '1rem', paddingTop: '0.8rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-start' }}>
                        <button
                            onClick={() => {
                                import('jspdf').then(({ jsPDF }) => {
                                    const doc = new jsPDF();
                                    const margin = 20;
                                    let y = 20;
                                    const pageWidth = doc.internal.pageSize.getWidth();
                                    const maxWidth = pageWidth - (margin * 2);

                                    const isResume = message.tab === 'enhance';

                                    if (!isResume) {
                                        // --- COVER LETTER MODE (Classic) ---
                                        doc.setFont("times", "normal");
                                        doc.setFontSize(11);

                                        // Date
                                        const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                                        doc.text(date, pageWidth - margin - doc.getTextWidth(date), y);
                                        y += 20;

                                        // Content
                                        const lines = message.content.split('\n');
                                        lines.forEach(line => {
                                            line = line.replace(/\*\*/g, "").replace(/#/g, "");
                                            if (line.trim() === "") { y += 6; return; }

                                            const split = doc.splitTextToSize(line, maxWidth);
                                            if (y + split.length * 5 > 280) { doc.addPage(); y = 20; }
                                            doc.text(split, margin, y);
                                            y += (split.length * 5) + 2;
                                        });
                                        doc.save('Cover_Letter.pdf');
                                    } else {
                                        // --- RESUME MODE (Modern) ---
                                        doc.setFont("helvetica", "bold");
                                        doc.setFontSize(22);
                                        doc.setTextColor(30, 41, 59);
                                        doc.text("ENHANCED RESUME", pageWidth / 2, y, { align: 'center' });
                                        y += 15;

                                        doc.setDrawColor(200);
                                        doc.setLineWidth(0.5);
                                        doc.line(margin, y, pageWidth - margin, y);
                                        y += 10;

                                        doc.setTextColor(0);
                                        const lines = message.content.split('\n');

                                        lines.forEach(line => {
                                            if (y > 275) { doc.addPage(); y = 20; }

                                            // Headers
                                            if (line.trim().startsWith('##') || line.trim().startsWith('# ')) {
                                                const header = line.replace(/#/g, "").trim().toUpperCase();
                                                y += 6;
                                                doc.setFont("helvetica", "bold");
                                                doc.setFontSize(11); // Professional small caps style
                                                doc.setTextColor(37, 99, 235); // Blue
                                                doc.text(header, margin, y);
                                                // Underline
                                                doc.line(margin, y + 1, margin + doc.getTextWidth(header), y + 1);
                                                y += 8;
                                                doc.setTextColor(0);
                                            }
                                            // Bullets
                                            else if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
                                                doc.setFont("helvetica", "normal");
                                                doc.setFontSize(10);
                                                const cleanText = line.replace(/^[\s]*[\*\-]\s*/, "•  ").replace(/\*\*/g, "");
                                                const split = doc.splitTextToSize(cleanText, maxWidth);
                                                doc.text(split, margin + 5, y); // Indent
                                                y += (split.length * 5) + 2;
                                            }
                                            // Normal
                                            else {
                                                const clean = line.replace(/\*\*/g, "");
                                                if (clean.trim() === "") { y += 4; return; }
                                                doc.setFont("helvetica", "normal");
                                                doc.setFontSize(10);
                                                const split = doc.splitTextToSize(clean, maxWidth);
                                                doc.text(split, margin, y);
                                                y += (split.length * 5) + 1;
                                            }
                                        });
                                        doc.save('Enhanced_Resume.pdf');
                                    }
                                });
                            }}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--glass-border)',
                                color: 'var(--text-primary)',
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'var(--text-primary)';
                                e.currentTarget.style.color = 'var(--bg-color)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = 'var(--text-primary)';
                            }}
                        >
                            <Download size={16} /> Download as PDF
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageItem;
