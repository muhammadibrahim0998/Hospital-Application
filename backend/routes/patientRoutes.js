import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";
import { bookAppointment, getDoctorsList, getMyAppointments } from "../controllers/PatientController.js";

const router = express.Router();

router.use(verifyToken, authorizeRoles("patient", "admin"));

router.post("/appointments", bookAppointment);
router.get("/doctors", getDoctorsList);
router.get("/appointments", getMyAppointments);

export default router;
