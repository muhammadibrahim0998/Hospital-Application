import db from "./config/db.js";

const checkColumns = async () => {
    try {
        console.log("Checking patients table columns...");
        const [columns] = await db.query("SHOW COLUMNS FROM patients");
        console.log(columns);
        process.exit(0);
    } catch (err) {
        console.error("Check failed:", err);
        process.exit(1);
    }
};

checkColumns();
