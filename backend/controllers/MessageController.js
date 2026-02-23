import { sendMessage, getMessages } from "../models/MessageModel.js";

export const send = async (req, res) => {
    const { receiver_id, message } = req.body;
    const sender_id = req.userId;

    if (!receiver_id || !message) {
        return res.status(400).json({ message: "Receiver and message are required" });
    }

    try {
        await sendMessage(sender_id, receiver_id, message);
        res.status(201).json({ message: "Message sent" });
    } catch (err) {
        console.error("Send message error:", err);
        res.status(500).json({ message: "Failed to send message" });
    }
};

export const fetchConversation = async (req, res) => {
    const { userId: otherUserId } = req.params;
    const currentUserId = req.userId;

    try {
        const messages = await getMessages(currentUserId, otherUserId);
        res.json(messages);
    } catch (err) {
        console.error("Fetch messages error:", err);
        res.status(500).json({ message: "Failed to fetch messages" });
    }
};
