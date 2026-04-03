import db from "./config/db.js";

async function check() {
    const [apps] = await db.query("SELECT * FROM appointments");
    console.log(apps);
    process.exit(0);
}
check();
