import express from "express";
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

messageRouter.post("/", sendMessage);
messageRouter.get("/unread-count", getUnreadCount);
messageRouter.get("/chat/:chatId", getMessages);
messageRouter.get("/chat/:chatId/search", searchChatMessages);
messageRouter.put("/:messageId", editMessage);
messageRouter.delete("/:messageId", removeMessage);

messageRouter.patch("/:messageId/read", markAsRead);
messageRouter.post("/:messageId/react", reactToMessage);
messageRouter.patch("/chat/:chatId/read-all", markAllAsRead);

export default messageRouter;
