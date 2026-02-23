import db from "./config/db.js";

const createMessagesTable = async () => {
    try {
        console.log("Creating messages table...");

        const sql = `
            CREATE TABLE IF NOT EXISTS messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                sender_id INT NOT NULL,
                receiver_id INT NOT NULL,
                message TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;

        await db.query(sql);
        console.log("messages table created successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Failed to create table:", err);
        process.exit(1);
    }
};

createMessagesTable();
