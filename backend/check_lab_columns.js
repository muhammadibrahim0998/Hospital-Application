import db from "./config/db.js";

const checkLabColumns = async () => {
    try {
        console.log("Checking lab_results table columns...");
        const [columns] = await db.query("SHOW COLUMNS FROM lab_results");
        console.log(columns);
        process.exit(0);
    } catch (err) {
        console.error("Check failed:", err);
        process.exit(1);
    }
};

checkLabColumns();
