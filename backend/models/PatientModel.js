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
