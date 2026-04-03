import mongoose from "mongoose";
import { User } from "./models/UserModel.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const NEW_EMAIL = "ibrahim1530388@gmail.com";
const NEW_PASSWORD = "super12345";

async function setSuperAdmin() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected.");

    const hash = await bcrypt.hash(NEW_PASSWORD, 10);

    // 1. Remove ALL existing super admins to ensure clean state
    console.log("Cleaning existing Super Admins...");
    await User.deleteMany({ role: 'super_admin' });

    // 2. Create the specific Super Admin requested by the user
    await User.create({
      name: "Super Admin",
      email: NEW_EMAIL,
      password: hash,
      role: 'super_admin'
    });

    console.log("✅ Super Admin set successfully!");
    console.log("📧 Email:", NEW_EMAIL);
    console.log("🔑 Password:", NEW_PASSWORD);
    console.log("🚀 All other super admin accounts were removed.");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

setSuperAdmin();
