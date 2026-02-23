import db from "../config/db.js";

// Create a new lab test/report
export const createReport = async (data) => {
    const { patient_name, doctor_name, test_name, cnic, description, normal_range, price, category } = data;
    const sql = `
        INSERT INTO lab_results 
        (patient_name, doctor_name, test_name, cnic, description, normal_range, price, category, status, date) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', CURDATE())
    `;
    return await db.query(sql, [patient_name, doctor_name, test_name, cnic, description, normal_range, price, category]);
};

// Get all tests/reports
export const getAllReports = async () => {
    const sql = "SELECT * FROM lab_results ORDER BY created_at DESC";
    const [rows] = await db.query(sql);
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

// Get reports for a specific patient by name or CNIC
export const getPatientReports = async (patientName, cnic = "") => {
    let sql = "SELECT * FROM lab_results WHERE patient_name = ?";
    let params = [patientName];
    if (cnic) {
        sql += " OR cnic = ?";
        params.push(cnic);
    }
    sql += " ORDER BY created_at DESC";
    const [rows] = await db.query(sql, params);
    return rows;
};

// Get reports uploaded by a specific doctor by name
export const getDoctorReports = async (doctorName) => {
    const sql = "SELECT * FROM lab_results WHERE doctor_name = ? ORDER BY date DESC";
    const [rows] = await db.query(sql, [doctorName]);
    return rows;
};
