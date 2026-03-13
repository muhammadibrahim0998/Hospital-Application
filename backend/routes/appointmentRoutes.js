import express from "express";
import {
  fetchAppointments,
  addAppointment,
  removeAppointment,
  editAppointment,
} from "../controllers/appointmentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, fetchAppointments);
router.post("/", verifyToken, addAppointment);
router.put("/:id", verifyToken, editAppointment);
router.delete("/:id", verifyToken, removeAppointment);

export default router;
