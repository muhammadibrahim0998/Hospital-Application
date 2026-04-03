import db from "./config/db.js";

const updateSchema = async () => {
    try {
        console.log("Updating appointments table schema for legacy support...");

        // 1. Make patient_id and doctor_id nullable
        await db.query("ALTER TABLE appointments MODIFY COLUMN patient_id INT NULL");
        await db.query("ALTER TABLE appointments MODIFY COLUMN doctor_id INT NULL");
        console.log("Made FK columns nullable.");

        // 2. Add legacy columns if they don't exist
        const legacyColumns = [
            "ADD COLUMN Patient VARCHAR(255)",
            "ADD COLUMN Doctor VARCHAR(255)",
            "ADD COLUMN DoctorPhone VARCHAR(50)",
            "ADD COLUMN Phone VARCHAR(50)",
            "ADD COLUMN CNIC VARCHAR(50)",
            "ADD COLUMN Fee VARCHAR(50)",
            "ADD COLUMN Date VARCHAR(50)", // Keeping as string to match frontend 'YYYY-MM-DD'
            "ADD COLUMN Time VARCHAR(50)"
        ];

        for (const col of legacyColumns) {
            try {
                await db.query(`ALTER TABLE appointments ${col}`);
                console.log(`Executed: ${col}`);
            } catch (err) {
                if (err.code === 'ER_DUP_FIELDNAME') {
                    // console.log(`Skipping: ${col} (already exists)`);
                } else {
                    console.error(`Error adding column: ${err.message}`);
                }
            }
        }

        console.log("Schema update completed.");
        process.exit(0);
    } catch (err) {
        console.error("Schema update failed:", err);
        process.exit(1);
    }
};

updateSchema();
