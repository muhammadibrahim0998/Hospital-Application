import db from "./config/db.js";

const checkRoles = async () => {
    try {
        const [users] = await db.query("SELECT * FROM users");
        console.log("All Users:", users);
        process.exit(0);
    } catch (err) {
        console.error("Failed to check roles:", err);
        process.exit(1);
    }
};

checkRoles();
