import {
  getAppointments,
  getAppointmentsByCNIC,
  createAppointment,
  deleteAppointment,
} from "../models/appointmentModel.js";

export const fetchAppointments = async (req, res) => {
  try {
    const { cnic } = req.query;
    const data = cnic
      ? await getAppointmentsByCNIC(cnic)
      : await getAppointments();
    res.json(data);
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
