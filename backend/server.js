import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import db from "./config/db.js"; 
import appointmentRoutes from "./routes/appointmentRoutes.js";
import labRoutes from "./routes/labRoutes.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/lab", labRoutes);



const PORT = process.env.PORT || 3002;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
