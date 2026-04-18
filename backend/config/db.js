import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  const primaryUrl = process.env.MONGODB_URI || process.env.MONGODB_URL;
  const localFallback = "mongodb://127.0.0.1:27017/hospital_management_system";

  if (!primaryUrl && process.env.NODE_ENV === "production") {
    console.error("❌ DB Connection Error: MONGODB_URI or MONGODB_URL is missing in your environment variables!");
    process.exit(1);
  }

  try {
    // Try Primary (Atlas) URL first
    if (primaryUrl) {
      console.log("Attempting to connect to Online Database (Atlas)...");
      const conn = await mongoose.connect(primaryUrl, { family: 4 });
      console.log(`✅ MongoDB Online Connected: ${conn.connection.host} 🚀`);
      return;
    }
  } catch (error) {
    console.warn(`⚠️ Online DB Connection Failed: ${error.message}`);
  }

  try {
    // Fallback to Local
    console.log("Attempting to connect to Local Database...");
    const conn = await mongoose.connect(localFallback, { family: 4 });
    console.log(`✅ MongoDB Local Connected: ${conn.connection.host} 🚀`);
  } catch (error) {
    console.error(`❌ DB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Auto-connect
connectDB();

export default mongoose;
