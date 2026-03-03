import express from "express";
import { verifyToken, authorizeRoles, scopeToHospital } from "../middleware/authMiddleware.js";
import {
  addDoctor,
  getDoctors,
  getPatients,
  getAppointments,
  toggleDoctorStatus,
  editDoctor,
  removeDoctor,
} from "../controllers/AdminController.js";
import {
  getScopedDoctors,
  getScopedPatients,
  getScopedAppointments,
  getScopedAppUsers,
} from "../controllers/HospitalAdminController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/*
  Protect all admin routes.
  Allow both "admin" (legacy), "hospital_admin", and "super_admin" (bypasses via authorizeRoles).
*/
router.use(verifyToken, authorizeRoles("admin", "hospital_admin"));

/*
  Doctor CRUD — scoped per hospital
*/
router.post("/doctors", upload.single("image"), addDoctor);
router.put("/doctors/:id", upload.single("image"), editDoctor);
router.delete("/doctors/:id", removeDoctor);
router.put("/doctors/:id/status", toggleDoctorStatus);

/*
  Scoped read endpoints — hospital_admin gets only their hospital,
  super_admin gets everything (no scope filter).
*/
router.get("/doctors", scopeToHospital, getScopedDoctors);
router.get("/patients", scopeToHospital, getScopedPatients);
router.get("/appointments", scopeToHospital, getScopedAppointments);
router.get("/app-users", scopeToHospital, getScopedAppUsers);

export default router;
