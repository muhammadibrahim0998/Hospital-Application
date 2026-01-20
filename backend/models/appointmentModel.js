import db from "../config/db.js";

export const getAppointments = async () => {
  const [rows] = await db.query("SELECT * FROM appointments ORDER BY id DESC");
  return rows;
};

export const getAppointmentsByCNIC = async (cnic) => {
  const [rows] = await db.query(
    "SELECT * FROM appointments WHERE CNIC=? ORDER BY id DESC",
    [cnic],
  );
  return rows;
};

export const createAppointment = async (data) => {
  const { Patient, Doctor, CNIC, Date, Time, Phone, Fee } = data;

  const [result] = await db.query(
    `INSERT INTO appointments 
     (Patient, Doctor, CNIC, Date, Time, Phone, Fee)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [Patient, Doctor, CNIC, Date, Time, Phone, Fee],
  );

  return { id: result.insertId, ...data };
};

export const deleteAppointment = async (id) => {
  await db.query("DELETE FROM appointments WHERE id=?", [id]);
};
