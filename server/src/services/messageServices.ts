import ChatModel from "../models/chatModel";
import MessageModel from "../models/messageModel";

export const createMessage = async (data: {
  chatId: string;
  content: string;
  senderId: string;
}) => {
  const message = new MessageModel({
    chat: data.chatId,
    sender: data.senderId,
    content: data.content,
    seenBy: [data.senderId],
  });

  await message.save();

  await ChatModel.findByIdAndUpdate(data.chatId, {
    lastMessage: message._id,
    updatedAt: new Date(),
  });

  return message;
};

export const updateMessage = async (
  messageId: string,
  content: string,
  userId: string
) => {
  const message = await MessageModel.findOneAndUpdate(
    { _id: messageId, sender: userId },
    { content, updatedAt: new Date() },
    { new: true }
  );

  if (!message) {
    throw new Error("Message not found or unauthorized");
  }

  return message;
};

export const deleteMessage = async (messageId: string, userId: string) => {
  const message = await MessageModel.findOne({
    _id: messageId,
    sender: userId,
  });

  if (!message) {
    throw new Error("Message not found or unauthorized");
  }

  await MessageModel.findByIdAndDelete(messageId);
  return message;
};

export const markAsRead = async (messageId: string, userId: string) => {
  await MessageModel.findByIdAndUpdate(messageId, {
    $addToSet: { seenBy: userId },
  });
};
