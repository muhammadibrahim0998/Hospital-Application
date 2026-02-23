import db from './config/db.js';

async function checkSchema() {
    try {
        const [tables] = await db.query('SHOW TABLES');
        console.log('Tables in database:');
        console.table(tables);

        for (const table of tables) {
            const tableName = Object.values(table)[0];
            const [schema] = await db.query(`DESCRIBE \`${tableName}\``);
            console.log(`\nTable: ${tableName}`);
            console.table(schema);
        }

    } catch (err) {
        console.error('Error checking schema:', err.message);
    } finally {
        process.exit();
    }
}

checkSchema();
