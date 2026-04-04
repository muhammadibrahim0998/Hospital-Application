import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/UserModel.js";
import db from "./config/db.js"; // This triggers connection

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || "[EMAIL_ADDRESS]";
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || "[PASSWORD]";

async function seedSuperAdmin() {
  try {
    console.log("🛠️ Starting Super Admin seeding...");

    const hash = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 10);

    // Check if a super_admin already exists
    const existing = await User.findOne({ role: "super_admin" });

    if (existing) {
      // Update only email and password
      existing.email = SUPER_ADMIN_EMAIL;
      existing.password = hash;
      existing.name = "Super Admin"; // Ensure name is correct
      await existing.save();
      console.log("✅ Super Admin credentials updated successfully!");
    } else {
      // Create new super admin
      await User.create({
        name: "Super Admin",
        email: SUPER_ADMIN_EMAIL,
        password: hash,
        role: "super_admin",
      });
      console.log("✅ Super Admin created successfully!");
    }

    console.log("📧 Email:", SUPER_ADMIN_EMAIL);

    mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding Error:", err.message);
    process.exit(1);
  }
}

// Since db.js auto-connects, we wait for the connection event
mongoose.connection.on("connected", () => {
  seedSuperAdmin();
});

mongoose.connection.on("error", (err) => {
  console.error("❌ DB Connection Error in Seed script:", err.message);
  process.exit(1);
});
