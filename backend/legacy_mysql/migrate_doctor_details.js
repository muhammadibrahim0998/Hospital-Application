import db from './config/db.js';

async function migrate() {
    try {
        console.log('Starting migration...');

        // Add fee column
        try {
            await db.query("ALTER TABLE doctors ADD COLUMN fee DECIMAL(10, 2) DEFAULT 500.00");
            console.log('Added fee column.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') console.log('Column "fee" already exists.');
            else throw err;
        }

        // Add whatsapp_number column
        try {
            await db.query("ALTER TABLE doctors ADD COLUMN whatsapp_number VARCHAR(20)");
            console.log('Added whatsapp_number column.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') console.log('Column "whatsapp_number" already exists.');
            else throw err;
        }

        console.log('Migration successful.');
    } catch (err) {
        console.error('Migration failed:', err.message);
    } finally {
        process.exit();
    }
}

migrate();
