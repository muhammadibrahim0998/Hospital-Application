import { LabResult } from "../models/LabResultModel.js";
import { Doctor } from "../models/DoctorModel.js";
import { Patient } from "../models/PatientModel.js";
import { Appointment } from "../models/appointmentModel.js";

export const addReport = async (req, res) => {
    try {
        const { patient_name, patient_id, test_name, cnic, description, normal_range, price, category, appointment_id } = req.body;
        const doctor_id = req.userId || req.body.doctor_id;
        const hospital_id = req.hospitalId;
        const doctor_name = req.body.doctor_name || "Physician";

        await LabResult.create({
            patient_name, 
            patient_id: patient_id || null, 
            doctor_id: doctor_id || null, 
            hospital_id: hospital_id || null, 
            doctor_name, 
            test_name,
            cnic, 
            description, 
            normal_range, 
            price, 
            category, 
            appointment_id: appointment_id || null
        });
        res.status(201).json({ message: "Lab test added successfully" });
    } catch (err) {
        console.error("Error creating lab report:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

export const performLabTest = async (req, res) => {
    try {
        const { id } = req.params;
        const { result } = req.body;
        await LabResult.findByIdAndUpdate(id, { result, status: 'done' });
        res.json({ message: "Test result updated" });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const giveMedicationToPatient = async (req, res) => {
    try {
        const { id } = req.params;
        const { medication } = req.body;
        await LabResult.findByIdAndUpdate(id, { medication_given: medication, status: 'done' });
        res.json({ message: "Medication updated" });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const fetchReports = async (req, res) => {
    try {
        const role = req.userRole ? req.userRole.toLowerCase() : '';
        const userId = req.userId;
        const hospitalId = req.hospitalId;

        let reports = [];

        if (role === 'super_admin') {
            reports = await LabResult.find().sort({ created_at: -1 });
        } else if (role === 'hospital_admin' || role === 'lab_technician' || role === 'admin') {
            const filter = hospitalId ? { hospital_id: hospitalId } : {};
            reports = await LabResult.find(filter).sort({ created_at: -1 });
        } else if (role === 'doctor') {
            const filter = hospitalId ? { $or: [{ hospital_id: hospitalId }, { doctor_id: userId }] } : { doctor_id: userId };
            reports = await LabResult.find(filter).sort({ created_at: -1 });
        } else if (role === 'patient') {
            const userCnic = req.userCnic;
            const userName = req.userName ? req.userName.trim() : "";
            const userPhone = req.userPhone;
            const conditions = [{ patient_id: userId }];
            
            if (userCnic) conditions.push({ cnic: userCnic });
            if (userPhone) conditions.push({ phone: userPhone });
            if (userName) conditions.push({ patient_name: new RegExp(`^\\s*${userName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\s*`, 'i') });
            
            // Also collect any appointment IDs that belong to this patient
            const apptFilter = { $or: [{ user_id: userId }] };
            if (userCnic) apptFilter.$or.push({ CNIC: userCnic });
            if (userName) apptFilter.$or.push({ Patient: new RegExp(`^\\s*${userName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\s*`, 'i') });
            if (userPhone) apptFilter.$or.push({ Phone: new RegExp(`^\\s*${userPhone}\\s*`, 'i') });
            
            const appts = await Appointment.find(apptFilter);
            const apptIds = appts.map(a => a._id);
            if (apptIds.length > 0) conditions.push({ appointment_id: { $in: apptIds } });
            
            const filter = { $or: conditions };
            reports = await LabResult.find(filter).sort({ created_at: -1 });
        }

        res.json(reports);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const fetchPublicReports = async (req, res) => {
    try {
        const { cnic } = req.params;
        if (!cnic) return res.status(400).json({ message: "CNIC is required" });
        const reports = await LabResult.find({ cnic: cnic, status: 'done' }).sort({ created_at: -1 });
        res.json(reports);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const fetchAppointmentReport = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const reports = await LabResult.find({ appointment_id: appointmentId }).sort({ created_at: -1 });
        res.json(reports);
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteReport = async (req, res) => {
    try {
        const { id } = req.params;
        await LabResult.findByIdAndDelete(id);
        res.json({ message: "Report deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};
