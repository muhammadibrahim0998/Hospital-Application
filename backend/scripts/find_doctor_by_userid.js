import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import db from "../config/db.js";
import { Doctor } from "../models/DoctorModel.js";

async function findByUser(userId) {
  try {
    const doc = await Doctor.findOne({ user_id: userId });
    if (!doc) {
      console.log("No doctor found for user_id", userId);
      process.exit(0);
    }
    console.log("Doctor id:", doc._id.toString());
    console.log("image:", doc.image);
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

const userId = process.argv[2];
if (!userId) {
  console.error("Usage: node find_doctor_by_userid.js <userId>");
  process.exit(1);
}
findByUser(userId);
