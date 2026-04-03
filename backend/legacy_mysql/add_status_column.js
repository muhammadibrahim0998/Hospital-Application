import db from './config/db.js';

async function migrate() {
    try {
        await db.query("ALTER TABLE appointments ADD COLUMN status VARCHAR(20) DEFAULT 'scheduled' AFTER doctor_id");
        console.log("Successfully added 'status' column to appointments table.");
        process.exit(0);
    } catch (err) {
        if (err.code === 'ER_DUP_COLUMN_NAME') {
            console.log("Column 'status' already exists.");
            process.exit(0);
        }
        console.error('Migration Error:', err);
        process.exit(1);
    }
}

migrate();
