import db from "../config/db.js";

// Get all appointments
export const getAppointments = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM appointments ORDER BY id ASC", (err, results) => {
      if (err) return reject(err);
      // map to frontend fields
      const formatted = results.map((r) => ({
        id: r.id,
        Patient: r.Patient,
        Doctor: r.Doctor,
        Date: r.Date,
        Time: r.Time,
        Phone: r.Phone,
        Fee: r.Fee,
      }));
      resolve(formatted);
    });
  });
};

// Create appointment
export const createAppointment = (data) => {
  const { Patient, Doctor, Date, Time, Phone, Fee } = data;

  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO appointments (Patient, Doctor, Date, Time, Phone, Fee) VALUES (?, ?, ?, ?, ?, ?)",
      [Patient, Doctor, Date, Time, Phone, Fee],
      (err, result) => {
        if (err) return reject(err);
        resolve({
          "#": result.insertId,
          Patient,
          Doctor,
          Date,
          Time,
          Phone,
          Fee,
        });
      }
    );
  });
};

// Delete appointment
export const deleteAppointment = (id) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM appointments WHERE id=?", [id], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};
