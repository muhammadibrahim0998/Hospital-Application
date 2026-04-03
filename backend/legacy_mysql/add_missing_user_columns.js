import db from "./config/db.js";

const addColumns = async () => {
    try {
        console.log("Adding missing columns to users table...");
        
        const [columns] = await db.query("SHOW COLUMNS FROM users");
        const colNames = columns.map(c => c.Field);

        if (!colNames.includes('cnic')) {
            await db.query("ALTER TABLE users ADD COLUMN cnic VARCHAR(20) DEFAULT NULL");
            console.log("Added cnic column");
        }
        if (!colNames.includes('hospital_id')) {
            await db.query("ALTER TABLE users ADD COLUMN hospital_id INT DEFAULT NULL");
            console.log("Added hospital_id column");
        }
        if (!colNames.includes('gender')) {
            await db.query("ALTER TABLE users ADD COLUMN gender VARCHAR(10) DEFAULT 'Male'");
            console.log("Added gender column");
        }
        if (!colNames.includes('age')) {
            await db.query("ALTER TABLE users ADD COLUMN age INT DEFAULT 30");
            console.log("Added age column");
        }
        if (!colNames.includes('phone')) {
            await db.query("ALTER TABLE users ADD COLUMN phone VARCHAR(20) DEFAULT '03000000000'");
            console.log("Added phone column");
        }

        console.log("Columns added successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Error adding columns:", err);
        process.exit(1);
    }
};

addColumns();
