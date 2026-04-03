import { Message } from "../models/MessageModel.js";

export const send = async (req, res) => {
    const { receiver_id, message } = req.body;
    const sender_id = req.userId;
    if (!receiver_id || !message) {
        return res.status(400).json({ message: "Receiver and message are required" });
    }
    try {
        await Message.create({ sender_id, receiver_id, message });
        res.status(201).json({ message: "Message sent" });
    } catch (err) {
        res.status(500).json({ message: "Failed to send message" });
    }
};

export const fetchConversation = async (req, res) => {
    const currentUserId = req.userId;
    const otherUserId = req.params.userId;
    try {
        const messages = await Message.find({
            $or: [
                { sender_id: currentUserId, receiver_id: otherUserId },
                { sender_id: otherUserId, receiver_id: currentUserId }
            ]
        }).populate('sender_id', 'name').sort({ timestamp: 1 });
        const formatted = messages.map(m => ({ ...m.toObject(), sender_name: m.sender_id?.name }));
        res.json(formatted);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch messages" });
    }
};
