import { createReport, getAllReports, getPatientReports, getDoctorReports, performTest, giveMedication } from "../models/LabResultModel.js";
import { getDoctorByUserId } from "../models/DoctorModel.js";
import { getPatientByUserId } from "../models/PatientModel.js";

// Add a new lab test
export const addReport = async (req, res) => {
    try {
        const { patient_name, test_name, cnic, description, normal_range, price, category } = req.body;

        // Use doctor name from token or request
        const doctor_name = req.body.doctor_name || "Admin/System";

        await createReport({
            patient_name,
            doctor_name,
            test_name,
            cnic,
            description,
            normal_range,
            price,
            category
        });
        res.status(201).json({ message: "Lab test added successfully" });
    } catch (err) {
        console.error("Error adding lab test:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Perform test (update result)
export const performLabTest = async (req, res) => {
    try {
        const { id } = req.params;
        const { result } = req.body;
        await performTest(id, result);
        res.json({ message: "Test result updated" });
    } catch (err) {
        console.error("Error performing test:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Give medication
export const giveMedicationToPatient = async (req, res) => {
    try {
        const { id } = req.params;
        const { medication } = req.body;
        await giveMedication(id, medication);
        res.json({ message: "Medication updated" });
    } catch (err) {
        console.error("Error giving medication:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Fetch reports based on user role
export const fetchReports = async (req, res) => {
    try {
        const role = req.userRole ? req.userRole.toLowerCase() : '';
        const userId = req.userId;
        const { cnic } = req.query;

        let reports = [];

        if (role === 'admin') {
            reports = await getAllReports();
        } else if (role === 'doctor') {
            // Doctors can see all for now or filter by their name
            reports = await getAllReports();
        } else if (role === 'patient') {
            const patient = await getPatientByUserId(userId);
            if (!patient) return res.status(404).json({ message: "Patient profile not found" });

            reports = await getPatientReports(patient.name, cnic);
        }

        res.json(reports);
    } catch (err) {
        console.error("Error fetching reports:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};
