import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";
import { bookAppointment, getDoctorsList, getMyAppointments } from "../controllers/PatientController.js";

const router = express.Router();

// Public routes (no token required)
router.get("/doctors", getDoctorsList);

// Protected routes (token and role required)
router.get("/appointments", verifyToken, authorizeRoles("patient", "admin"), getMyAppointments);

export default router;
