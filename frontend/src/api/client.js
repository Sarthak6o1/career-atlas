import axios from 'axios';

const client = axios.create({
    baseURL: '/api', // Proxy handles /api
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 180000, // 180 seconds to allow for agentic web scraping
});

export default client;
