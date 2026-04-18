import mongoose from "../config/db.js";
import Doctor from "../models/DoctorModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const migrate = async () => {
    try {
        console.log("Starting image migration (Local Path -> Base64)...");
        
        const doctors = await Doctor.find({});
        console.log(`Found ${doctors.length} doctors.`);

        let updatedCount = 0;

        for (const doc of doctors) {
            if (doc.image && doc.image.startsWith("/uploads/")) {
                // Correct path construction
                // doc.image is like "/uploads/doctors/123.jpg"
                const relativePath = doc.image.replace(/^\//, ""); // "uploads/doctors/123.jpg"
                const fullPath = path.join(__dirname, "..", relativePath);

                if (fs.existsSync(fullPath)) {
                    console.log(`Converting image for ${doc._id}: ${doc.image}`);
                    const fileData = fs.readFileSync(fullPath);
                    const mimeType = path.extname(fullPath).toLowerCase() === ".png" ? "image/png" : "image/jpeg";
                    const base64 = `data:${mimeType};base64,${fileData.toString("base64")}`;
                    
                    await Doctor.findByIdAndUpdate(doc._id, { image: base64 });
                    updatedCount++;
                } else {
                    console.warn(`⚠️ File not found for ${doc._id}: ${fullPath}`);
                }
            }
        }

        console.log(`✅ Migration completed! Updated ${updatedCount} doctors.`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Migration failed:", error);
        process.exit(1);
    }
};

migrate();
