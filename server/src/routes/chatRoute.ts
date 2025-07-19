import express from "express";
import Chat from "../models/chatModel";

const chatRouter = express.Router();

chatRouter.post("/", async (req, res) => {
  const { userId1, userId2 } = req.body;

  try {
    let chat = await Chat.findOne({
      members: { $all: [userId1, userId2], $size: 2 },
    });

    if (!chat) {
      chat = await Chat.create({ members: [userId1, userId2] });
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: "Failed to create/get chat" });
  }
});

chatRouter.get("/:userId", async (req, res) => {
  try {
    const chats = await Chat.find({ members: req.params.userId })
      .populate("members", "username profile.displayName avatar")
      .populate("lastMessage");

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

export default chatRouter;
