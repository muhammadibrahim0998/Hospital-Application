import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  addDoctor,
  getDoctors,
  getPatients,
  getAppointments,
  toggleDoctorStatus,
  editDoctor,
  removeDoctor,
} from "../controllers/AdminController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/*
  Protect all admin routes
*/
router.use(verifyToken, authorizeRoles("admin"));

/*
  Doctor CRUD
*/
router.post("/doctors", upload.single("image"), addDoctor);
router.get("/doctors", getDoctors);
router.put("/doctors/:id", upload.single("image"), editDoctor);
router.delete("/doctors/:id", removeDoctor);
router.put("/doctors/:id/status", toggleDoctorStatus);

export default router;
