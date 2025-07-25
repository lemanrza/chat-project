import MessageModel from "../models/messageModel.js";
import ChatModel from "../models/chatModel.js";
import { Types } from "mongoose";

export interface CreateMessageData {
  chatId: string;
  senderId: string;
  content: string;
  type?: "text" | "image" | "file" | "audio" | "video" | "system";
  replyTo?: string;
  attachments?: Array<{
    type: string;
    url: string;
    filename: string;
    size: number;
    mimetype: string;
  }>;
}

export interface UpdateMessageData {
  content: string;
}

// Create a new message
export const createMessage = async (data: CreateMessageData) => {
  try {
    const chat = await ChatModel.findOne({
      _id: new Types.ObjectId(data.chatId),
      "members.user": new Types.ObjectId(data.senderId),
      "members.isActive": true,
    });

    if (!chat) {
      throw new Error("Chat not found or access denied");
    }

    const message = new MessageModel({
      chat: new Types.ObjectId(data.chatId),
      sender: new Types.ObjectId(data.senderId),
      content: data.content,
      type: data.type || "text",
      replyTo: data.replyTo ? new Types.ObjectId(data.replyTo) : null,
      attachments: data.attachments || [],
      seenBy: [
        {
          user: new Types.ObjectId(data.senderId),
          seenAt: new Date(),
        },
      ],
      status: "sent",
    });

    await message.save();

    await ChatModel.findByIdAndUpdate(data.chatId, {
      $set: {
        "lastMessage.message": message._id,
        "lastMessage.timestamp": message.createdAt,
        "lastMessage.sender": message.sender,
        "lastMessage.preview": data.content.substring(0, 100),
      },
      $inc: { messageCount: 1 },
    });

    const populatedMessage = await MessageModel.findById(message._id)
      .populate("sender", "username email profile")
      .populate("replyTo")
      .populate("seenBy.user", "username profile");

    return {
      success: true,
      data: populatedMessage,
      message: "Message sent successfully",
    };
  } catch (error: any) {
    console.log("❌ Error in createMessage service:", error);
    return {
      success: false,
      message: error.message || "Failed to send message",
    };
  }
};

// Get messages for a chat
export const getChatMessages = async (
  chatId: string,
  userId: string,
  page: number = 1,
  limit: number = 50
) => {
  try {
    const chat = await ChatModel.findOne({
      _id: new Types.ObjectId(chatId),
      "members.user": new Types.ObjectId(userId),
      "members.isActive": true,
    });

    if (!chat) {
      return {
        success: false,
        message: "Chat not found or access denied",
      };
    }

    const skip = (page - 1) * limit;

    const messages = await MessageModel.find({
      chat: new Types.ObjectId(chatId),
      "deleted.isDeleted": false,
    })
      .populate("sender", "username email profile")
      .populate("replyTo")
      .populate("seenBy.user", "username profile")
      .populate("reactions.user", "username profile")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalMessages = await MessageModel.countDocuments({
      chat: new Types.ObjectId(chatId),
      "deleted.isDeleted": false,
    });

    return {
      success: true,
      data: {
        messages: messages.reverse(),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalMessages / limit),
          totalMessages,
          hasNextPage: page * limit < totalMessages,
          hasPrevPage: page > 1,
        },
      },
      message: "Messages retrieved successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to retrieve messages",
    };
  }
};

// Update message
export const updateMessage = async (
  messageId: string,
  updateData: UpdateMessageData,
  userId: string
) => {
  try {
    const message = await MessageModel.findOne({
      _id: new Types.ObjectId(messageId),
      sender: new Types.ObjectId(userId),
      "deleted.isDeleted": false,
    });

    if (!message) {
      return {
        success: false,
        message: "Message not found or unauthorized",
      };
    }

    if (!message.edited?.isEdited) {
      await MessageModel.findByIdAndUpdate(messageId, {
        $set: {
          "edited.originalContent": message.content,
        },
      });
    }

    const updatedMessage = await MessageModel.findByIdAndUpdate(
      messageId,
      {
        $set: {
          content: updateData.content,
          "edited.isEdited": true,
          "edited.editedAt": new Date(),
        },
      },
      { new: true }
    )
      .populate("sender", "username email profile")
      .populate("replyTo")
      .populate("seenBy.user", "username profile");

    return {
      success: true,
      data: updatedMessage,
      message: "Message updated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update message",
    };
  }
};

