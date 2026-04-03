import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        const url = process.env.MONGODB_URL;
        if (!url) {
            throw new Error("MONGODB_URI is missing in your .env file!");
        }

        const conn = await mongoose.connect(url, {
            family: 4 // Force IPv4 to avoid Atlas DNS/IPv6 issues
        });

        console.log(`📡 Connecting to: ${url.split("@")[1] || "Secure DB"}`);
        console.log(`MongoDB Connected: ${conn.connection.host} 🚀`);
    } catch (error) {
        console.error(`❌ DB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

// Auto-connect
connectDB();

export default mongoose;
