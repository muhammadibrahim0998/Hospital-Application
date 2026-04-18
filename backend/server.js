import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import labRoutes from "./routes/labRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import LabResult from "./models/LabResultModel.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Production-ready CORS: Strictly allows specified origins
app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.FRONTENT_URL, "http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(express.json());

// Root route for alive confirmation
app.get("/", (_req, res) =>
  res.json({
    message: "Hospital Management System API is LIVE",
    status: "success",
    database: "connected",
  }),
);

// Health check
app.get("/healthz", (_req, res) => res.send("OK"));

// Static uploads
// Static uploads - Using absolute path for local reliability
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/super-admin", superAdminRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/lab", labRoutes);
app.use("/api/messages", messageRoutes);

// ✅ Reports endpoint (MongoDB version)
app.get("/api/reports", async (req, res) => {
  try {
    const rows = await LabResult.find().sort({ created_at: -1 });
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Test endpoint
app.get("/test", (req, res) => {
  res.json({ message: "Backend working with MongoDB" });
});

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
