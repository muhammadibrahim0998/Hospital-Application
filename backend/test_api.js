import axios from 'axios';

const testRoute = async () => {
    try {
        console.log("Testing GET /api/lab/tests...");
        // Note: This won't work without a token, but it should return 401/403, NOT 404
        const res = await axios.get('http://localhost:3002/api/lab/tests');
        console.log("Response:", res.status);
    } catch (err) {
        if (err.response) {
            console.log("Response Status:", err.response.status);
            console.log("Response Data:", err.response.data);
        } else {
            console.error("Error:", err.message);
        }
    }
};

testRoute();
