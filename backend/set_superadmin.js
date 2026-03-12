import db from "./config/db.js";
import bcrypt from "bcryptjs";

const NEW_EMAIL = "ibrahim1530388@gmail.com";
const NEW_PASSWORD = "super12345";

async function setSuperAdmin() {
  try {
    const hash = await bcrypt.hash(NEW_PASSWORD, 10);

    // Check if a super_admin already exists
    const [existing] = await db.query(
      "SELECT * FROM users WHERE role = 'super_admin' LIMIT 1",
    );

    if (existing.length > 0) {
      // Update only email and password, nothing else
      const [res] = await db.query(
        "UPDATE users SET email = ?, password = ? WHERE role = 'super_admin'",
        [NEW_EMAIL, hash],
      );
      console.log("✅ Super Admin email and password updated successfully!");
      console.log("📧 Email:", NEW_EMAIL);
      console.log("🔑 Password:", NEW_PASSWORD);
    } else {
      // Create new super admin if none exists
      await db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'super_admin')",
        ["Super Admin", NEW_EMAIL, hash],
      );
      console.log("✅ Super Admin created successfully!");
      console.log("📧 Email:", NEW_EMAIL);
      console.log("🔑 Password:", NEW_PASSWORD);
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

setSuperAdmin();
