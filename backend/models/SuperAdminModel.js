import mongoose from "mongoose";

const SuperAdminSchema = new mongoose.Schema({
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    permissions: { 
        type: [String], 
        default: ['all'] 
    },
    status: { 
        type: String, 
        enum: ['active', 'inactive'], 
        default: 'active' 
    }
}, { 
    timestamps: { createdAt: 'created_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

export const SuperAdmin = mongoose.model("SuperAdmin", SuperAdminSchema);

export default SuperAdmin;
