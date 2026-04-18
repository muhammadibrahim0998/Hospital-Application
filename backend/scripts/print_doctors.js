import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import db from "../config/db.js";
import { Doctor } from "../models/DoctorModel.js";

async function printDoctors() {
  try {
    const docs = await Doctor.find()
      .limit(20)
      .select(
        "user_id hospital_id specialization image phone fee status created_at updatedAt",
      );
    console.log("Found", docs.length, "doctors");
    docs.forEach((d) => {
      console.log("---");
      console.log("id:", d._id.toString());
      console.log("user_id:", d.user_id?.toString());
      console.log("hospital_id:", d.hospital_id?.toString() || null);
      console.log("specialization:", d.specialization);
      console.log("image:", d.image);
      console.log("phone:", d.phone);
      console.log("fee:", d.fee);
      console.log("status:", d.status);
      console.log("created_at:", d.created_at);
      console.log("updatedAt:", d.updatedAt);
    });
    process.exit(0);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    process.exit(1);
  }
}

printDoctors();
