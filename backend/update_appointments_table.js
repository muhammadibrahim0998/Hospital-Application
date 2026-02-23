import db from "./config/db.js";

const updateAppointmentsTable = async () => {
    try {
        console.log("Updating appointments table...");

        // Add patient_id and doctor_id columns (using user_ids for easier chat integration)
        const sql = `
            ALTER TABLE appointments 
            ADD COLUMN patient_id INT NULL,
            ADD COLUMN doctor_id INT NULL;
        `;

        await db.query(sql);
        console.log("appointments table updated successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Failed to update table:", err);
        process.exit(1);
    }
};

updateAppointmentsTable();
