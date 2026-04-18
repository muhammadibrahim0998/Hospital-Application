import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import db from "../config/db.js";
import { Doctor } from "../models/DoctorModel.js";

async function setDefaultImages() {
  try {
    // Default image URL (external) — can be changed to local /uploads path if you add a file there
    const defaultImage = "https://img.icons8.com/color/96/doctor-male.png";

    const res = await Doctor.updateMany(
      { $or: [{ image: null }, { image: "" }] },
      { $set: { image: defaultImage } },
    );
    console.log(`Matched: ${res.matchedCount}, Modified: ${res.modifiedCount}`);
    process.exit(0);
  } catch (err) {
    console.error("Error setting default images:", err);
    process.exit(1);
  }
}

setDefaultImages();
