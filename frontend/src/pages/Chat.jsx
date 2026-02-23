import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

const Chat = () => {
    const { userId } = useParams(); // ID of the person we are chatting with
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    const fetchMessages = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/messages/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(res.data);
            setLoading(false);
            scrollToBottom();
        } catch (err) {
            console.error("Failed to fetch messages", err);
            setLoading(false);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await axios.post(`${API_BASE_URL}/api/messages`, {
                receiver_id: userId,
                message: newMessage
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewMessage("");
            fetchMessages(); // Refresh messages
        } catch (err) {
            console.error("Failed to send message", err);
            alert("Failed to send message");
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        fetchMessages();
        // Poll for new messages every 5 seconds
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [userId]);

    return (
        <div className="container mt-4">
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Chat</h5>
                </div>
                <div className="card-body" style={{ height: "400px", overflowY: "auto", display: "flex", flexDirection: "column" }}>
                    {loading ? (
                        <p className="text-center">Loading messages...</p>
                    ) : messages.length === 0 ? (
                        <p className="text-center text-muted mt-5">No messages yet. Start the conversation!</p>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`d-flex mb-3 ${msg.sender_id === currentUser.id ? "justify-content-end" : "justify-content-start"}`}
                            >
                                <div
                                    className={`p-3 rounded ${msg.sender_id === currentUser.id ? "bg-primary text-white" : "bg-light border"}`}
                                    style={{ maxWidth: "70%" }}
                                >
                                    <p className="mb-1">{msg.message}</p>
                                    <small className={msg.sender_id === currentUser.id ? "text-light" : "text-muted"} style={{ fontSize: "0.75rem" }}>
                                        {new Date(msg.timestamp).toLocaleTimeString()}
                                    </small>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="card-footer">
                    <form onSubmit={sendMessage} className="d-flex">
                        <input
                            type="text"
                            className="form-control me-2"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary">Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chat;
