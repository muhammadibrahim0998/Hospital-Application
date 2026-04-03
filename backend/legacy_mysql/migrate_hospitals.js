/**
 * migrate_hospitals.js
 * Run this ONCE to add hospital-level multi-tenancy to your existing DB.
 * Usage: node migrate_hospitals.js
 */
import db from "./config/db.js";
import bcrypt from "bcryptjs";

const migrate = async () => {
    try {
        console.log("Starting hospital multi-tenancy migration...");

        // 1. Create hospitals table
        await db.query(`
      CREATE TABLE IF NOT EXISTS hospitals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(500),
        phone VARCHAR(50),
        email VARCHAR(255),
        logo VARCHAR(500),
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log("✅ hospitals table created/verified.");

        // 2. Create hospital_admins table (separate from users, strictly tied to one hospital)
        await db.query(`
      CREATE TABLE IF NOT EXISTS hospital_admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        hospital_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        modules JSON DEFAULT ('{"doctors":true,"patients":true,"appointments":true,"lab":true,"appUsers":true}'),
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE
      )
    `);
        console.log("✅ hospital_admins table created/verified.");

        // 3. Add hospital_id column to users table (app users)
        try {
            await db.query(`ALTER TABLE users ADD COLUMN hospital_id INT NULL DEFAULT NULL`);
            console.log("✅ hospital_id column added to users.");
        } catch (e) {
            if (e.code === "ER_DUP_FIELDNAME") {
                console.log("ℹ️  hospital_id column already exists in users.");
            } else throw e;
        }

        // 4. Add hospital_id column to doctors table
        try {
            await db.query(`ALTER TABLE doctors ADD COLUMN hospital_id INT NULL DEFAULT NULL`);
            console.log("✅ hospital_id column added to doctors.");
        } catch (e) {
            if (e.code === "ER_DUP_FIELDNAME") {
                console.log("ℹ️  hospital_id column already exists in doctors.");
            } else throw e;
        }

        // 5. Add hospital_id column to patients table
        try {
            await db.query(`ALTER TABLE patients ADD COLUMN hospital_id INT NULL DEFAULT NULL`);
            console.log("✅ hospital_id column added to patients.");
        } catch (e) {
            if (e.code === "ER_DUP_FIELDNAME") {
                console.log("ℹ️  hospital_id column already exists in patients.");
            } else throw e;
        }

        // 6. Update users role ENUM to include super_admin
        try {
            await db.query(`ALTER TABLE users MODIFY COLUMN role ENUM('super_admin','admin','doctor','patient') DEFAULT 'patient'`);
            console.log("✅ users role ENUM updated.");
        } catch (e) {
            console.log("ℹ️  Could not update role enum (may already be updated):", e.message);
        }

        // 7. Create default Super Admin if not exists
        const [existingSA] = await db.query(`SELECT * FROM users WHERE role = 'super_admin' LIMIT 1`);
        if (existingSA.length === 0) {
            const hash = await bcrypt.hash("superadmin123", 10);
            await db.query(
                `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'super_admin')`,
                ["Super Admin", "superadmin@hospital.com", hash]
            );
            console.log("✅ Default Super Admin created:");
            console.log("   Email:    superadmin@hospital.com");
            console.log("   Password: superadmin123");
            console.log("   ⚠️  CHANGE THIS PASSWORD IMMEDIATELY IN PRODUCTION!");
        } else {
            console.log("ℹ️  Super Admin already exists.");
        }

        console.log("\n🎉 Migration completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Migration failed:", err);
        process.exit(1);
    }
};

migrate();
