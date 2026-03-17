import express from "express";
import { addReport, fetchReports, performLabTest, giveMedicationToPatient } from "../controllers/LabResultController.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all test reports (filtered by role)
router.get("/reports", verifyToken, fetchReports);
router.get("/tests", verifyToken, fetchReports); // Aliasing for frontend context

// Add a new lab test (doctor or admin orders it)
router.post("/reports", verifyToken, authorizeRoles("admin", "doctor", "hospital_admin"), addReport);
router.post("/tests", verifyToken, authorizeRoles("admin", "doctor", "hospital_admin"), addReport);

// Perform test (enter result) — lab_technician, admin, doctor can all do this
router.put("/tests/:id/perform", verifyToken, authorizeRoles("admin", "doctor", "lab_technician", "hospital_admin"), performLabTest);

// Give medication
router.put("/tests/:id/medication", verifyToken, authorizeRoles("admin", "doctor", "lab_technician"), giveMedicationToPatient);

export default router;
