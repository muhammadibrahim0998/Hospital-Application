import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hospital_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', default: null },
    specialization: { type: String },
    contact_info: { type: String },
    image: { type: String },
    department_id: { type: String }, // Can be changed to ObjectId if departments are migrated
    field_id: { type: String },      // Can be changed to ObjectId if fields are migrated
    phone: { type: String },
    fee: { type: String },
    whatsapp_number: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { 
    timestamps: { createdAt: 'created_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

export const Doctor = mongoose.model("Doctor", DoctorSchema);

export default Doctor;
