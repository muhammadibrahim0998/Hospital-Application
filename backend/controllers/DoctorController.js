import { getDoctorByUserId, getDoctorById } from "../models/DoctorModel.js";
import { getDoctorAppointments, updateAppointmentStatus } from "../models/AppointmentModel.js";

export const getMyAppointments = async (req, res) => {
    try {
        const appointments = await getDoctorAppointments(req.userId);
        res.json(appointments);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const getProfile = async (req, res) => {
    try {
        const doctor = await getDoctorByUserId(req.userId);
        if (!doctor) return res.status(404).json({ message: "Profile not found" });
        res.json(doctor);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const updateStatus = async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    try {
        await updateAppointmentStatus(id, status);
        res.json({ message: "Appointment updated" });
    } catch (err) {
        res.status(500).json(err);
    }
}

export const updateProfile = async (req, res) => {
    try {
        const doctor = await getDoctorByUserId(req.userId);
        if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });

        const { specialization, contact_info, departmentId, fieldId, phone } = req.body;
        const image = req.file ? `/uploads/doctors/${req.file.filename}` : undefined;

        const updateData = {
            specialization,
            contact_info,
            department_id: departmentId,
            field_id: fieldId,
            phone,
            ...(image && { image })
        };

        // Filter out undefined values
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        const { updateDoctor } = await import("../models/DoctorModel.js");
        await updateDoctor(doctor.id, updateData);

        res.json({ message: "Profile updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
};
