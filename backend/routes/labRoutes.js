import express from "express";
import {
  addReport,
  fetchReports,
  performLabTest,
  giveMedicationToPatient,
  fetchPublicReports,
  fetchAppointmentReport,
  deleteReport
} from "../controllers/LabResultController.js";

import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. PUBLIC ENDPOINTS
router.get("/public/check-result/:cnic", fetchPublicReports);
router.get("/public/appointment-report/:appointmentId", fetchAppointmentReport);

// 2. PROTECTED ENDPOINTS (REPORTS & TESTS)
router.get("/reports", verifyToken, fetchReports);
router.get("/tests", verifyToken, fetchReports); 

router.post("/reports", verifyToken, authorizeRoles("admin", "doctor", "hospital_admin"), addReport);
router.post("/tests", verifyToken, authorizeRoles("admin", "doctor", "hospital_admin"), addReport);

router.put("/tests/:id/perform", verifyToken, authorizeRoles("admin", "doctor", "lab_technician", "hospital_admin"), performLabTest);
router.put("/tests/:id/medication", verifyToken, authorizeRoles("admin", "doctor", "lab_technician"), giveMedicationToPatient);

// DELETE Individual Test Result
router.delete("/reports/:id", verifyToken, authorizeRoles("admin", "doctor", "hospital_admin", "lab_technician"), deleteReport);

export default router;
