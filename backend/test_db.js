import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.MONGODB_URL;

async function test() {
    try {
        console.log("Connecting to:", url.split("@")[1]);
        await mongoose.connect(url);
        console.log("Connected!");

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));

        const userCount = await db.collection("users").countDocuments();
        console.log("User count in 'users':", userCount);

        const superAdminUsers = await db.collection("users").find({ role: "super_admin" }).toArray();
        console.log("Super Admins in 'users':", superAdminUsers.map(u => u.email));

        const saRecordCount = await db.collection("superadmins").countDocuments();
        console.log("Record count in 'superadmins':", saRecordCount);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

test();
