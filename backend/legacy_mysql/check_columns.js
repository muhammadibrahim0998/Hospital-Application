import db from "./config/db.js";

const checkColumns = async () => {
    try {
        const [reports] = await db.query("SHOW COLUMNS FROM reports");
        console.log("Reports Columns:", reports.map(r => r.Field));

        const [appointments] = await db.query("SHOW COLUMNS FROM appointments");
        console.log("Appointments Columns:", appointments.map(r => r.Field));

        const [users] = await db.query("SHOW COLUMNS FROM users");
        console.log("Users Columns:", users.map(r => r.Field));
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
};

checkColumns();
