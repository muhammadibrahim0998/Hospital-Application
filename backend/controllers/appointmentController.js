import {
  getAllAppointments as getAppointments,
  createAppointment,
  deleteAppointment,
  getDoctorAppointments,
  getPatientAppointments
} from "../models/AppointmentModel.js";

export const fetchAppointments = async (req, res) => {
  try {
    let appointments;
    const role = req.userRole?.toLowerCase();

    if (role === "admin") {
      appointments = await getAppointments();
    } else if (role === "doctor") {
      appointments = await getDoctorAppointments(req.userId);
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
