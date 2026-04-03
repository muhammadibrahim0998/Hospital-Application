import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hospital_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', default: null },
  contact_info: { type: String, default: "" },
  medical_history: { type: String, default: "" }
}, { 
  timestamps: { createdAt: 'created_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export const Patient = mongoose.model("Patient", PatientSchema);

export default Patient;
