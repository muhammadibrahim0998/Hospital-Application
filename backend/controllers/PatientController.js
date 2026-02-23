import { createPatient, getPatientByUserId } from "../models/PatientModel.js";
import { getAllDoctors } from "../models/DoctorModel.js";
import { createAppointment, getPatientAppointments } from "../models/AppointmentModel.js";

export const bookAppointment = async (req, res) => {
    const { doctor_id, appointment_date, doctor_name, doctor_phone, fee, patient_phone, cnic, time } = req.body;
    try {
        const patient = await getPatientByUserId(req.userId);
        if (!patient) return res.status(404).json({ message: "Patient profile not found" });

        // data for the model
        const apptData = {
            Doctor: doctor_name,
            DoctorPhone: doctor_phone,
            Fee: fee,
            Patient: patient.name,
            Phone: patient_phone,
            CNIC: cnic,
            Date: appointment_date,
            Time: time,
            patient_id: req.userId,
            doctor_id: doctor_id // This should be the USER_ID of the doctor
        };

        await createAppointment(apptData);
        res.status(201).json({ message: "Appointment booked successfully" });
    } catch (err) {
        console.error("Booking error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getDoctorsList = async (req, res) => {
    try {
        const doctors = await getAllDoctors();
        res.json(doctors);
    } catch (err) {
        res.status(500).json(err);
    }
};

export const getMyAppointments = async (req, res) => {
    try {
        const appointments = await getPatientAppointments(req.userId);
        res.json(appointments || []);
    } catch (err) {
        res.status(500).json(err);
    }
};
