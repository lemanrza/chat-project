import ChatModel from "../models/chatModel.js";
import MessageModel from "../models/messageModel.js";
import { Types } from "mongoose";

export interface CreateChatData {
  type: "direct" | "group" | "channel";
  members: string[];
  name?: string;
  description?: string;
  createdBy: string;
}

export interface UpdateChatData {
  name?: string;
  description?: string;
  avatar?: string;
  settings?: {
    isPrivate?: boolean;
    allowInvites?: boolean;
    muteNotifications?: boolean;
  };
}

export const createChat = async (data: CreateChatData) => {
  try {
    console.log("Creating chat with data:", data);

    if (data.type === "direct" && data.members.length !== 2) {
      console.error("Direct chat validation failed. Members:", data.members);
      throw new Error("Direct chat must have exactly 2 members");
    }

    if (data.type === "direct") {
      console.log("Checking for existing direct chat between:", data.members);
      const existingChat = await ChatModel.findOne({
        type: "direct",
        "members.user": { $all: data.members },
        "members.isActive": true,
        "archived.isArchived": false,
      });

      if (existingChat) {
        console.log("Found existing chat:", existingChat._id);
        return {
          success: true,
          data: existingChat,
          message: "Direct chat already exists",
        };
      }
    }

    const membersWithMetadata = data.members.map((memberId) => ({
      user: new Types.ObjectId(memberId),
      role: memberId === data.createdBy ? "admin" : "member",
      joinedAt: new Date(),
      isActive: true,
    }));

    console.log("Members with metadata:", membersWithMetadata);

    const chat = new ChatModel({
      type: data.type,
      members: membersWithMetadata,
      name: data.name,
      description: data.description,
      createdBy: new Types.ObjectId(data.createdBy),
      messageCount: 0,
      settings: {
        isPrivate: data.type === "direct",
        allowInvites: data.type !== "direct",
        muteNotifications: false,
      },
    });

    console.log("Saving chat to database...");
    await chat.save();
    console.log("Chat saved with ID:", chat._id);

    const populatedChat = await ChatModel.findById(chat._id)
      .populate("members.user", "username email profile")
      .populate("createdBy", "username email profile");

    console.log("Populated chat:", populatedChat);

    return {
      success: true,
      data: populatedChat,
      message: "Chat created successfully",
    };
  } catch (error: any) {
    console.error("Error in createChat service:", error);
    return {
      success: false,
      message: error.message || "Failed to create chat",
    };
  }
};

export const getUserChats = async (userId: string) => {
  try {
    const chats = await ChatModel.find({
      "members.user": new Types.ObjectId(userId),
      "members.isActive": true,
      "archived.isArchived": false,
    })
      .populate("members.user", "username email profile isOnline lastSeen")
      .populate("lastMessage.sender", "username profile")
      .populate("lastMessage.message")
      .sort({ "lastMessage.timestamp": -1, updatedAt: -1 });

    return {
      success: true,
      data: chats,
      message: "Chats retrieved successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to retrieve chats",
    };
  }
};

export const getChatById = async (chatId: string, userId: string) => {
  try {
    const chat = await ChatModel.findOne({
      _id: new Types.ObjectId(chatId),
      "members.user": new Types.ObjectId(userId),
      "members.isActive": true,
    })
      .populate("members.user", "username email profile isOnline lastSeen")
      .populate("pinnedMessages")
      .populate("createdBy", "username profile");

    if (!chat) {
      return {
        success: false,
        message: "Chat not found or access denied",
      };
    }

    return {
      success: true,
      data: chat,
      message: "Chat retrieved successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to retrieve chat",
    };
  }
};

export const updateChat = async (
  chatId: string,
  updateData: UpdateChatData,
  userId: string
) => {
  try {
    const chat = await ChatModel.findOne({
      _id: new Types.ObjectId(chatId),
      "members.user": new Types.ObjectId(userId),
      "members.role": { $in: ["admin", "moderator"] },
    });

    if (!chat) {
      return {
        success: false,
        message: "Chat not found or insufficient permissions",
      };
    }

    const updatedChat = await ChatModel.findByIdAndUpdate(
      chatId,
      { $set: updateData },
      { new: true }
    )
      .populate("members.user", "username email profile")
      .populate("createdBy", "username profile");

    return {
      success: true,
      data: updatedChat,
      message: "Chat updated successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update chat",
    };
  }
};

