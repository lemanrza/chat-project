import { createMessage, getChatMessages, updateMessage, deleteMessage, markMessageAsRead, addReaction, searchMessages, getUnreadMessageCount, } from "../services/messageService.js";
export const sendMessage = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { chatId, content, type, replyTo, attachments } = req.body;
        if (!chatId || !content) {
            return res.status(400).json({
                success: false,
                message: "Chat ID and content are required",
            });
        }
        const response = await createMessage({
            chatId,
            senderId: userId,
            content,
            type,
            replyTo,
            attachments,
        });
        if (!response.success) {
            return res.status(400).json(response);
        }
        res.status(201).json(response);
    }
    catch (error) {
        next(error);
    }
};
export const getMessages = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { chatId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        if (!chatId) {
            return res.status(400).json({
                success: false,
                message: "Chat ID is required",
            });
        }
        if (page < 1 || limit < 1 || limit > 100) {
            return res.status(400).json({
                success: false,
                message: "Invalid pagination parameters",
            });
        }
        const response = await getChatMessages(chatId, userId, page, limit);
        if (!response.success) {
            return res.status(400).json(response);
        }
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
export const editMessage = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { messageId } = req.params;
        const { content } = req.body;
        if (!messageId || !content) {
            return res.status(400).json({
                success: false,
                message: "Message ID and content are required",
            });
        }
        const response = await updateMessage(messageId, { content }, userId);
        if (!response.success) {
            return res.status(400).json(response);
        }
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
export const removeMessage = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { messageId } = req.params;
        if (!messageId) {
            return res.status(400).json({
                success: false,
                message: "Message ID is required",
            });
        }
        const response = await deleteMessage(messageId, userId);
        if (!response.success) {
            return res.status(400).json(response);
        }
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
export const markAsRead = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { messageId } = req.params;
        if (!messageId) {
            return res.status(400).json({
                success: false,
                message: "Message ID is required",
            });
        }
        const response = await markMessageAsRead(messageId, userId);
        if (!response.success) {
            return res.status(400).json(response);
        }
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
export const reactToMessage = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { messageId } = req.params;
        const { emoji } = req.body;
        if (!messageId || !emoji) {
            return res.status(400).json({
                success: false,
                message: "Message ID and emoji are required",
            });
        }
        const emojiRegex = /^[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]$/u;
        if (!emojiRegex.test(emoji)) {
            return res.status(400).json({
                success: false,
                message: "Invalid emoji format",
            });
        }
        const response = await addReaction(messageId, userId, emoji);
        if (!response.success) {
            return res.status(400).json(response);
        }
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
export const searchChatMessages = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { chatId } = req.params;
        const { q: query } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        if (!chatId || !query || typeof query !== "string") {
            return res.status(400).json({
                success: false,
                message: "Chat ID and search query are required",
            });
        }
        if (page < 1 || limit < 1 || limit > 50) {
            return res.status(400).json({
                success: false,
                message: "Invalid pagination parameters",
            });
        }
        const response = await searchMessages(chatId, userId, query, page, limit);
        if (!response.success) {
            return res.status(400).json(response);
        }
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
export const getUnreadCount = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const response = await getUnreadMessageCount(userId);
        if (!response.success) {
            return res.status(400).json(response);
        }
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};
export const markAllAsRead = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { chatId } = req.params;
        if (!chatId) {
            return res.status(400).json({
                success: false,
                message: "Chat ID is required",
            });
        }
        res.status(200).json({
            success: true,
            message: "All messages marked as read",
        });
    }
    catch (error) {
        next(error);
    }
};
