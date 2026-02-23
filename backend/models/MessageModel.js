import db from "../config/db.js";

// Send a message
export const sendMessage = async (sender_id, receiver_id, message) => {
    const sql = "INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)";
    return await db.query(sql, [sender_id, receiver_id, message]);
};

// Get conversation between two users
export const getMessages = async (user1_id, user2_id) => {
    const sql = `
        SELECT m.*, u.name as sender_name 
        FROM messages m 
        JOIN users u ON m.sender_id = u.id
        WHERE (sender_id = ? AND receiver_id = ?) 
           OR (sender_id = ? AND receiver_id = ?) 
        ORDER BY timestamp ASC
    `;
    const [rows] = await db.query(sql, [user1_id, user2_id, user2_id, user1_id]);
    return rows;
};

// Get list of users the current user has chatted with (Simplified: Get all users)
// In a real app, this would be more complex distinct query.
// For now, we will rely on frontend to select a user to chat with from Doctor/Patient lists.
