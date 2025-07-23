import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  sendMessage,
  getMessages,
  editMessage,
  removeMessage,
  markAsRead,
  reactToMessage,
  searchChatMessages,
  getUnreadCount,
  markAllAsRead,
} from "../controllers/messageController.js";

const messageRouter = express.Router();

// All message routes require authentication
messageRouter.use(authenticateToken);

// Message management routes
messageRouter.post("/", sendMessage); // Send new message
messageRouter.get("/unread-count", getUnreadCount); // Get unread message count
messageRouter.get("/chat/:chatId", getMessages); // Get messages for a chat
messageRouter.get("/chat/:chatId/search", searchChatMessages); // Search messages in chat
messageRouter.put("/:messageId", editMessage); // Edit message
messageRouter.delete("/:messageId", removeMessage); // Delete message

// Message interaction routes
messageRouter.patch("/:messageId/read", markAsRead); // Mark message as read
messageRouter.post("/:messageId/react", reactToMessage); // Add/remove reaction
messageRouter.patch("/chat/:chatId/read-all", markAllAsRead); // Mark all messages as read

export default messageRouter;
