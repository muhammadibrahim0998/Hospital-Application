import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/UserModel.js";
import dotenv from "dotenv";
dotenv.config();

async function checkAndFix() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { family: 4 });
    console.log("✅ Connected to MongoDB Atlas");

    const email = "ibrahim1530388@gmail.com";
    const password = "super12345";
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // 1. Check if user exists ANYWHERE in the collection
    const allUsers = await User.find({ role: "super_admin" });
    console.log(`🔍 Found ${allUsers.length} existing super_admins`);

    // 2. Force update or create
    const result = await User.findOneAndUpdate(
      { email: { $regex: `^${email}$`, $options: "i" } },
      { 
        $set: { 
          name: "Super Admin",
          password: hash, 
          role: "super_admin",
          email: email.toLowerCase() // Ensure consistent case
        } 
      },
      { upsert: true, new: true }
    );

    console.log("🚀 SuperAdmin target record updated:");
    console.log({ 
        id: result._id, 
        email: result.email, 
        role: result.role,
        name: result.name 
    });

    // 3. Verify specifically
    const verify = await User.findOne({ email: email.toLowerCase() });
    const isMatch = await bcrypt.compare(password, verify.password);
    console.log(`✅ Final Verification: Password match for ${verify.email} is ${isMatch}`);

    mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error during fix:", err);
    process.exit(1);
  }
}

checkAndFix();
