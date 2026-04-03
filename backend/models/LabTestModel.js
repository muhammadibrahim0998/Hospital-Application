import mongoose from "mongoose";

const LabTestSchema = new mongoose.Schema({
  patient_name: { type: String, required: true },
  cnic: { type: String, required: true },
  test_name: { type: String, required: true },
  description: { type: String },
  normal_range: { type: String },
  price: { type: Number },
  category: { type: String },
  status: { type: String, enum: ['pending', 'done'], default: 'pending' },
  result: { type: String },
  medicationGiven: { type: String }
}, { 
  timestamps: { createdAt: 'created_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export const LabTest = mongoose.model("LabTest", LabTestSchema);

export default LabTest;
