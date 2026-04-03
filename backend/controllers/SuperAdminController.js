import { User } from "../models/UserModel.js";
import { Hospital, HospitalAdmin } from "../models/HospitalModel.js";
import { Doctor } from "../models/DoctorModel.js";
import { Patient } from "../models/PatientModel.js";
import { Appointment } from "../models/appointmentModel.js";
import { LabResult } from "../models/LabResultModel.js";
import bcrypt from "bcryptjs";

// ═══════════════════════════════════════════════════════
//  HOSPITAL MANAGEMENT
// ═══════════════════════════════════════════════════════

export const addHospital = async (req, res) => {
    try {
        const { name, address, phone, email } = req.body;
        if (!name) return res.status(400).json({ message: "Hospital name is required" });

        const result = await Hospital.create({ name, address: address || "", phone: phone || "", email: email || "" });
        res.status(201).json({ message: "Hospital created successfully", id: result._id });
    } catch (err) {
        console.error("addHospital error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const listHospitals = async (req, res) => {
    try {
        const hospitals = await Hospital.find().sort({ created_at: -1 });
        res.json(hospitals);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const editHospital = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, phone, email, is_active } = req.body;
        await Hospital.findByIdAndUpdate(id, { name, address: address || "", phone: phone || "", email: email || "", is_active: is_active ?? true });
        res.json({ message: "Hospital updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const removeHospital = async (req, res) => {
    try {
        const { id } = req.params;
        await Hospital.findByIdAndDelete(id);
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
        const hospitals = await Hospital.find();
        const stats = await Promise.all(hospitals.map(async (h) => {
            const doctor_count = await Doctor.countDocuments({ hospital_id: h._id });
            const patient_count = await Patient.countDocuments({ hospital_id: h._id });
            const app_user_count = await User.countDocuments({ hospital_id: h._id, role: { $nin: ['super_admin', 'hospital_admin'] } });
            return { id: h._id, name: h.name, doctor_count, patient_count, app_user_count };
        }));
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

        const hospital = await Hospital.findById(hospital_id);
        if (!hospital) return res.status(404).json({ message: "Hospital not found" });

        const hash = await bcrypt.hash(password, 10);

        const defaultModules = {
            doctors: true,
            patients: true,
            appointments: true,
            lab: true,
            appUsers: true,
        };

        const result = await HospitalAdmin.create({
            hospital_id,
            name,
            email,
            password: hash,
            modules: modules || defaultModules,
            gender: gender || 'Male',
            age: age || 30,
            phone: phone || '03000000000'
        });
        res.status(201).json({ message: "Hospital Admin created successfully", id: result._id });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const listHospitalAdmins = async (req, res) => {
    try {
        const admins = await HospitalAdmin.find().populate('hospital_id', 'name').sort({ created_at: -1 });
        const safe = admins.map(a => {
            const obj = a.toObject();
            delete obj.password;
            return obj;
        });
        res.json(safe);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const editHospitalAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, is_active, modules, gender, age, phone } = req.body;
        
        await HospitalAdmin.findByIdAndUpdate(id, { 
            name, 
            email, 
            is_active: is_active ?? true, 
            modules: modules || {}, 
            gender: gender || 'Male', 
            age: age || 30, 
            phone: phone || '03000000000' 
        });
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
        await HospitalAdmin.findByIdAndUpdate(id, { modules });
        res.json({ message: "Modules updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const removeHospitalAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        await HospitalAdmin.findByIdAndDelete(id);
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
        const users = await User.find().populate('hospital_id', 'name');
        const hospitalAdmins = await HospitalAdmin.find().populate('hospital_id', 'name');
        
        const formattedUsers = users.map(u => {
            const obj = u.toObject();
            obj.hospital_name = u.hospital_id?.name;
            return obj;
        });
        const formattedAdmins = hospitalAdmins.map(a => {
            const obj = a.toObject();
            obj.role = 'hospital_admin';
            obj.hospital_name = a.hospital_id?.name;
            return obj;
        });
        
        const all = [...formattedUsers, ...formattedAdmins].sort((a, b) => b.created_at - a.created_at);
        res.json(all);
    } catch (err) {
        res.status(500).json({ message: "Error fetching app users", error: err.message });
    }
};

export const updateAppUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, hospital_id, gender, age, phone } = req.body;

        const user = await User.findById(id);
        const admin = await HospitalAdmin.findById(id);

        const targetHospitalId = hospital_id && hospital_id !== "" ? hospital_id : null;

        if (role === "hospital_admin") {
            if (admin) {
                await HospitalAdmin.findByIdAndUpdate(id, { name, email, hospital_id: targetHospitalId, gender, age, phone });
            } else if (user) {
                const userData = user.toObject();
                await User.findByIdAndDelete(id);
                await HospitalAdmin.create({
                    _id: id,
                    hospital_id: targetHospitalId || user.hospital_id,
                    name,
                    email,
                    password: userData.password,
                    gender: gender || 'Male',
                    age: age || 30,
                    phone: phone || ''
                });
            }
        } else {
            if (user) {
                const prevRole = user.role;
                await User.findByIdAndUpdate(id, { name, email, role, hospital_id: targetHospitalId, gender, age, phone });

                if (role === 'doctor' && prevRole !== 'doctor') {
                    const docExists = await Doctor.findOne({ user_id: id });
                    if (!docExists) {
                        await Doctor.create({ user_id: id, specialization: 'General Physician', phone: phone || '', hospital_id: targetHospitalId });
                    }
                } else if (role !== 'doctor' && prevRole === 'doctor') {
                    await Doctor.findOneAndDelete({ user_id: id });
                }
            } else if (admin) {
                const adminData = admin.toObject();
                await HospitalAdmin.findByIdAndDelete(id);
                await User.create({
                    _id: id,
                    name,
                    email,
                    password: adminData.password,
                    role,
                    hospital_id: targetHospitalId,
                    gender: gender || 'Male',
                    age: age || 30,
                    phone: phone || ''
                });

                if (role === 'doctor') {
                    await Doctor.create({ user_id: id, specialization: 'General Physician', phone: phone || '', hospital_id: targetHospitalId });
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

        // 1. Cascade cleanup: Appointments
        await Appointment.deleteMany({ $or: [{ user_id: id }, { doctor_id: id }] });

        // 2. Cascade cleanup: Lab Results
        await LabResult.deleteMany({ $or: [{ patient_id: id }, { doctor_id: id }] });

        // 3. Delete Main Records
        if (role === 'hospital_admin' || role === 'Hospital Admin') {
            await HospitalAdmin.findByIdAndDelete(id);
        } else if (role === 'doctor') {
            const docEntry = await Doctor.findOne({ user_id: id });
            if (docEntry) {
                await User.findByIdAndDelete(id);
                await Doctor.findByIdAndDelete(docEntry._id);
            } else {
                await User.findByIdAndDelete(id);
            }
        } else {
            await Patient.findOneAndDelete({ user_id: id });
            await User.findByIdAndDelete(id);
        }
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error("deleteAppUser error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

