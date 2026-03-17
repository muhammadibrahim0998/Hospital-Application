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
  addLabTechnician,
  getLabTechnicians,
  editLabTechnician,
  removeLabTechnician,
} from "../controllers/AdminController.js";
import {
  getScopedDoctors,
  getScopedPatients,
  getScopedAppointments,
  getScopedAppUsers,
} from "../controllers/HospitalAdminController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Log that this file is loaded
console.log(">>> [adminRoutes.js] Initializing Admin Router");

// Public diagnostic route (no token required)
router.get("/public-test", (req, res) => {
  res.send("Admin Router is ACTIVE and PUBLIC");
});

// General verification for all routes
router.use(verifyToken);

// Diagnostic route
router.get("/test", (req, res) => {
  console.log(">>> [adminRoutes.js] Auth test hit!");
  res.json({ message: "Admin router is reachable and authorized" });
});

/*
  Lab Technician CRUD — for hospital_admin
*/
router.post("/lab-technicians", authorizeRoles("admin", "hospital_admin"), addLabTechnician);
router.get("/lab-technicians", authorizeRoles("admin", "hospital_admin"), getLabTechnicians);
router.put("/lab-technicians/:id", authorizeRoles("admin", "hospital_admin"), editLabTechnician);
router.delete("/lab-technicians/:id", authorizeRoles("admin", "hospital_admin"), removeLabTechnician);

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
router.get("/doctors", authorizeRoles("admin", "hospital_admin", "doctor", "lab_technician"), scopeToHospital, getScopedDoctors);
router.get("/patients", authorizeRoles("admin", "hospital_admin", "doctor"), scopeToHospital, getScopedPatients);
router.get("/appointments", authorizeRoles("admin", "hospital_admin", "doctor"), scopeToHospital, getScopedAppointments);
router.get("/app-users", authorizeRoles("admin", "hospital_admin", "doctor"), scopeToHospital, getScopedAppUsers);


export default router;
