import { Doctor } from "../models/DoctorModel.js";
import { Appointment } from "../models/appointmentModel.js";

export const getMyAppointments = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ user_id: req.userId });
        if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });

        const appointments = await Appointment.find({ doctor_id: doctor._id }).sort({ created_at: 1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const getProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ user_id: req.userId }).populate('user_id', 'name email');
        if (!doctor) return res.status(404).json({ message: "Profile not found" });
        const data = {
            ...doctor.toObject(),
            name: doctor.user_id?.name,
            email: doctor.user_id?.email
        };
        res.json(data);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const updateStatus = async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    try {
        await Appointment.findByIdAndUpdate(id, { status });
        res.json({ message: "Appointment updated" });
    } catch (err) {
        res.status(500).json(err);
    }
}

export const updateProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ user_id: req.userId });
        if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });

        const { specialization, contact_info, departmentId, fieldId, phone, fee, whatsappNumber } = req.body;
        const image = req.file ? `/uploads/doctors/${req.file.filename}` : undefined;

        const updateData = {
            specialization,
            contact_info,
            department_id: departmentId,
            field_id: fieldId,
            phone,
            fee,
            whatsapp_number: whatsappNumber,
        };
        if (image) updateData.image = image;

        // Filter out undefined values
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        await Doctor.findByIdAndUpdate(doctor._id, updateData);

        res.json({ message: "Profile updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
};
