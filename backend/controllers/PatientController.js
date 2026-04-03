import { Patient } from "../models/PatientModel.js";
import { Doctor } from "../models/DoctorModel.js";
import { Appointment } from "../models/appointmentModel.js";

export const bookAppointment = async (req, res) => {
    const { doctor_id, appointment_date, doctor_name, doctor_phone, fee, patient_phone, cnic, time } = req.body;
    try {
        const patient = await Patient.findOne({ user_id: req.userId }).populate('user_id', 'name email');
        if (!patient) return res.status(404).json({ message: "Patient profile not found" });

        const doctor = await Doctor.findOne({ user_id: doctor_id });
        const hospital_id = doctor ? doctor.hospital_id : null;

        const apptData = {
            Patient: patient.user_id?.name || 'Unknown',
            Doctor: doctor_name || 'Doctor',
            CNIC: cnic || '0000',
            Date: appointment_date,
            Time: time || '12:00 PM',
            Phone: patient_phone || '000',
            Fee: fee || '0',
            doctor_id: doctor_id,
            user_id: req.userId,
            hospital_id: hospital_id
        };

        await Appointment.create(apptData);
        res.status(201).json({ message: "Appointment booked successfully" });
    } catch (err) {
        console.error("Booking error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getDoctorsList = async (req, res) => {
    try {
        const doctors = await Doctor.find().populate('user_id', 'name email');
        const formatted = doctors.map(d => ({
            ...d.toObject(),
            name: d.user_id?.name,
            email: d.user_id?.email
        }));
        res.json(formatted);
    } catch (err) {
        console.error("[PatientController] Error loading doctors:", err);
        res.status(500).json(err);
    }
};

export const getMyAppointments = async (req, res) => {
    try {
        const userId = req.userId;
        const userCnic = req.userCnic;
        const userPhone = req.userPhone;
        const userName = req.userName;
        let filter = { $or: [{ user_id: userId }] };
        if (userCnic || userPhone || userName) {
            const cleanCnic = userCnic ? userCnic.replace(/\D/g, "") : "";
            const cleanPhone = userPhone ? userPhone.replace(/\D/g, "") : "";
            if (userCnic) {
                filter.$or.push({ CNIC: userCnic });
                filter.$or.push({ CNIC: cleanCnic });
                filter.$or.push({ CNIC: new RegExp(cleanCnic.split("").join("[- ]?"), "i") });
            }
            if (userPhone) {
                filter.$or.push({ Phone: userPhone });
                filter.$or.push({ Phone: cleanPhone });
                filter.$or.push({ Phone: new RegExp(cleanPhone.split("").join("[- ]?"), "i") });
            }
            if (userName) {
                filter.$or.push({ Patient: new RegExp(`^${userName}$`, "i") });
                const firstName = userName.split(" ")[0];
                if (firstName.length > 2) {
                    filter.$or.push({ Patient: new RegExp(`^${firstName}`, "i") });
                }
            }
        }
        console.log("[getMyAppointments] userId:", userId, "| userName:", userName, "| userPhone:", userPhone, "| userCnic:", userCnic);
        console.log("[getMyAppointments] filter:", JSON.stringify(filter));
        const appointments = await Appointment.find(filter).sort({ created_at: -1 });
        console.log("[getMyAppointments] found:", appointments.length, "appointments");
        res.json(appointments || []);
    } catch (err) {
        console.error("[getMyAppointments] ERROR:", err);
        res.status(500).json(err);
    }
};
