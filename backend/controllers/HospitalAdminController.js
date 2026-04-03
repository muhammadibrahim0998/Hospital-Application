import { Hospital, HospitalAdmin } from "../models/HospitalModel.js";
import { Doctor } from "../models/DoctorModel.js";
import { Patient } from "../models/PatientModel.js";
import { Appointment } from "../models/appointmentModel.js";
import { User } from "../models/UserModel.js";

/**
 * getScopedDoctors
 */
export const getScopedDoctors = async (req, res) => {
    try {
        const hospitalId = req.scopedHospitalId;
        const filter = hospitalId ? { hospital_id: hospitalId } : {};
        const doctors = await Doctor.find(filter).populate('user_id', 'name email').sort({ created_at: -1 });
        
        const formatted = doctors.map(d => ({
            ...d.toObject(),
            name: d.user_id?.name,
            email: d.user_id?.email
        }));
        res.json(formatted);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

/**
 * getScopedPatients
 */
export const getScopedPatients = async (req, res) => {
    try {
        const hospitalId = req.scopedHospitalId;
        const filter = hospitalId ? { hospital_id: hospitalId } : {};
        const patients = await Patient.find(filter).populate('user_id', 'name email').sort({ created_at: -1 });
        
        const formatted = patients.map(p => ({
            ...p.toObject(),
            name: p.user_id?.name,
            email: p.user_id?.email
        }));
        res.json(formatted);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

/**
 * getScopedAppointments
 */
export const getScopedAppointments = async (req, res) => {
    try {
        const hospitalId = req.scopedHospitalId;
        const filter = hospitalId ? { hospital_id: hospitalId } : {};
        const data = await Appointment.find(filter).sort({ created_at: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

/**
 * getScopedAppUsers
 */
export const getScopedAppUsers = async (req, res) => {
    try {
        const hospitalId = req.scopedHospitalId;
        
        const userFilter = hospitalId ? { hospital_id: hospitalId } : {};
        const adminFilter = hospitalId ? { hospital_id: hospitalId } : {};

        const users = await User.find(userFilter).populate('hospital_id', 'name');
        const hospitalAdmins = await HospitalAdmin.find(adminFilter).populate('hospital_id', 'name');
        
        const formattedUsers = users.map(u => ({ ...u.toObject(), hospital_name: u.hospital_id?.name }));
        const formattedAdmins = hospitalAdmins.map(a => ({ ...a.toObject(), role: 'hospital_admin', hospital_name: a.hospital_id?.name }));
        
        const all = [...formattedUsers, ...formattedAdmins].sort((a, b) => b.created_at - a.created_at);
        res.json(all);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