// Delete message
export const deleteMessage = async (messageId: string, userId: string) => {
  try {
    const message = await MessageModel.findOne({
      _id: new Types.ObjectId(messageId),
      sender: new Types.ObjectId(userId),
    });

    if (!message) {
      return {
        success: false,
        message: "Message not found or unauthorized",
      };
    }

    const deletedMessage = await MessageModel.findByIdAndUpdate(
      messageId,
      {
        $set: {
          "deleted.isDeleted": true,
          "deleted.deletedAt": new Date(),
          "deleted.deletedBy": new Types.ObjectId(userId),
        },
      },
      { new: true }
    );

    return {
      success: true,
      data: deletedMessage,
      message: "Message deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete message",
    };
  }
};

// Mark message as read
export const markMessageAsRead = async (messageId: string, userId: string) => {
  try {
    const message = await MessageModel.findById(messageId);

    if (!message) {
      return {
        success: false,
        message: "Message not found",
      };
    }

    const alreadyRead = message.seenBy.some(
      (seen: any) => seen.user.toString() === userId
    );

    if (alreadyRead) {
      return {
        success: true,
        message: "Message already marked as read",
      };
    }

    const updatedMessage = await MessageModel.findByIdAndUpdate(
      messageId,
      {
        $push: {
          seenBy: {
            user: new Types.ObjectId(userId),
            seenAt: new Date(),
          },
        },
        $set: { status: "read" },
      },
      { new: true }
    ).populate("seenBy.user", "username profile");

    return {
      success: true,
      data: updatedMessage,
      message: "Message marked as read",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to mark message as read",
    };
  }
};

// Add reaction to message
export const addReaction = async (
  messageId: string,
  userId: string,
  emoji: string
) => {
  try {
    const message = await MessageModel.findById(messageId);

    if (!message) {
      return {
        success: false,
        message: "Message not found",
      };
    }

    const existingReaction = message.reactions.find(
      (reaction: any) =>
        reaction.user.toString() === userId && reaction.emoji === emoji
    );

    if (existingReaction) {
      await MessageModel.findByIdAndUpdate(messageId, {
        $pull: {
          reactions: {
            user: new Types.ObjectId(userId),
            emoji: emoji,
          },
        },
      });

      return {
        success: true,
        message: "Reaction removed",
      };
    } else {
      const updatedMessage = await MessageModel.findByIdAndUpdate(
        messageId,
        {
          $push: {
            reactions: {
              user: new Types.ObjectId(userId),
              emoji: emoji,
              createdAt: new Date(),
            },
          },
        },
        { new: true }
      ).populate("reactions.user", "username profile");

      return {
        success: true,
        data: updatedMessage,
        message: "Reaction added",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to add reaction",
    };
  }
};

// Search messages in a chat
export const searchMessages = async (
  chatId: string,
  userId: string,
  query: string,
  page: number = 1,
  limit: number = 20
) => {
  try {
    const chat = await ChatModel.findOne({
      _id: new Types.ObjectId(chatId),
      "members.user": new Types.ObjectId(userId),
      "members.isActive": true,
    });

    if (!chat) {
      return {
        success: false,
        message: "Chat not found or access denied",
      };
    }

    const skip = (page - 1) * limit;

    const messages = await MessageModel.find({
      chat: new Types.ObjectId(chatId),
      content: { $regex: query, $options: "i" },
      "deleted.isDeleted": false,
    })
      .populate("sender", "username email profile")
      .populate("replyTo")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalResults = await MessageModel.countDocuments({
      chat: new Types.ObjectId(chatId),
      content: { $regex: query, $options: "i" },
      "deleted.isDeleted": false,
    });

    return {
      success: true,
      data: {
        messages,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalResults / limit),
          totalResults,
          hasNextPage: page * limit < totalResults,
          hasPrevPage: page > 1,
        },
      },
      message: "Search completed successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Search failed",
    };
  }
};

// Get unread message count for user
export const getUnreadMessageCount = async (userId: string) => {
  try {
    const userChats = await ChatModel.find({
      "members.user": new Types.ObjectId(userId),
      "members.isActive": true,
      "archived.isArchived": false,
    }).select("_id");

    const chatIds = userChats.map((chat) => chat._id);

    const unreadCount = await MessageModel.countDocuments({
      chat: { $in: chatIds },
      sender: { $ne: new Types.ObjectId(userId) },
      "seenBy.user": { $ne: new Types.ObjectId(userId) },
      "deleted.isDeleted": false,
    });

    return {
      success: true,
      data: { unreadCount },
      message: "Unread count retrieved successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to get unread count",
    };
  }
};
