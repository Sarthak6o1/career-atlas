import React, { useState, useEffect } from 'react';
import { Briefcase, Trash2, ExternalLink, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import { getJobs, deleteJob, updateJobStatus, saveJob } from '../../services/chatService';

const SavedJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [newJobMode, setNewJobMode] = useState(false);
    const [formData, setFormData] = useState({ title: '', company: '', url: '' });

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        try {
            const data = await getJobs();
            setJobs(data);
        } catch (err) {
            setError("Failed to load jobs.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Remove this job from your list?")) {
            try {
                await deleteJob(id);
                setJobs(jobs.filter(j => j.id !== id));
            } catch (err) {
                alert("Failed to delete job.");
            }
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            // Optimistic update
            setJobs(jobs.map(j => j.id === id ? { ...j, status: newStatus } : j));
            await updateJobStatus(id, newStatus);
        } catch (err) {
            loadJobs(); // Revert on failure
        }
    };

    const handleAddJob = async (e) => {
        e.preventDefault();
        try {
            const job = await saveJob({ ...formData, status: 'saved' });
            setJobs([job, ...jobs]);
            setNewJobMode(false);
            setFormData({ title: '', company: '', url: '' });
        } catch (err) {
            alert("Failed to save job.");
        }
    };

    const statusConfig = {
        saved: { color: '#3b82f6', label: 'Saved', icon: Briefcase },
        applied: { color: '#eab308', label: 'Applied', icon: Clock },
        interviewing: { color: '#a855f7', label: 'Interviewing', icon: Calendar },
        offer: { color: '#22c55e', label: 'Offer', icon: CheckCircle },
        rejected: { color: '#ef4444', label: 'Rejected', icon: XCircle },
    };

    if (loading) return <div style={{ color: '#94a3b8', padding: '2rem' }}>Loading pipeline...</div>;

    return (
        <div style={{ padding: '0 0 2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>My Job Pipeline</h2>
                <button
                    onClick={() => setNewJobMode(!newJobMode)}
                    style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    {newJobMode ? <XCircle size={18} /> : <Briefcase size={18} />}
                    {newJobMode ? "Cancel" : "Add Job"}
                </button>
            </div>

            {newJobMode && (
                <form onSubmit={handleAddJob} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end', background: 'rgba(30, 41, 59, 0.6)' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Job Title</label>
                        <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} placeholder="e.g. Senior Engineer" />
                    </div>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Company</label>
                        <input required type="text" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} placeholder="e.g. Google" />
                    </div>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.9rem' }}>URL (Optional)</label>
                        <input type="url" value={formData.url} onChange={e => setFormData({ ...formData, url: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} placeholder="https://..." />
                    </div>
                    <div style={{ width: '100%', marginTop: '0.5rem' }}>
                        <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Notes / Chat Snippets</label>
                        <textarea
                            value={formData.notes || ''}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', minHeight: '60px', fontFamily: 'inherit' }}
                            placeholder="Paste related chat content or details here..."
                        />
                    </div>
                    <button type="submit" style={{ padding: '0.8rem 1.5rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
                </form>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {jobs.map(job => (
                    <div key={job.id} className="glass-panel" style={{
                        padding: '1.5rem',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.05)',
                        background: 'rgba(30, 41, 59, 0.4)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ margin: '0 0 0.3rem', fontSize: '1.1rem', color: 'white' }}>{job.title}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                                    <Briefcase size={14} />
                                    {job.company}
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(job.id)}
                                style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.3rem' }}
                                title="Remove"
                            >
                                <Trash2 size={18} className="hover:text-red-500" />
                            </button>
                        </div>

                        {job.notes && (
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.8rem', borderRadius: '8px', fontSize: '0.85rem', color: '#cbd5e1', whiteSpace: 'pre-wrap', maxHeight: '100px', overflowY: 'auto' }}>
                                {job.notes}
                            </div>
                        )}

                        {/* Status Bar */}
                        <div style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', overflowX: 'auto' }}>
                            {Object.entries(statusConfig).map(([key, config]) => (
                                <button
                                    key={key}
                                    onClick={() => handleStatusChange(job.id, key)}
                                    style={{
                                        border: 'none',
                                        background: job.status === key ? config.color : 'transparent',
                                        color: job.status === key ? 'white' : '#64748b',
                                        padding: '0.3rem',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    title={config.label}
                                >
                                    <config.icon size={14} />
                                </button>
                            ))}
                        </div>

                        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#94a3b8' }}>
                            <span>{new Date(job.created_at).toLocaleDateString()}</span>
                            {job.url && (
                                <a href={job.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#38bdf8', textDecoration: 'none' }}>
                                    View Job <ExternalLink size={14} />
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {jobs.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                    <Briefcase size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                    <p>No saved jobs yet. Add one manually!</p>
                </div>
            )}
        </div>
    );
};

export default SavedJobs;
