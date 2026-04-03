import db from './config/db.js';
async function list() {
    try {
        const [rows] = await db.query('SELECT name, email, role FROM users');
        console.log('--- ALL USERS ---');
        console.table(rows);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}
list();
