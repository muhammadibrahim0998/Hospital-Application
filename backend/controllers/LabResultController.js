import { createReport, getAllReports, getPatientReports, getDoctorReports, performTest, giveMedication } from "../models/LabResultModel.js";
import { getDoctorByUserId } from "../models/DoctorModel.js";
import { getPatientByUserId, getPatientByCnic } from "../models/PatientModel.js";

// Add a new lab test
export const addReport = async (req, res) => {
    try {
        const { patient_name, patient_id, test_name, cnic, description, normal_range, price, category, appointment_id } = req.body;

        // Use doctor name / ID from token
        const doctor_id = req.userId;
        const hospital_id = req.hospitalId;

        // We could fetch the doctor's name from DB if wanted, or just trust req.body.doctor_name
        const doctor_name = req.body.doctor_name || "Physician";

        await createReport({
            patient_name,
            patient_id, // If provided by frontend
            doctor_id,
            hospital_id,
            doctor_name,
            test_name,
            cnic,
            description,
            normal_range,
            price,
            category,
            appointment_id
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

// Fetch reports based on user role and hospital scope
export const fetchReports = async (req, res) => {
    try {
        const role = req.userRole ? req.userRole.toLowerCase() : '';
        const userId = req.userId;
        const hospitalId = req.hospitalId;

        let reports = [];

        if (role === 'super_admin') {
            reports = await getAllReports();
        } else if (role === 'hospital_admin') {
            reports = await getAllReports(hospitalId);
        } else if (role === 'lab_technician') {
            // Lab technician sees all tests for their hospital
            reports = await getAllReports(hospitalId);
        } else if (role === 'doctor') {
            // Doctors see all tests for their hospital OR tests they ordered personally
            const hospitalReports = await getAllReports(hospitalId);
            const orderedByMe = await getDoctorReports(userId);
            
            // Merge and remove duplicates
            const allMerged = [...hospitalReports, ...orderedByMe];
            const uniqueReports = Array.from(new Map(allMerged.map(item => [item.id, item])).values());
            reports = uniqueReports.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (role === 'patient') {
            const userCnic = req.userCnic;
            reports = await getPatientReports(userId, userCnic);
        } else if (role === 'admin') {
            reports = await getAllReports(hospitalId);
        }

        res.json(reports);
    } catch (err) {
        console.error("Error fetching reports:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};
