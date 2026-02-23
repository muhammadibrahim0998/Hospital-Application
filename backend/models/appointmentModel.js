import db from "../config/db.js";

// Create appointment
export const createAppointment = async (data) => {
  const { Doctor, DoctorPhone, Fee, Patient, Phone, CNIC, Date, Time, patient_id, doctor_id } = data;
  const sql = "INSERT INTO appointments (Doctor, DoctorPhone, Fee, Patient, Phone, CNIC, Date, Time, patient_id, doctor_id, status) VALUES (?,?,?,?,?,?,?,?,?,?, 'scheduled')";
  return await db.query(sql, [Doctor, DoctorPhone, Fee, Patient, Phone, CNIC, Date, Time, patient_id, doctor_id]);
};

// Get all appointments (Admin)
export const getAllAppointments = async () => {
  const sql = "SELECT * FROM appointments";
  const [rows] = await db.query(sql);
  return rows;
};

// Get appointments for a doctor (by ID)
export const getDoctorAppointments = async (doctorId) => {
  const sql = "SELECT * FROM appointments WHERE doctor_id = ?";
  const [rows] = await db.query(sql, [doctorId]);
  return rows;
};

// Get appointments for a patient (by ID)
export const getPatientAppointments = async (patientId) => {
  const sql = "SELECT * FROM appointments WHERE patient_id = ?";
  const [rows] = await db.query(sql, [patientId]);
  return rows;
};

// Update appointment status
export const updateAppointmentStatus = async (id, status) => {
  const sql = "UPDATE appointments SET status = ? WHERE id = ?";
  return await db.query(sql, [status, id]);
};

// Delete appointment
export const deleteAppointment = async (id) => {
  const sql = "DELETE FROM appointments WHERE id = ?";
  return await db.query(sql, [id]);
};
