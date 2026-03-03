import bcrypt from "bcryptjs";
import db from "../config/db.js";
import {
    createHospital,
    getAllHospitals,
    getHospitalById,
    updateHospital,
    deleteHospital,
    createHospitalAdmin,
    getAllHospitalAdmins,
    getHospitalAdminById,
    updateHospitalAdmin,
    updateHospitalAdminModules,
    deleteHospitalAdmin,
    getAllAppUsers,
    getHospitalStats,
} from "../models/HospitalModel.js";
import { deleteDoctor } from "../models/DoctorModel.js";

// ═══════════════════════════════════════════════════════
//  HOSPITAL MANAGEMENT
// ═══════════════════════════════════════════════════════

export const addHospital = async (req, res) => {
    try {
        const { name, address, phone, email } = req.body;
        if (!name) return res.status(400).json({ message: "Hospital name is required" });

        const result = await createHospital([name, address || "", phone || "", email || ""]);
        res.status(201).json({ message: "Hospital created successfully", id: result.insertId });
    } catch (err) {
        console.error("addHospital error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const listHospitals = async (req, res) => {
    try {
        const hospitals = await getAllHospitals();
        res.json(hospitals);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const editHospital = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, phone, email, is_active } = req.body;
        await updateHospital(id, [name, address || "", phone || "", email || "", is_active ?? 1]);
        res.json({ message: "Hospital updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const removeHospital = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteHospital(id);
        res.json({ message: "Hospital deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ═══════════════════════════════════════════════════════
//  PROJECT (HOSPITAL) STATS
// ═══════════════════════════════════════════════════════

export const fetchProjectStats = async (req, res) => {
    try {
        const stats = await getHospitalStats();
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: "Error fetching project stats", error: err.message });
    }
};

// ═══════════════════════════════════════════════════════
//  HOSPITAL ADMIN MANAGEMENT
// ═══════════════════════════════════════════════════════

export const addHospitalAdmin = async (req, res) => {
    try {
        const { hospital_id, name, email, password, modules, gender, age, phone } = req.body;
        if (!hospital_id || !name || !email || !password) {
            return res.status(400).json({ message: "hospital_id, name, email, password are required" });
        }

        const hospital = await getHospitalById(hospital_id);
        if (!hospital) return res.status(404).json({ message: "Hospital not found" });

        const hash = await bcrypt.hash(password, 10);

        const defaultModules = {
            doctors: true,
            patients: true,
            appointments: true,
            lab: true,
            appUsers: true,
        };

        const modulesJson = JSON.stringify(modules || defaultModules);
        const result = await createHospitalAdmin([
            hospital_id,
            name,
            email,
            hash,
            modulesJson,
            gender || 'Male',
            age || 30,
            phone || '03000000000'
        ]);
        res.status(201).json({ message: "Hospital Admin created successfully", id: result.insertId });
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ message: "This email is already registered as a Hospital Admin" });
        }
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const listHospitalAdmins = async (req, res) => {
    try {
        const admins = await getAllHospitalAdmins();
        const safe = admins.map(({ password, ...rest }) => rest);
        res.json(safe);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const editHospitalAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, is_active, modules, gender, age, phone } = req.body;
        const modulesJson = JSON.stringify(modules || {});
        await updateHospitalAdmin(id, [
            name,
            email,
            is_active ?? 1,
            modulesJson,
            gender || 'Male',
            age || 30,
            phone || '03000000000'
        ]);
        res.json({ message: "Hospital Admin updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const setHospitalAdminModules = async (req, res) => {
    try {
        const { id } = req.params;
        const { modules } = req.body;
        if (!modules) return res.status(400).json({ message: "modules object is required" });
        await updateHospitalAdminModules(id, modules);
        res.json({ message: "Modules updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const removeHospitalAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("DELETE FROM hospital_admins WHERE id = ?", [id]);
        res.json({ message: "Hospital Admin deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ═══════════════════════════════════════════════════════
//  APP USERS (Super Admin sees ALL)
// ═══════════════════════════════════════════════════════

export const fetchAllAppUsers = async (req, res) => {
    try {
        const users = await getAllAppUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Error fetching app users", error: err.message });
    }
};

export const updateAppUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, hospital_id, gender, age, phone } = req.body;

        console.log(`Updating user ${id} with role ${role}`);

        const [userCheck] = await db.query("SELECT id, role FROM users WHERE id = ?", [id]);
        const [adminCheck] = await db.query("SELECT id FROM hospital_admins WHERE id = ?", [id]);

        const targetHospitalId = hospital_id && hospital_id !== "" ? hospital_id : null;

        if (role === "hospital_admin") {
            if (adminCheck.length > 0) {
                const sql = `UPDATE hospital_admins SET name=?, email=?, hospital_id=?, gender=?, age=?, phone=? WHERE id=?`;
                await db.query(sql, [name, email, targetHospitalId, gender || 'Male', age || 30, phone || '', id]);
            } else if (userCheck.length > 0) {
                console.log("Moving user to hospital_admins table");
                const [oldUser] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
                await db.query("DELETE FROM users WHERE id = ?", [id]);
                const modules = JSON.stringify({ doctors: true, patients: true, appointments: true, lab: true, appUsers: true });
                await db.query(
                    "INSERT INTO hospital_admins (id, hospital_id, name, email, password, role, is_active, modules, gender, age, phone) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                    [id, targetHospitalId || 1, name, email, oldUser[0]?.password || '', 'hospital_admin', 1, modules, gender || 'Male', age || 30, phone || '']
                );
            }
        } else {
            if (userCheck.length > 0) {
                const prevRole = userCheck[0].role;
                const sql = `UPDATE users SET name=?, email=?, role=?, hospital_id=?, gender=?, age=?, phone=? WHERE id=?`;
                await db.query(sql, [name, email, role, targetHospitalId, gender || 'Male', age || 30, phone || '', id]);

                // Handle Doctor specialization if role changed to doctor
                if (role === 'doctor' && prevRole !== 'doctor') {
                    const [docExists] = await db.query("SELECT id FROM doctors WHERE user_id = ?", [id]);
                    if (docExists.length === 0) {
                        await db.query("INSERT INTO doctors (user_id, name, specialization, phone, hospital_id) VALUES (?, ?, ?, ?, ?)", [id, name, 'General Physician', phone || '', targetHospitalId]);
                    }
                } else if (role !== 'doctor' && prevRole === 'doctor') {
                    // If no longer a doctor, optionally remove from doctors table
                    await db.query("DELETE FROM doctors WHERE user_id = ?", [id]);
                }
            } else if (adminCheck.length > 0) {
                console.log("Moving admin to users table");
                const [oldAdmin] = await db.query("SELECT * FROM hospital_admins WHERE id = ?", [id]);
                await db.query("DELETE FROM hospital_admins WHERE id = ?", [id]);
                await db.query(
                    "INSERT INTO users (id, name, email, password, role, hospital_id, gender, age, phone) VALUES (?,?,?,?,?,?,?,?,?)",
                    [id, name, email, oldAdmin[0]?.password || '', role, targetHospitalId, gender || 'Male', age || 30, phone || '']
                );

                if (role === 'doctor') {
                    await db.query("INSERT INTO doctors (user_id, name, specialization, phone, hospital_id) VALUES (?, ?, ?, ?, ?)", [id, name, 'General Physician', phone || '', targetHospitalId]);
                }
            }
        }

        res.json({ message: "User updated successfully" });
    } catch (err) {
        console.error("updateAppUser error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const deleteAppUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.query;

        console.log(`Deleting user ${id} with expected role ${role}`);

        // 1. Cascade cleanup: Appointments
        // Delete where user is patient
        await db.query("DELETE FROM appointments WHERE patient_id = ?", [id]);
        // Delete where user is doctor (via doctors table lookup)
        await db.query("DELETE FROM appointments WHERE doctor_id IN (SELECT id FROM doctors WHERE user_id = ?)", [id]);

        // 2. Cascade cleanup: Lab Results
        await db.query("DELETE FROM lab_results WHERE patient_id = ?", [id]);
        await db.query("DELETE FROM lab_results WHERE doctor_id = ?", [id]); // If they ordered it

        // 3. Delete Main Records
        if (role === 'hospital_admin' || role === 'Hospital Admin') {
            await db.query("DELETE FROM hospital_admins WHERE id = ?", [id]);
        } else if (role === 'doctor') {
            const [docEntry] = await db.query("SELECT id FROM doctors WHERE user_id = ?", [id]);
            if (docEntry.length > 0) {
                await deleteDoctor(docEntry[0].id);
            } else {
                await db.query("DELETE FROM users WHERE id = ?", [id]);
            }
        } else {
            await db.query("DELETE FROM patients WHERE user_id = ?", [id]);
            await db.query("DELETE FROM users WHERE id = ?", [id]);
        }
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error("deleteAppUser error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

