import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../backend/.env") });

const connectDB = async () => {
    try {
        const url = process.env.MONGODB_URI;
        console.log(`Connecting to: ${url}`);
        await mongoose.connect(url, { family: 4 });
        console.log("SUCCESS: MongoDB Connected! ✅");

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Collections internal to database:");
        const firstHospital = await mongoose.connection.db.collection('hospitals').findOne();
        if (firstHospital) {
            const hId = firstHospital._id;
            console.log(`Found Hospital: ${firstHospital.name} (${hId})`);

            // Fix existing collections with missing hospital_id
            const toFix = ['appointments', 'doctors', 'patients', 'users'];
            for (const col of toFix) {
                const result = await mongoose.connection.db.collection(col).updateMany(
                    { hospital_id: null },
                    { $set: { hospital_id: hId } }
                );
                console.log(` - Fixed ${result.modifiedCount} docs in ${col} with hospital_id: ${hId}`);
            }
        } else {
            console.warn("No hospital found to link data items!");
        }

        const sampleDoc = await mongoose.connection.db.collection('doctors').findOne();
        console.log("Sample Doctor Profile:", JSON.stringify(sampleDoc, null, 2));

        const sampleHA = await mongoose.connection.db.collection('hospitaladmins').findOne();
        console.log("Sample Hospital Admin:", JSON.stringify(sampleHA, null, 2));

        const sampleUser = await mongoose.connection.db.collection('users').findOne();
        console.log("Sample User Account:", JSON.stringify(sampleUser, null, 2));

        process.exit(0);
    } catch (error) {
        console.error(`FAILURE: DB Connection Error: ${error.message} ❌`);
        process.exit(1);
    }
};

connectDB();
