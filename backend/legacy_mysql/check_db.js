import db from './config/db.js';

async function check() {
    try {
        const [rows] = await db.query('DESCRIBE users');
        console.log('--- USERS TABLE ---');
        console.table(rows);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

check();
