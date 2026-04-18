import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import db from "../config/db.js";
import { Doctor } from "../models/DoctorModel.js";

async function setImageForDoctor(id, imageUrl) {
  try {
    const res = await Doctor.findByIdAndUpdate(
      id,
      { $set: { image: imageUrl } },
      { new: true },
    );
    if (!res) {
      console.error("Doctor not found:", id);
      process.exit(1);
    }
    console.log("Updated doctor:", res._id.toString(), "image ->", res.image);
    process.exit(0);
  } catch (err) {
    console.error("Error updating doctor image:", err);
    process.exit(1);
  }
}

const DOCTOR_ID = process.argv[2];
const IMAGE =
  process.argv[3] || "https://img.icons8.com/color/96/doctor-male.png";

if (!DOCTOR_ID) {
  console.error("Usage: node set_one_doctor_image.js <doctorId> [imageUrl]");
  process.exit(1);
}

setImageForDoctor(DOCTOR_ID, IMAGE);
