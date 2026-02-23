import db from "./config/db.js";

const updateLabTable = async () => {
    try {
        console.log("Updating lab_results table...");

        const sql = `
            ALTER TABLE lab_results 
            ADD COLUMN cnic VARCHAR(20) NULL,
            ADD COLUMN description TEXT NULL,
            ADD COLUMN normal_range VARCHAR(255) NULL,
            ADD COLUMN price DECIMAL(10, 2) NULL,
            ADD COLUMN category VARCHAR(100) NULL,
            ADD COLUMN status ENUM('pending', 'done') DEFAULT 'pending',
            ADD COLUMN medication_given TEXT NULL;
        `;

        await db.query(sql);
        console.log("lab_results table updated successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Failed to update table:", err);
        process.exit(1);
    }
};

updateLabTable();
