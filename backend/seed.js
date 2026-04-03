import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/UserModel.js";
import SuperAdmin from "./models/SuperAdminModel.js";
import db from "./config/db.js"; // This triggers connection

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || "[EMAIL_ADDRESS]";
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || "[PASSWORD]";

async function seedSuperAdmin() {
  try {
    console.log("🛠️ Starting Super Admin seeding...");

    const hash = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 10);

    // 1. Manage User record
    let user = await User.findOne({ role: "super_admin" });

    if (user) {
      // Update existing record
      user.email = SUPER_ADMIN_EMAIL;
      user.password = hash;
      user.name = "Super Admin";
      await user.save();
      console.log("✅ Super Admin User credentials updated!");
    } else {
      // Create new user record
      user = await User.create({
        name: "Super Admin",
        email: SUPER_ADMIN_EMAIL,
        password: hash,
        role: "super_admin",
      });
      console.log("✅ Super Admin User created successfully!");
    }

    // 2. Manage SuperAdmin specialized record
    const superAdminRecord = await SuperAdmin.findOne({ user_id: user._id });
    if (!superAdminRecord) {
      await SuperAdmin.create({
        user_id: user._id,
        permissions: ['all'],
        status: 'active'
      });
      console.log("✅ SuperAdmin specialized record created!");
    } else {
      console.log("ℹ️ SuperAdmin specialized record already exists.");
    }

    console.log("📧 Super Admin Email:", SUPER_ADMIN_EMAIL);

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
