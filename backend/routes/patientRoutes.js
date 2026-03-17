import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";
import { bookAppointment, getDoctorsList, getMyAppointments } from "../controllers/PatientController.js";

const router = express.Router();

router.get("/doctors", authorizeRoles("patient", "admin", "lab_technician", "doctor"), getDoctorsList);
router.get("/appointments", authorizeRoles("patient", "admin"), getMyAppointments);

export default router;
