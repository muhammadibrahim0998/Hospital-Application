import db from "../config/db.js";

// ─── Hospital CRUD ──────────────────────────────────────────────────────────

export const createHospital = async (data) => {
    const sql = `INSERT INTO hospitals (name, address, phone, email) VALUES (?,?,?,?)`;
    const [result] = await db.query(sql, data);
    return result;
};

export const getAllHospitals = async () => {
    const [rows] = await db.query(`SELECT * FROM hospitals ORDER BY created_at DESC`);
    return rows;
};

export const getHospitalById = async (id) => {
    const [rows] = await db.query(`SELECT * FROM hospitals WHERE id = ?`, [id]);
    return rows[0];
};

export const updateHospital = async (id, data) => {
    const sql = `UPDATE hospitals SET name=?, address=?, phone=?, email=?, is_active=? WHERE id=?`;
    return await db.query(sql, [...data, id]);
};

export const deleteHospital = async (id) => {
    return await db.query(`DELETE FROM hospitals WHERE id = ?`, [id]);
};

// ─── Hospital Admin CRUD ────────────────────────────────────────────────────

export const createHospitalAdmin = async (data) => {
    const sql = `INSERT INTO hospital_admins (hospital_id, name, email, password, modules, gender, age, phone) VALUES (?,?,?,?,?,?,?,?)`;
    const [result] = await db.query(sql, data);
    return result;
};

export const getAllHospitalAdmins = async () => {
    const sql = `
    SELECT ha.*, h.name AS hospital_name 
    FROM hospital_admins ha
    JOIN hospitals h ON ha.hospital_id = h.id
    ORDER BY ha.created_at DESC
  `;
    const [rows] = await db.query(sql);
    return rows;
};

export const getHospitalAdminById = async (id) => {
    const sql = `
    SELECT ha.*, h.name AS hospital_name 
    FROM hospital_admins ha
    JOIN hospitals h ON ha.hospital_id = h.id
    WHERE ha.id = ?
  `;
    const [rows] = await db.query(sql, [id]);
    return rows[0];
};

export const findHospitalAdminByEmail = async (email) => {
    const sql = `SELECT ha.*, h.name AS hospital_name FROM hospital_admins ha JOIN hospitals h ON ha.hospital_id = h.id WHERE ha.email = ?`;
    const [rows] = await db.query(sql, [email]);
    return rows;
};

export const updateHospitalAdminModules = async (id, modules) => {
    return await db.query(`UPDATE hospital_admins SET modules = ? WHERE id = ?`, [JSON.stringify(modules), id]);
};

export const updateHospitalAdmin = async (id, data) => {
    const sql = `UPDATE hospital_admins SET name=?, email=?, is_active=?, modules=?, gender=?, age=?, phone=? WHERE id=?`;
    return await db.query(sql, [...data, id]);
};

export const deleteHospitalAdmin = async (id) => {
    return await db.query(`DELETE FROM hospital_admins WHERE id = ?`, [id]);
};

// ─── Scoped Data Queries ────────────────────────────────────────────────────

export const getAllAppUsers = async () => {
    const sql = `
    (SELECT u.id, u.name, u.email, u.role, u.created_at, u.hospital_id, u.gender, u.age, u.phone, h.name AS hospital_name
     FROM users u
     LEFT JOIN hospitals h ON u.hospital_id = h.id)
    UNION ALL
    (SELECT ha.id, ha.name, ha.email, 'hospital_admin' as role, ha.created_at, ha.hospital_id, ha.gender, ha.age, ha.phone, h.name AS hospital_name
     FROM hospital_admins ha
     JOIN hospitals h ON ha.hospital_id = h.id)
    ORDER BY created_at DESC
  `;
    const [rows] = await db.query(sql);
    return rows;
};


export const getAppUsersByHospital = async (hospitalId) => {
    const sql = `
    SELECT u.id, u.name, u.email, u.role, u.created_at, u.hospital_id,
           h.name AS hospital_name
    FROM users u
    LEFT JOIN hospitals h ON u.hospital_id = h.id
    WHERE u.hospital_id = ?
    ORDER BY u.created_at DESC
  `;
    const [rows] = await db.query(sql, [hospitalId]);
    return rows;
};

export const getDoctorsByHospital = async (hospitalId) => {
    const sql = `
    SELECT d.*, u.name, u.email 
    FROM doctors d 
    JOIN users u ON d.user_id = u.id
    WHERE d.hospital_id = ?
  `;
    const [rows] = await db.query(sql, [hospitalId]);
    return rows;
};

export const getPatientsByHospital = async (hospitalId) => {
    const sql = `
    SELECT p.*, u.name, u.email 
    FROM patients p 
    JOIN users u ON p.user_id = u.id
    WHERE u.hospital_id = ?
  `;
    const [rows] = await db.query(sql, [hospitalId]);
    return rows;
};

export const getAppointmentsByHospital = async (hospitalId) => {
    const sql = `SELECT * FROM appointments WHERE hospital_id = ? ORDER BY id DESC`;
    // Fallback if hospital_id not in appointments yet
    try {
        const [rows] = await db.query(sql, [hospitalId]);
        return rows;
    } catch {
        const [rows] = await db.query(`SELECT * FROM appointments ORDER BY id DESC`);
        return rows;
    }
};

export const getHospitalStats = async () => {
    const sql = `
    SELECT h.id, h.name, 
           (SELECT COUNT(*) FROM doctors d WHERE d.hospital_id = h.id) as doctor_count,
           (SELECT COUNT(*) FROM patients p WHERE p.hospital_id = h.id) as patient_count,
           (SELECT COUNT(*) FROM users u WHERE u.hospital_id = h.id AND u.role NOT IN ('super_admin', 'hospital_admin')) as app_user_count
    FROM hospitals h
  `;
    const [rows] = await db.query(sql);
    return rows;
};

