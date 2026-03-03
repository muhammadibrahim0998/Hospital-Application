const mysql = require('mysql2/promise');
require('dotenv').config();

const test = async () => {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'rootuser',
        database: process.env.DB_NAME || 'hospital_system'
    });

    try {
        console.log("Checking columns...");
        const [usersCols] = await db.query("SHOW COLUMNS FROM users");
        console.log("USERS:", usersCols.map(c => c.Field));

        const [adminCols] = await db.query("SHOW COLUMNS FROM hospital_admins");
        console.log("ADMINS:", adminCols.map(c => c.Field));

        const [doctorsCols] = await db.query("SHOW COLUMNS FROM doctors");
        console.log("DOCTORS:", doctorsCols.map(c => c.Field));

    } catch (err) {
        console.error("ERROR:", err);
    } finally {
        await db.end();
    }
};

test();
