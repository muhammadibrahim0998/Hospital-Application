import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";
import { getMyAppointments, getProfile, updateStatus, updateProfile } from "../controllers/DoctorController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.use(verifyToken, authorizeRoles("doctor", "admin"));

router.get("/appointments", getMyAppointments);
router.get("/profile", getProfile);
router.put("/profile", upload.single("image"), updateProfile);
router.put("/appointments/:id/status", updateStatus);

export default router;
