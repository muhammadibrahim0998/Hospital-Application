import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/UserModel.js";
import dotenv from "dotenv";
dotenv.config();

// Direct import to force connection if db.js is being weird in one-off scripts
await mongoose.connect(process.env.MONGODB_URI, { family: 4 });
console.log("Connected to MongoDB...");

const email = "ibrahim1530388@gmail.com";
const password = "super12345";
const hash = await bcrypt.hash(password, 10);

const result = await User.findOneAndUpdate(
  { email: { $regex: `^${email}$`, $options: "i" } },
  { 
    $set: { 
      password: hash, 
      role: "super_admin",
      name: "Super Admin"
    } 
  },
  { upsert: true, new: true }
);

console.log("SuperAdmin record updated/created:", result.email, result.role);
process.exit(0);
