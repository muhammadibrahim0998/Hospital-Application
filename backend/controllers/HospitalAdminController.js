import {
    getDoctorsByHospital,
    getPatientsByHospital,
    getAppointmentsByHospital,
    getAppUsersByHospital,
    getAllHospitals,
} from "../models/HospitalModel.js";
import { getAllDoctors } from "../models/DoctorModel.js";
import { getAllPatients } from "../models/PatientModel.js";
import { getAllAppointments } from "../models/AppointmentModel.js";
import { getAllAppUsers } from "../models/HospitalModel.js";

/**
 * getScopedDoctors
 * - hospital_admin → only their hospital's doctors
 * - super_admin → all (or filtered by ?hospitalId=)
 */
export const getScopedDoctors = async (req, res) => {
    try {
        const hospitalId = req.scopedHospitalId;
        const data = hospitalId
            ? await getDoctorsByHospital(hospitalId)
            : await getAllDoctors();
        res.json(data);
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
        const data = hospitalId
            ? await getPatientsByHospital(hospitalId)
            : await getAllPatients();
        res.json(data);
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
        const data = hospitalId
            ? await getAppointmentsByHospital(hospitalId)
            : await getAllAppointments();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

/**
 * getScopedAppUsers
 * - hospital_admin → only their hospital
 * - super_admin → all
 */
export const getScopedAppUsers = async (req, res) => {
    try {
        const hospitalId = req.scopedHospitalId;
        const data = hospitalId
            ? await getAppUsersByHospital(hospitalId)
            : await getAllAppUsers();
        
        console.log("DEBUG: getScopedAppUsers counts:", data.length);
        if (data.length > 0) {
            console.log("DEBUG: Sample App User:", JSON.stringify(data[0]));
        }
        
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
