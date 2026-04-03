import db from './config/db.js';

async function migrate() {
    try {
        await db.query("ALTER TABLE doctors ADD COLUMN IF NOT EXISTS status ENUM('active', 'inactive') DEFAULT 'active'");
        console.log('Migration successful: status column added to doctors table.');
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log('Column "status" already exists.');
        } else {
            console.error('Migration failed:', err.message);
        }
    } finally {
        process.exit();
    }
}

migrate();
