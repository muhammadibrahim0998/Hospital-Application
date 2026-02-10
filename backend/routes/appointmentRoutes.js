import express from "express";
import {
  fetchAppointments,
  addAppointment,
  removeAppointment,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.get("/", fetchAppointments);
router.post("/", addAppointment);
router.delete("/:id", removeAppointment);

export default router;
