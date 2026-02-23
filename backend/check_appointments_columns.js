import db from "./config/db.js";

const checkColumns = async () => {
    try {
        console.log("Checking appointments table columns...");
        const [columns] = await db.query("SHOW COLUMNS FROM appointments");
        console.log(columns);
        process.exit(0);
    } catch (err) {
        console.error("Check failed:", err);
        process.exit(1);
    }
};

checkColumns();
