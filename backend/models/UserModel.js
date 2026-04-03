import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['super_admin', 'admin', 'hospital_admin', 'lab_technician', 'doctor', 'patient'], default: 'patient' },
  cnic: { type: String, default: null },
  hospital_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', default: null },
  gender: { type: String, default: 'Male' },
  age: { type: Number, default: 30 },
  phone: { type: String, default: '03000000000' }
}, { 
  timestamps: { createdAt: 'created_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export const User = mongoose.model("User", UserSchema);

export default User;
