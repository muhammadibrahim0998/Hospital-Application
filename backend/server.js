import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import db from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import labRoutes from "./routes/labRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/healthz", (_req, res) => res.send("OK"));

// Static
app.use("/uploads", express.static("uploads"));

// Auth (login / register)
app.use("/api/auth", authRoutes);

// Super Admin — full platform control
app.use("/api/super-admin", superAdminRoutes);

// Hospital Admin / Admin — scoped per hospital
app.use("/api/admin", adminRoutes);

// Other resource routes
app.use("/api/doctor", doctorRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/lab", labRoutes);
app.use("/api/messages", messageRoutes);

// Legacy reports endpoint

// Legacy reports endpoint
app.get("/api/reports", async (req, res) => {
  const query = "SELECT * FROM reports ORDER BY id DESC";
  try {
   
    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

