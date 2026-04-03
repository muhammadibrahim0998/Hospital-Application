import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "./models/UserModel.js";
import Hospital, { HospitalAdmin } from "./models/HospitalModel.js";

dotenv.config();

const seed = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected.");

    // Clear existing data (optional, but good for a fresh start as requested)
    console.log("Cleaning database...");
    await User.deleteMany({});
    await Hospital.deleteMany({});
    await HospitalAdmin.deleteMany({});

    const password = "admin"; // Default password for testing
    const hash = await bcrypt.hash(password, 10);

    // 1. Create a Default Hospital
    console.log("Creating default hospital...");
    const hospital = await Hospital.create({
      name: "City General Hospital",
      address: "123 Healthcare Ave, Peshawar",
      phone: "091-1234567",
      email: "info@cityhospital.com",
      is_active: true
    });

    // 2. Create a Super Admin
    console.log("Creating Super Admin...");
    await User.create({
      name: "Super Admin",
      email: "superadmin@hospital.com",
      password: hash,
      role: "super_admin",
      gender: "Male",
      age: 35,
      phone: "0300-1112223"
    });

    // 3. Create a Hospital Admin
    console.log("Creating Hospital Admin...");
    await HospitalAdmin.create({
      hospital_id: hospital._id,
      name: "Hospital Admin",
      email: "admin@hospital.com",
      password: hash,
      role: "hospital_admin",
      is_active: true,
      gender: "Male",
      age: 30,
      phone: "0300-4445556",
      modules: {
        doctors: true,
        patients: true,
        appointments: true,
        lab: true,
        appUsers: true
      }
    });

    console.log("✅ Database Seeded Successfully!");
    console.log("\n--- LOGIN CREDENTIALS ---");
    console.log("SUPER ADMIN: superadmin@hospital.com / admin");
    console.log("HOSPITAL ADMIN: admin@hospital.com / admin");
    console.log("-------------------------\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding Error:", err);
    process.exit(1);
  }
};

seed();
