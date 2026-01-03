import axios from 'axios';

// Create Axios instance with Backend Engineer Best Practices
const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 1800000,
});

// Request Interceptor to add Token
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

apiClient.interceptors.response.use(
    (response) => response,
    async (err) => {
        const { config, message, response } = err;

        // Handle 401 Unauthorized (Token Expired/Invalid)
        if (response && response.status === 401) {
            // Prevent redirect loop if already on login
            if (!window.location.pathname.includes('/login')) {
                console.warn('Session expired. Redirecting to login.');
                localStorage.removeItem('token');
                localStorage.removeItem('user_email');
                window.location.href = '/login';
                return Promise.reject(err);
            }
        }

        if (!config || !config.retry) {
            config.retry = 2;
        }

        if (message === 'Network Error' || (response && response.status >= 500)) {
            config.retry -= 1;
            if (config.retry === 0) {
                return Promise.reject(err);
            }

            const delayRetryRequest = new Promise((resolve) => {
                setTimeout(() => {
                    console.log('Retrying request...', config.url);
                    resolve();
                }, 1000);
            });

            return delayRetryRequest.then(() => apiClient(config));
        }

        return Promise.reject(err);
    }
);

export default apiClient;
