import React from 'react';
import { Zap } from 'lucide-react';

const Resuphyus = () => {
    return (
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', animation: 'fadeIn 1s ease' }}>
            <div className="animate-float" style={{
                display: 'inline-flex',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))',
                borderRadius: '50%',
                marginBottom: '1.5rem',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 0 30px rgba(168, 85, 247, 0.4)'
            }}>
                <Zap size={48} color="#c084fc" fill="rgba(192, 132, 252, 0.2)" />
            </div>

            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', background: 'linear-gradient(to right, #fff, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Resuphyus AI Guide
            </h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2rem' }}>
                I&apos;m your dedicated career architect. Upload a resume to get deep insights, or just ask me for advice.
            </p>
        </div>
    );
};

export default Resuphyus;
