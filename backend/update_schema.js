import db from "./config/db.js";

const updateSchema = async () => {
    try {
        console.log("Adding missing columns...");
        await db.query("ALTER TABLE lab_tests ADD COLUMN status VARCHAR(20) DEFAULT 'pending'");
        console.log("Added status column");
        await db.query("ALTER TABLE lab_tests ADD COLUMN result TEXT");
        console.log("Added result column");
        await db.query("ALTER TABLE lab_tests ADD COLUMN medicationGiven TEXT");
        console.log("Added medicationGiven column");
        console.log("Schema updated successfully");
    } catch (err) {
        console.error("Schema update failed:", err);
    } finally {
        process.exit();
    }
};

updateSchema();
