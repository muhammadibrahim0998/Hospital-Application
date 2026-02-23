import express from "express";
import {
  fetchAppointments,
  addAppointment,
  removeAppointment,
} from "../controllers/appointmentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, fetchAppointments);
router.post("/", verifyToken, addAppointment);
router.delete("/:id", verifyToken, removeAppointment);

export default router;
