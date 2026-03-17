import db from "../config/db.js";

// Create patient profile
export const createPatient = async (data) => {
    const sql = "INSERT INTO patients (user_id, contact_info, medical_history) VALUES (?,?,?)";
    return await db.query(sql, data);
};

// Get all patients with user details
export const getAllPatients = async () => {
    const sql = `
        SELECT p.*, u.name, u.email 
        FROM patients p 
        JOIN users u ON p.user_id = u.id
    `;
    const [rows] = await db.query(sql);
    return rows;
};

// Get patient by User ID
export const getPatientByUserId = async (userId) => {
    const sql = `
        SELECT p.*, u.name, u.email 
        FROM patients p 
        JOIN users u ON p.user_id = u.id 
        WHERE p.user_id = ?
    `;
    const [rows] = await db.query(sql, [userId]);
    return rows[0];
};

// Get patient by CNIC
export const getPatientByCnic = async (cnic) => {
    const sql = `
        SELECT u.id as user_id, u.name, u.email, p.id as patient_profile_id 
        FROM users u 
        LEFT JOIN patients p ON u.id = p.user_id 
        WHERE u.cnic = ? AND u.role = 'patient'
    `;
    const [rows] = await db.query(sql, [cnic]);
    return rows[0];
};
