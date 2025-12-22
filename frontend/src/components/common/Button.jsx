import React from 'react';

const Button = ({ children, onClick, disabled, variant = 'primary', icon: Icon, className = '', ...props }) => {
    const baseStyle = {
        padding: '0.8rem 1.5rem',
        borderRadius: '10px',
        border: '1px solid var(--glass-border)',
        background: variant === 'primary' ? '#21262d' : 'transparent',
        color: '#c9d1d9',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.7rem',
        fontSize: '1rem',
        fontWeight: '500',
        transition: 'all 0.2s',
        opacity: disabled ? 0.5 : 1
    };

    const activeStyle = variant === 'accent' ? {
        background: 'var(--accent, #3b82f6)',
        color: 'white',
        border: 'none'
    } : {};

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={{ ...baseStyle, ...activeStyle, ...props.style }}
            className={className}
        >
            {Icon && <Icon size={16} />}
            {children}
        </button>
    );
};

export default Button;
