import db from './config/db.js';

async function migrate() {
    try {
        console.log("Starting migration: Adding gender, age, and phone to users and hospital_admins...");

        // Users table
        const [userCols] = await db.query("SHOW COLUMNS FROM users");
        const userColNames = userCols.map(c => c.Field);

        if (!userColNames.includes('gender')) {
            await db.query("ALTER TABLE users ADD COLUMN gender VARCHAR(10) DEFAULT 'Male'");
            console.log("Added gender to users");
        }
        if (!userColNames.includes('age')) {
            await db.query("ALTER TABLE users ADD COLUMN age INT DEFAULT 25");
            console.log("Added age to users");
        }
        if (!userColNames.includes('phone')) {
            await db.query("ALTER TABLE users ADD COLUMN phone VARCHAR(20) DEFAULT '03000000000'");
            console.log("Added phone to users");
        }

        // Hospital Admins table
        const [adminCols] = await db.query("SHOW COLUMNS FROM hospital_admins");
        const adminColNames = adminCols.map(c => c.Field);

        if (!adminColNames.includes('gender')) {
            await db.query("ALTER TABLE hospital_admins ADD COLUMN gender VARCHAR(10) DEFAULT 'Male'");
            console.log("Added gender to hospital_admins");
        }
        if (!adminColNames.includes('age')) {
            await db.query("ALTER TABLE hospital_admins ADD COLUMN age INT DEFAULT 30");
            console.log("Added age to hospital_admins");
        }
        if (!adminColNames.includes('phone')) {
            await db.query("ALTER TABLE hospital_admins ADD COLUMN phone VARCHAR(20) DEFAULT '03000000000'");
            console.log("Added phone to hospital_admins");
        }

        console.log("Migration completed successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

migrate();
