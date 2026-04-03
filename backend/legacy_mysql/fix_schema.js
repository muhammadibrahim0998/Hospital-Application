import db from "./config/db.js";

const fixSchema = async () => {
    try {
        console.log("Checking schema...");

        // Check if role column exists in users
        const [columns] = await db.query("SHOW COLUMNS FROM users LIKE 'role'");
        if (columns.length === 0) {
            console.log("Adding role column to users table...");
            await db.query("ALTER TABLE users ADD COLUMN role ENUM('admin', 'doctor', 'patient') DEFAULT 'patient'");
            console.log("Role column added successfully.");
        } else {
            console.log("Role column already exists in users table.");
        }

        console.log("Schema check completed.");
        process.exit(0);
    } catch (err) {
        console.error("Schema fix failed:", err);
        process.exit(1);
    }
};

fixSchema();
