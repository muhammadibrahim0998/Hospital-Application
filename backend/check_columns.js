import db from "./config/db.js";

const checkColumns = async () => {
    try {
        const [rows] = await db.query("SHOW COLUMNS FROM lab_tests");
        console.log("Columns:", rows.map(r => r.Field));
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
};

checkColumns();
