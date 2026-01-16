import db from "../config/db.js";

// Get all appointments
export const getAppointments = async () => {
  const [results] = await db.query("SELECT * FROM appointments ORDER BY id ASC");
  return results.map((r) => ({
    id: r.id,
    Patient: r.Patient,
    Doctor: r.Doctor,
    Date: r.Date,
    Time: r.Time,
    Phone: r.Phone,
    Fee: r.Fee,
  }));
};

// Create appointment
export const createAppointment = async (data) => {
  const { Patient, Doctor, Date, Time, Phone, Fee } = data;

  const [result] = await db.query(
    "INSERT INTO appointments (Patient, Doctor, Date, Time, Phone, Fee) VALUES (?, ?, ?, ?, ?, ?)",
    [Patient, Doctor, Date, Time, Phone, Fee]
  );

  return {
    id: result.insertId,
    Patient,
    Doctor,
    Date,
    Time,
    Phone,
    Fee,
  };
};

// Delete appointment
export const deleteAppointment = async (id) => {
  await db.query("DELETE FROM appointments WHERE id=?", [id]);
};
