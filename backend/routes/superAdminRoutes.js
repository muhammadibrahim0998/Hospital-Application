import express from "express";
import { verifyToken, requireSuperAdmin } from "../middleware/authMiddleware.js";
import {
    addHospital,
    listHospitals,
    editHospital,
    removeHospital,
    addHospitalAdmin,
    listHospitalAdmins,
    editHospitalAdmin,
    setHospitalAdminModules,
    removeHospitalAdmin,
    fetchAllAppUsers,
    updateAppUser,
    deleteAppUser,
    fetchProjectStats,
} from "../controllers/SuperAdminController.js";

const router = express.Router();

// All super-admin routes require token + super_admin role
router.use(verifyToken, requireSuperAdmin);

// ─── Hospitals & Projects ──────────────────────────────
router.get("/hospitals", listHospitals);
router.post("/hospitals", addHospital);
router.put("/hospitals/:id", editHospital);
router.delete("/hospitals/:id", removeHospital);

// ─── Project Stats ─────────────────────────────────────
router.get("/project-stats", fetchProjectStats);

// ─── Hospital Admins ───────────────────────────────────
router.get("/hospital-admins", listHospitalAdmins);
router.post("/hospital-admins", addHospitalAdmin);
router.put("/hospital-admins/:id", editHospitalAdmin);
router.put("/hospital-admins/:id/modules", setHospitalAdminModules);
router.delete("/hospital-admins/:id", removeHospitalAdmin);

// ─── App Users (all hospitals) ─────────────────────────
router.get("/app-users", fetchAllAppUsers);
router.put("/app-users/:id", updateAppUser);
router.delete("/app-users/:id", deleteAppUser);

export default router;
