import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
}, { 
    timestamps: { createdAt: 'timestamp' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

export const Message = mongoose.model("Message", MessageSchema);

export default Message;
