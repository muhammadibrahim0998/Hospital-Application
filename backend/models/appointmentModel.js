import db from "../config/db.js";

// ================= GET ALL APPOINTMENTS =================
export const getAppointments = async () => {
  const [rows] = await db.query("SELECT * FROM appointments ORDER BY id ASC");

  return rows.map((r) => ({
    id: r.id,
    Patient: r.Patient,
    Doctor: r.Doctor,
    CNIC: r.CNIC,
    Date: r.Date,
    Time: r.Time,
    Phone: r.Phone,
    Fee: r.Fee,
  }));
};

// ================= CREATE APPOINTMENT =================
export const createAppointment = async (data) => {
  const { Patient, Doctor, CNIC, Date, Time, Phone, Fee } = data;

  const [result] = await db.query(
    `INSERT INTO appointments 
     (Patient, Doctor, CNIC, Date, Time, Phone, Fee)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [Patient, Doctor, CNIC, Date, Time, Phone, Fee],
  );

  return {
    id: result.insertId,
    Patient,
    Doctor,
    CNIC,
    Date,
    Time,
    Phone,
    Fee,
  };
};

// ================= DELETE =================
export const deleteAppointment = async (id) => {
  await db.query("DELETE FROM appointments WHERE id=?", [id]);
};
