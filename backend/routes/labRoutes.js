import express from "express";
import { addReport, fetchReports, performLabTest, giveMedicationToPatient } from "../controllers/LabResultController.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all test reports (filtered by role)
router.get("/reports", verifyToken, fetchReports);
router.get("/tests", verifyToken, fetchReports); // Aliasing for frontend context

// Add a new lab test
router.post("/reports", verifyToken, authorizeRoles("admin", "doctor"), addReport);
router.post("/tests", verifyToken, authorizeRoles("admin", "doctor"), addReport);

// Perform test (update result)
router.put("/tests/:id/perform", verifyToken, authorizeRoles("admin", "doctor"), performLabTest);

// Give medication
router.put("/tests/:id/medication", verifyToken, authorizeRoles("admin", "doctor"), giveMedicationToPatient);

export default router;
