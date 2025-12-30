import React, { useState } from 'react';
import { login, signup } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                await login(email, password);
                navigate('/workbench');
            } else {
                await signup(email, password);
                // After signup, auto-login
                await login(email, password);
                navigate('/workbench');
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Authentication failed');
        }
    };

    const containerStyle = {
        minHeight: '100vh',
        backgroundColor: '#0a0a0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        fontFamily: 'Inter, sans-serif'
    };

    const cardStyle = {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '2.5rem',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
    };

    const inputStyle = {
        width: '100%',
        background: 'rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '0.875rem',
        borderRadius: '8px',
        color: 'white',
        marginTop: '0.5rem',
        marginBottom: '1rem',
        outline: 'none',
        fontSize: '1rem'
    };

    const buttonStyle = {
        width: '100%',
        background: 'linear-gradient(to right, #2563eb, #7c3aed)',
        color: 'white',
        fontWeight: 'bold',
        padding: '0.875rem',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        marginTop: '1.5rem',
        transition: 'all 0.2s',
        fontSize: '1rem',
        boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)'
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={{ color: 'white', textAlign: 'center', fontSize: '2rem', marginBottom: '2rem', fontWeight: 'bold' }}>
                    {isLogin ? 'Welcome Back' : 'Join Career Atlas'}
                </h2>

                {error && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div>
                        <label style={{ color: '#9ca3af', fontSize: '0.875rem', marginLeft: '2px' }}>Email Address</label>
                        <input
                            type="email"
                            required
                            placeholder="you@example.com"
                            style={inputStyle}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label style={{ color: '#9ca3af', fontSize: '0.875rem', marginLeft: '2px' }}>Password</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            placeholder="••••••••"
                            style={inputStyle}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" style={buttonStyle}>
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: '#9ca3af' }}>
                    {isLogin ? "New here? " : "Already have an account? "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', fontWeight: '600' }}
                    >
                        {isLogin ? 'Sign Up' : 'Log In'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
