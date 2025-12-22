import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header style={{
                padding: '1rem 2rem',
                borderBottom: '1px solid var(--glass-border)',
                background: 'var(--card-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent)' }} />
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Career Atlas</h1>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    v2.0.0
                </div>
            </header>

            <main style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
