import express from "express";
import { send, fetchConversation } from "../controllers/MessageController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Send a message
router.post("/", verifyToken, send);

// Get conversation with a specific user
router.get("/:userId", verifyToken, fetchConversation);

export default router;
