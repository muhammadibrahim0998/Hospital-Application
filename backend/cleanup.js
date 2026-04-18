import mongoose from "./config/db.js";
import User from "./models/UserModel.js";
import Doctor from "./models/DoctorModel.js";
import Hospital from "./models/HospitalModel.js";
import LabResult from "./models/LabResultModel.js";
import LabTest from "./models/LabTestModel.js";
import Message from "./models/MessageModel.js";
import Patient from "./models/PatientModel.js";
import Appointment from "./models/appointmentModel.js";

const cleanup = async () => {
    try {
        console.log("Starting full cleanup (except super_admin)...");

        // 1. Delete all users except super_admin
        const userDelete = await User.deleteMany({ role: { $ne: "super_admin" } });
        console.log(`- Deleted ${userDelete.deletedCount} non-super-admin users.`);

        // 2. Delete all other records
        const doctorDelete = await Doctor.deleteMany({});
        console.log(`- Deleted ${doctorDelete.deletedCount} doctors.`);

        const hospitalDelete = await Hospital.deleteMany({});
        console.log(`- Deleted ${hospitalDelete.deletedCount} hospitals.`);

        const labResultDelete = await LabResult.deleteMany({});
        console.log(`- Deleted ${labResultDelete.deletedCount} lab results.`);

        const labTestDelete = await LabTest.deleteMany({});
        console.log(`- Deleted ${labTestDelete.deletedCount} lab tests.`);

        const messageDelete = await Message.deleteMany({});
        console.log(`- Deleted ${messageDelete.deletedCount} messages.`);

        const patientDelete = await Patient.deleteMany({});
        console.log(`- Deleted ${patientDelete.deletedCount} patients.`);

        const appointmentDelete = await Appointment.deleteMany({});
        console.log(`- Deleted ${appointmentDelete.deletedCount} appointments.`);

        console.log("✅ Cleanup completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Cleanup failed:", error);
        process.exit(1);
    }
};

// Start
cleanup();
