import db from './config/db.js';
async function list() {
    try {
        const [tables] = await db.query('SHOW TABLES'); console.table(tables);
        const [depts] = await db.query('SELECT * FROM departments'); console.table(depts);
        const [fields] = await db.query('SELECT * FROM fields'); console.table(fields);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}
list();
