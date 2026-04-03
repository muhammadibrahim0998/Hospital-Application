import db from './config/db.js';
async function run() {
    try {
        const [p] = await db.query('DESCRIBE patients');
        const [d] = await db.query('DESCRIBE doctors');
        console.log('--- PATIENTS ---');
        console.table(p);
        console.log('--- DOCTORS ---');
        console.table(d);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
run();
