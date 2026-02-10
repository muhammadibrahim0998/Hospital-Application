import db from "./config/db.js";

const testDB = async () => {
    try {
        console.log("Attempting to connect and insert...");
        const [result] = await db.query(
            "INSERT INTO lab_tests (test_name, description, normal_range, price, category, status) VALUES (?, ?, ?, ?, ?, 'pending')",
            ["Debug Test", "Debug Desc", "10-20", 100, "Debug Cat"]
        );
        console.log("Success:", result);
    } catch (err) {
        console.error("FULL ERROR DETAILS:", err);
    } finally {
        process.exit();
    }
};

testDB();
