import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        const url = process.env.MONGODB_URI || process.env.DATABASE_URL;
        if (!url) throw new Error("Database URI (MONGODB_URI) is missing in .env!");

        const conn = await mongoose.connect(url, {
            family: 4 // Force IPv4 to avoid Atlas DNS/IPv6 issues
        });
        console.log(`MongoDB Connected: ${conn.connection.host} 🚀`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Auto-connect
connectDB();

export default mongoose;
