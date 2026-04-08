import mongoose from 'mongoose';
const url = "mongodb+srv://DB_User:admin123@cluster0.qzgiptf.mongodb.net/hospital_management_system?retryWrites=true&w=majority";

async function testAtlas() {
    try {
        console.log("Testing Atlas connection...");
        await mongoose.connect(url, { family: 4 });
        console.log("Atlas connected successfully! ✅");
        process.exit(0);
    } catch (err) {
        console.error("Atlas connection failed: ❌", err.message);
        process.exit(1);
    }
}
testAtlas();
