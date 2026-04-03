import mongoose from "mongoose";

const LabResultSchema = new mongoose.Schema({
    patient_name: { type: String, required: true },
    doctor_name: { type: String, required: true },
    test_name: { type: String, required: true },
    cnic: { type: String, required: true }, phone: { type: String },
    description: { type: String },
    normal_range: { type: String },
    price: { type: Number },
    category: { type: String },
    status: { type: String, enum: ['pending', 'done'], default: 'pending' },
    date: { type: Date, default: Date.now },
    hospital_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', default: null },
    patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', default: null },
    doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', default: null },
    appointment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', default: null },
    result: { type: String },
    medication_given: { type: String }
}, { 
    timestamps: { createdAt: 'created_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

export const LabResult = mongoose.model("LabResult", LabResultSchema);

export default LabResult;
