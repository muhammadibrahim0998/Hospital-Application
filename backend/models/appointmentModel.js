import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  Patient: { type: String, required: true },
  Doctor: { type: String, required: true },
  CNIC: { type: String, required: true },
  Date: { type: String, required: true },
  Time: { type: String, required: true },
  Phone: { type: String, required: true },
  Fee: { type: String, required: true },
  doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', default: null },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  hospital_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', default: null },
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' }
}, { 
  timestamps: { createdAt: 'created_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export const Appointment = mongoose.model("Appointment", AppointmentSchema);

export default Appointment;
