import db from './config/db.js';

async function check() {
    try {
        const [rows] = await db.query('DESCRIBE appointments');
        console.log('--- APPOINTMENTS TABLE ---');
        console.table(rows);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

check();
