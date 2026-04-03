import db from "./config/db.js";

const checkPatientsTable = async () => {
    try {
        const [columns] = await db.query("SHOW COLUMNS FROM patients");
        console.log("Patients columns:");
        console.log(columns.map(c => c.Field));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkPatientsTable();
