
import axios from 'axios';

const testEndpoints = async () => {
    const base = 'http://localhost:3002';
    const endpoints = [
        { method: 'get', url: '/healthz' },
        { method: 'get', url: '/api/ping' },
        { method: 'get', url: '/api/admin/public-test' },
        { method: 'post', url: '/api/admin/lab-technicians' }
    ];

    for (const ep of endpoints) {
        try {
            console.log(`Testing ${ep.method.toUpperCase()} ${ep.url}...`);
            const res = await axios[ep.method](`${base}${ep.url}`);
            console.log(`Response: ${res.status} ${res.statusText}`);
            console.log(`Data:`, res.data);
        } catch (err) {
            console.log(`Error: ${err.response?.status || 'ERR'} ${err.response?.statusText || err.message}`);
            if (err.response?.data) {
                console.log(`Error Data:`, typeof err.response.data === 'string' ? err.response.data.substring(0, 100) : err.response.data);
            }
        }
        console.log('---');
    }
};

testEndpoints();
