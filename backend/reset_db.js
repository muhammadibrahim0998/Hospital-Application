import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "./models/UserModel.js";
import { Hospital, HospitalAdmin } from "./models/HospitalModel.js";

dotenv.config();

const reset = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to", process.env.MONGODB_URI);

    // 1. Clear ALL collections
    console.log("Cleaning ALL collections...");
    await User.deleteMany({});
    await Hospital.deleteMany({});
    await HospitalAdmin.deleteMany({});
    // Also clean others if they exist
    try { await mongoose.connection.db.collection('doctors').deleteMany({}); } catch(e) {}
    try { await mongoose.connection.db.collection('patients').deleteMany({}); } catch(e) {}
    try { await mongoose.connection.db.collection('appointments').deleteMany({}); } catch(e) {}
    try { await mongoose.connection.db.collection('labresults').deleteMany({}); } catch(e) {}
    try { await mongoose.connection.db.collection('labtests').deleteMany({}); } catch(e) {}
    try { await mongoose.connection.db.collection('messages').deleteMany({}); } catch(e) {}

    const adminHash = await bcrypt.hash("admin", 10);
    const superHash = await bcrypt.hash("super12345", 10);

    // 2. Create a Hospital
    console.log("Creating Hospital...");
    const hospital = await Hospital.create({
      name: "Smart Pathology Lab & Hospital",
      address: "Peshawar, Pakistan",
      phone: "091-1234567",
      email: "info@smartlab.com",
      is_active: true
    });

    // 3. Create Super Admin (The one the user wants)
    console.log("Creating Super Admin...");
    await User.create({
      name: "Ibrahim",
      email: "ibrahim1530388@gmail.com",
      password: superHash,
      role: 'super_admin'
    });

    // 4. Create Hospital Admin
    console.log("Creating Hospital Admin...");
    await HospitalAdmin.create({
      hospital_id: hospital._id,
      name: "Hospital Admin",
      email: "admin@hospital.com", // Classic fallback
      password: adminHash,
      role: 'hospital_admin',
      is_active: true,
      modules: { doctors: true, patients: true, appointments: true, lab: true, appUsers: true }
    });

    console.log("✅ Database Reset and Seeded Successfully!");
    console.log("\n--- CREDENTIALS ---");
    console.log("SUPER ADMIN: ibrahim1530388@gmail.com / super12345");
    console.log("HOSPITAL ADMIN: admin@hospital.com / admin");
    console.log("-------------------\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Reset Error:", err);
    process.exit(1);
  }
};

reset();
