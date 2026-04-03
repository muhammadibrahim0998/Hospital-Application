import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "./config/db.js"; // Mongoose connection
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import labRoutes from "./routes/labRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import LabResult from "./models/LabResultModel.js";

dotenv.config();

const app = express();

// Enable CORS to allow the frontend to communicate with this backend.
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// Health check
app.get("/healthz", (_req, res) => res.send("OK"));

// Static uploads
app.use("/uploads", express.static("uploads"));

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
