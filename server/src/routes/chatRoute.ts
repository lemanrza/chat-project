import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  createNewChat,
  getCurrentUserChats,
  getChatDetails,
  updateChatDetails,
  addChatMember,
  removeChatMember,
  archiveChatById,
  deleteChatById,
  searchUserChats,
} from "../controllers/chatController.js";

const chatRouter = express.Router();

// All chat routes require authentication
chatRouter.use(authenticateToken);

// Chat management routes
chatRouter.post("/", createNewChat); // Create new chat
chatRouter.get("/", getCurrentUserChats); // Get user's chats
chatRouter.get("/search", searchUserChats); // Search chats
chatRouter.get("/:chatId", getChatDetails); // Get specific chat
chatRouter.put("/:chatId", updateChatDetails); // Update chat details
chatRouter.delete("/:chatId", deleteChatById); // Delete chat
chatRouter.patch("/:chatId/archive", archiveChatById); // Archive chat

// Member management routes
chatRouter.post("/:chatId/members", addChatMember); // Add member
chatRouter.delete("/:chatId/members/:memberId", removeChatMember); // Remove member

export default chatRouter;
