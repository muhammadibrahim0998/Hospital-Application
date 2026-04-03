import mongoose from "mongoose";

// --- Hospital Schema ---
const HospitalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    logo: { type: String },
    is_active: { type: Boolean, default: true },
}, { 
    timestamps: { createdAt: 'created_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

export const Hospital = mongoose.model("Hospital", HospitalSchema);

// --- Hospital Admin Schema ---
const HospitalAdminSchema = new mongoose.Schema({
    hospital_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    modules: { type: mongoose.Schema.Types.Mixed, default: { doctors: true, patients: true, appointments: true, lab: true, appUsers: true } },
    is_active: { type: Boolean, default: true },
    gender: { type: String },
    age: { type: Number },
    phone: { type: String },
}, { 
    timestamps: { createdAt: 'created_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

export const HospitalAdmin = mongoose.model("HospitalAdmin", HospitalAdminSchema);

export default Hospital;
