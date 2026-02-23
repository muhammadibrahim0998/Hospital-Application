import db from "../config/db.js";

// Create doctor profile
export const createDoctor = async (data) => {
    const sql = "INSERT INTO doctors (user_id, specialization, contact_info, image, department_id, field_id, phone) VALUES (?,?,?,?,?,?,?)";
    return await db.query(sql, data);
};

// Get all doctors with user details
export const getAllDoctors = async () => {
    const sql = `
        SELECT d.*, u.name, u.email 
        FROM doctors d 
        JOIN users u ON d.user_id = u.id
    `;
    const [rows] = await db.query(sql);
    return rows;
};

// Get doctor by ID
export const getDoctorById = async (id) => {
    const sql = `
        SELECT d.*, u.name, u.email 
        FROM doctors d 
        JOIN users u ON d.user_id = u.id 
        WHERE d.id = ?
    `;
    const [rows] = await db.query(sql, [id]);
    return rows[0];
};

// Get doctor by User ID
export const getDoctorByUserId = async (userId) => {
    const sql = `
        SELECT d.*, u.name, u.email 
        FROM doctors d 
        JOIN users u ON d.user_id = u.id 
        WHERE d.user_id = ?
    `;
    const [rows] = await db.query(sql, [userId]);
    return rows[0];
};
// Update doctor status
export const updateDoctorStatus = async (id, status) => {
    const sql = "UPDATE doctors SET status = ? WHERE id = ?";
    return await db.query(sql, [status, id]);
};

// Update doctor details
export const updateDoctor = async (id, data) => {
    const sql = `
        UPDATE doctors 
        SET specialization = ?, contact_info = ?, image = IFNULL(?, image), department_id = ?, field_id = ?, phone = ? 
        WHERE id = ?
    `;
    return await db.query(sql, [...data, id]);
};

// Delete doctor
export const deleteDoctor = async (doctorId) => {
    // First get the user_id to delete from users table as well
    const [doc] = await db.query("SELECT user_id FROM doctors WHERE id = ?", [doctorId]);
    if (doc.length > 0) {
        const userId = doc[0].user_id;
        await db.query("DELETE FROM doctors WHERE id = ?", [doctorId]);
        await db.query("DELETE FROM users WHERE id = ?", [userId]);
    }
    return true;
};
