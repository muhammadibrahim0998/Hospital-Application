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

// General verification for all routes
router.use(verifyToken);

/*
  Doctor CRUD — scoped per hospital. restricted to admins.
*/
router.post("/doctors", authorizeRoles("admin", "hospital_admin"), upload.single("image"), addDoctor);
router.put("/doctors/:id", authorizeRoles("admin", "hospital_admin"), upload.single("image"), editDoctor);
router.delete("/doctors/:id", authorizeRoles("admin", "hospital_admin"), removeDoctor);
router.put("/doctors/:id/status", authorizeRoles("admin", "hospital_admin"), toggleDoctorStatus);

/*
  Scoped read endpoints — hospital_admin gets only their hospital,
  super_admin gets everything (no scope filter).
*/
router.get("/doctors", authorizeRoles("admin", "hospital_admin", "doctor"), scopeToHospital, getScopedDoctors);
router.get("/patients", authorizeRoles("admin", "hospital_admin", "doctor"), scopeToHospital, getScopedPatients);
router.get("/appointments", authorizeRoles("admin", "hospital_admin", "doctor"), scopeToHospital, getScopedAppointments);
router.get("/app-users", authorizeRoles("admin", "hospital_admin", "doctor"), scopeToHospital, getScopedAppUsers);

export default router;
