
import express from 'express';
import axios from 'axios';

const app = express();
app.get('/test', (req, res) => res.send('OK'));

const server = app.listen(3005, async () => {
    try {
        const res = await axios.get('http://localhost:3005/test');
        console.log('SELF TEST SUCCESS:', res.data);
    } catch (err) {
        console.log('SELF TEST FAILED:', err.message);
    }
    server.close();
});
