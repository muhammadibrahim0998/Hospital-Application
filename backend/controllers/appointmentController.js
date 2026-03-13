import {
  getAllAppointments as getAppointments,
  createAppointment,
  deleteAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  updateAppointment
} from "../models/AppointmentModel.js";
import { getDoctorByUserId } from "../models/DoctorModel.js";

export const fetchAppointments = async (req, res) => {
  try {
    let appointments = [];
    const role = req.userRole?.toLowerCase();

    if (role === "admin" || role === "super_admin" || role === "hospital_admin") {
      appointments = await getAppointments();
    } else if (role === "doctor") {
      const doctor = await getDoctorByUserId(req.userId);
      if (doctor) {
        appointments = await getDoctorAppointments(doctor.id);
      }
    } else {
      appointments = await getPatientAppointments(req.userId);
    }

    res.json(appointments || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addAppointment = async (req, res) => {
  try {
    const appt = await createAppointment(req.body);
    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeAppointment = async (req, res) => {
  try {
    await deleteAppointment(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const editAppointment = async (req, res) => {
  try {
    await updateAppointment(req.params.id, req.body);
    res.json({ message: "Updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
