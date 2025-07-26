import express from "express";
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
import { authenticateToken } from "../middlewares/authMiddleware.js";

const chatRouter = express.Router();

chatRouter.use(authenticateToken);

chatRouter.post("/", createNewChat);
chatRouter.get("/", getCurrentUserChats);
chatRouter.get("/search", searchUserChats);
chatRouter.get("/:chatId", getChatDetails);
chatRouter.put("/:chatId", updateChatDetails);
chatRouter.delete("/:chatId", deleteChatById);
chatRouter.patch("/:chatId/archive", archiveChatById);

chatRouter.post("/:chatId/members", addChatMember);
chatRouter.delete("/:chatId/members/:memberId", removeChatMember);

export default chatRouter;
