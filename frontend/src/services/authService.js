import axios from '../api/client';

export const login = async (email, password) => {
    // Expects backend at /api/auth/login based on main.py prefix
    const response = await axios.post('/auth/login', { email, password });
    if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user_email', response.data.email);
    }
    return response.data;
};

export const signup = async (email, password) => {
    const response = await axios.post('/auth/signup', { email, password });
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_email');
    // Force redirect to login
    window.location.href = '/login';
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};
