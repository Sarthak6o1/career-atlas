import axios from 'axios';

// Create Axios instance with Backend Engineer Best Practices
const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 180000,
});

apiClient.interceptors.response.use(undefined, async (err) => {
    const { config, message } = err;
    if (!config || !config.retry) {
        config.retry = 2;
    }

    if (message === 'Network Error' || (err.response && err.response.status >= 500)) {
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
});

export default apiClient;
