import ChatModel from "../models/chatModel.js";
import MessageModel from "../models/messageModel.js";
import { Types } from "mongoose";
// Create a new chat
export const createChat = async (data) => {
    try {
        // For direct chats, ensure only 2 members
        if (data.type === "direct" && data.members.length !== 2) {
            throw new Error("Direct chat must have exactly 2 members");
        }
        // Check if direct chat already exists
        if (data.type === "direct") {
            const existingChat = await ChatModel.findOne({
                type: "direct",
                "members.user": { $all: data.members },
                "members.isActive": true,
                "archived.isArchived": false,
            });
            if (existingChat) {
                return {
                    success: true,
                    data: existingChat,
                    message: "Direct chat already exists",
                };
            }
        }
        // Create members array with metadata
        const membersWithMetadata = data.members.map((memberId) => ({
            user: new Types.ObjectId(memberId),
            role: memberId === data.createdBy ? "admin" : "member",
            joinedAt: new Date(),
            isActive: true,
        }));
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
        await chat.save();
        // Populate the created chat
        const populatedChat = await ChatModel.findById(chat._id)
            .populate("members.user", "username email profile")
            .populate("createdBy", "username email profile");
        return {
            success: true,
            data: populatedChat,
            message: "Chat created successfully",
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message || "Failed to create chat",
        };
    }
};
// Get user's chats
export const getUserChats = async (userId) => {
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
    }
    catch (error) {
        return {
            success: false,
            message: error.message || "Failed to retrieve chats",
        };
    }
};
// Get chat by ID
export const getChatById = async (chatId, userId) => {
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
    }
    catch (error) {
        return {
            success: false,
            message: error.message || "Failed to retrieve chat",
        };
    }
};
// Update chat
export const updateChat = async (chatId, updateData, userId) => {
    try {
        // Check if user is admin or moderator
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
        const updatedChat = await ChatModel.findByIdAndUpdate(chatId, { $set: updateData }, { new: true })
            .populate("members.user", "username email profile")
            .populate("createdBy", "username profile");
        return {
            success: true,
            data: updatedChat,
            message: "Chat updated successfully",
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message || "Failed to update chat",
        };
    }
};
// Add member to chat
export const addMemberToChat = async (chatId, newMemberId, addedBy) => {
    try {
        // Check if user has permission to add members
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
        // Check if member already exists
        const existingMember = chat.members.find((member) => member.user.toString() === newMemberId && member.isActive);
        if (existingMember) {
            return {
                success: false,
                message: "User is already a member of this chat",
            };
        }
        // Add new member
        const updatedChat = await ChatModel.findByIdAndUpdate(chatId, {
            $push: {
                members: {
                    user: new Types.ObjectId(newMemberId),
                    role: "member",
                    joinedAt: new Date(),
                    isActive: true,
                },
            },
        }, { new: true }).populate("members.user", "username email profile");
        return {
            success: true,
            data: updatedChat,
            message: "Member added successfully",
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message || "Failed to add member",
        };
    }
};
// Remove member from chat
export const removeMemberFromChat = async (chatId, memberId, removedBy) => {
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
        // Update member status
        const updatedChat = await ChatModel.findOneAndUpdate({
            _id: new Types.ObjectId(chatId),
            "members.user": new Types.ObjectId(memberId),
        }, {
            $set: {
                "members.$.isActive": false,
                "members.$.leftAt": new Date(),
            },
        }, { new: true }).populate("members.user", "username email profile");
        return {
            success: true,
            data: updatedChat,
            message: "Member removed successfully",
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message || "Failed to remove member",
        };
    }
};
// Archive chat
export const archiveChat = async (chatId, userId) => {
    try {
        const chat = await ChatModel.findOneAndUpdate({
            _id: new Types.ObjectId(chatId),
            "members.user": new Types.ObjectId(userId),
        }, {
            $set: {
                "archived.isArchived": true,
                "archived.archivedAt": new Date(),
                "archived.archivedBy": new Types.ObjectId(userId),
            },
        }, { new: true });
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
    }
    catch (error) {
        return {
            success: false,
            message: error.message || "Failed to archive chat",
        };
    }
};
// Delete chat (only for admins)
export const deleteChat = async (chatId, userId) => {
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
        // Delete all messages in the chat
        await MessageModel.deleteMany({ chat: new Types.ObjectId(chatId) });
        // Delete the chat
        await ChatModel.findByIdAndDelete(chatId);
        return {
            success: true,
            message: "Chat deleted successfully",
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message || "Failed to delete chat",
        };
    }
};
// Search chats
export const searchChats = async (userId, query) => {
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
    }
    catch (error) {
        return {
            success: false,
            message: error.message || "Search failed",
        };
    }
};
