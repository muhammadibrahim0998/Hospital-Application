import db from "./config/db.js";

const createTables = async () => {
    try {
        console.log("Initializing database tables...");

        // Users Table
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'doctor', 'patient') DEFAULT 'patient',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Users table created/verified.");

        // Doctors Table
        await db.query(`
            CREATE TABLE IF NOT EXISTS doctors (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                specialization VARCHAR(255),
                contact_info VARCHAR(255),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log("Doctors table created/verified.");

        // Patients Table
        await db.query(`
            CREATE TABLE IF NOT EXISTS patients (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                contact_info VARCHAR(255),
                medical_history TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log("Patients table created/verified.");

        // Appointments Table
        await db.query(`
            CREATE TABLE IF NOT EXISTS appointments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                patient_id INT NOT NULL,
                doctor_id INT NOT NULL,
                appointment_date DATETIME NOT NULL,
                status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
                FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
                FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
            )
        `);
        console.log("Appointments table created/verified.");

        console.log("Database initialization completed successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Error initializing database:", err);
        process.exit(1);
    }
};

createTables();