export const addMemberToChat = async (
  chatId: string,
  newMemberId: string,
  addedBy: string
) => {
  try {
    const chat = await ChatModel.findOne({
      _id: new Types.ObjectId(chatId),
      "members.user": new Types.ObjectId(addedBy),
      "members.role": { $in: ["admin", "moderator"] },
    });

    if (!chat) {
      return {
        success: false,
        message: "Chat not found or insufficient permissions",
      };
    }

    if (chat.type === "direct") {
      return {
        success: false,
        message: "Cannot add members to direct chat",
      };
    }

    const existingMember = chat.members.find(
      (member: any) => member.user.toString() === newMemberId && member.isActive
    );

    if (existingMember) {
      return {
        success: false,
        message: "User is already a member of this chat",
      };
    }

    const updatedChat = await ChatModel.findByIdAndUpdate(
      chatId,
      {
        $push: {
          members: {
            user: new Types.ObjectId(newMemberId),
            role: "member",
            joinedAt: new Date(),
            isActive: true,
          },
        },
      },
      { new: true }
    ).populate("members.user", "username email profile");

    return {
      success: true,
      data: updatedChat,
      message: "Member added successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to add member",
    };
  }
};

export const removeMemberFromChat = async (
  chatId: string,
  memberId: string,
  removedBy: string
) => {
  try {
    const chat = await ChatModel.findOne({
      _id: new Types.ObjectId(chatId),
      "members.user": new Types.ObjectId(removedBy),
      "members.role": { $in: ["admin", "moderator"] },
    });

    if (!chat) {
      return {
        success: false,
        message: "Chat not found or insufficient permissions",
      };
    }

    if (chat.type === "direct") {
      return {
        success: false,
        message: "Cannot remove members from direct chat",
      };
    }

    const updatedChat = await ChatModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(chatId),
        "members.user": new Types.ObjectId(memberId),
      },
      {
        $set: {
          "members.$.isActive": false,
          "members.$.leftAt": new Date(),
        },
      },
      { new: true }
    ).populate("members.user", "username email profile");

    return {
      success: true,
      data: updatedChat,
      message: "Member removed successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to remove member",
    };
  }
};

export const archiveChat = async (chatId: string, userId: string) => {
  try {
    const chat = await ChatModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(chatId),
        "members.user": new Types.ObjectId(userId),
      },
      {
        $set: {
          "archived.isArchived": true,
          "archived.archivedAt": new Date(),
          "archived.archivedBy": new Types.ObjectId(userId),
        },
      },
      { new: true }
    );

    if (!chat) {
      return {
        success: false,
        message: "Chat not found",
      };
    }

    return {
      success: true,
      data: chat,
      message: "Chat archived successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to archive chat",
    };
  }
};

export const deleteChat = async (chatId: string, userId: string) => {
  try {
    const chat = await ChatModel.findOne({
      _id: new Types.ObjectId(chatId),
      "members.user": new Types.ObjectId(userId),
      "members.role": "admin",
    });

    if (!chat) {
      return {
        success: false,
        message: "Chat not found or insufficient permissions",
      };
    }

    await MessageModel.deleteMany({ chat: new Types.ObjectId(chatId) });

    await ChatModel.findByIdAndDelete(chatId);

    return {
      success: true,
      message: "Chat deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete chat",
    };
  }
};

export const searchChats = async (userId: string, query: string) => {
  try {
    const chats = await ChatModel.find({
      "members.user": new Types.ObjectId(userId),
      "members.isActive": true,
      "archived.isArchived": false,
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    })
      .populate("members.user", "username email profile")
      .populate("lastMessage.sender", "username profile")
      .limit(20);

    return {
      success: true,
      data: chats,
      message: "Search completed successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Search failed",
    };
  }
};
