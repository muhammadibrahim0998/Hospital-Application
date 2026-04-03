import db from "./config/db.js";

const createLabTable = async () => {
    try {
        console.log("Creating lab_results table...");

        const sql = `
            CREATE TABLE IF NOT EXISTS lab_results (
                id INT AUTO_INCREMENT PRIMARY KEY,
                patient_name VARCHAR(255) NOT NULL,
                doctor_name VARCHAR(255) NOT NULL,
                test_name VARCHAR(255) NOT NULL,
                result VARCHAR(50) NOT NULL,
                date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        await db.query(sql);
        console.log("lab_results table created successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Failed to create table:", err);
        process.exit(1);
    }
};

createLabTable();
