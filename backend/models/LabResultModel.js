import db from "../config/db.js";

// Create a new lab test/report
export const createReport = async (data) => {
    const {
        patient_name, doctor_name, test_name, cnic, description,
        normal_range, price, category, hospital_id, patient_id, doctor_id, appointment_id
    } = data;
    const sql = `
        INSERT INTO lab_results 
        (patient_name, doctor_name, test_name, cnic, description, normal_range, price, category, status, date, hospital_id, patient_id, doctor_id, appointment_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', CURDATE(), ?, ?, ?, ?)
    `;
    return await db.query(sql, [
        patient_name, doctor_name, test_name, cnic, description,
        normal_range, price, category, hospital_id, patient_id, doctor_id, appointment_id
    ]);
};

// Get all tests/reports (optionally filtered by hospital)
export const getAllReports = async (hospitalId = null) => {
    let sql = "SELECT * FROM lab_results";
    let params = [];
    if (hospitalId) {
        sql += " WHERE (hospital_id = ? OR hospital_id IS NULL)";
        params.push(hospitalId);
    }
    sql += " ORDER BY created_at DESC";
    const [rows] = await db.query(sql, params);
    return rows;
};

// Perform a test (update result and set status to 'done')
export const performTest = async (id, result) => {
    const sql = "UPDATE lab_results SET result = ?, status = 'done' WHERE id = ?";
    return await db.query(sql, [result, id]);
};

// Give medication for a test
export const giveMedication = async (id, medication) => {
    const sql = "UPDATE lab_results SET medication_given = ? WHERE id = ?";
    return await db.query(sql, [medication, id]);
};

// Get reports for a specific patient by ID or CNIC
export const getPatientReports = async (patientId, cnic = null) => {
    let sql = "SELECT * FROM lab_results WHERE patient_id = ?";
    let params = [patientId];
    
    if (cnic) {
        sql += " OR (cnic = ? AND cnic IS NOT NULL)";
        params.push(cnic);
    }
    
    sql += " ORDER BY created_at DESC";
    const [rows] = await db.query(sql, params);
    return rows;
};

// Get reports ordered by a specific doctor
export const getDoctorReports = async (doctorId) => {
    const sql = "SELECT * FROM lab_results WHERE doctor_id = ? ORDER BY created_at DESC";
    const [rows] = await db.query(sql, [doctorId]);
    return rows;
};
