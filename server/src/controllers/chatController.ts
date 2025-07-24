import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../types/userType.js";
import {
  createChat,
  getUserChats,
  getChatById,
  updateChat,
  addMemberToChat,
  removeMemberFromChat,
  archiveChat,
  deleteChat,
  searchChats,
} from "../services/chatService.js";

export const createNewChat = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const { type, members, name, description } = req.body;

    if (!type || !members || !Array.isArray(members)) {
      return res.status(400).json({
        success: false,
        message: "Type and members array are required",
      });
    }

    if (type === "direct" && members.length !== 1) {
      return res.status(400).json({
        success: false,
        message: "Direct chat requires exactly one other member",
      });
    }

    if (type !== "direct" && !name) {
      return res.status(400).json({
        success: false,
        message: "Group and channel chats require a name",
      });
    }

    const allMembers = [...new Set([...members, userId])];

    const response = await createChat({
      type,
      members: allMembers,
      name,
      description,
      createdBy: userId,
    });

    if (!response.success) {
      return res.status(400).json(response);
    }

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const getCurrentUserChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId query parameter is required",
      });
    }

    const response = await getUserChats(userId);

    if (!response.success) {
      return res.status(400).json(response);
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getChatDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.query.userId as string;
    const { chatId } = req.params;

    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: "Chat ID is required",
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId query parameter is required",
      });
    }

    const response = await getChatById(chatId, userId);

    if (!response.success) {
      return res.status(404).json(response);
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateChatDetails = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;
    const updateData = req.body;

    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: "Chat ID is required",
      });
    }

    const response = await updateChat(chatId, updateData, userId);

    if (!response.success) {
      return res.status(400).json(response);
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const addChatMember = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;
    const { memberId } = req.body;

    if (!chatId || !memberId) {
      return res.status(400).json({
        success: false,
        message: "Chat ID and member ID are required",
      });
    }

    const response = await addMemberToChat(chatId, memberId, userId);

    if (!response.success) {
      return res.status(400).json(response);
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const removeChatMember = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const { chatId, memberId } = req.params;

    if (!chatId || !memberId) {
      return res.status(400).json({
        success: false,
        message: "Chat ID and member ID are required",
      });
    }

    const response = await removeMemberFromChat(chatId, memberId, userId);

    if (!response.success) {
      return res.status(400).json(response);
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const archiveChatById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;

    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: "Chat ID is required",
      });
    }

    const response = await archiveChat(chatId, userId);

    if (!response.success) {
      return res.status(400).json(response);
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteChatById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;

    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: "Chat ID is required",
      });
    }

    const response = await deleteChat(chatId, userId);

    if (!response.success) {
      return res.status(400).json(response);
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const searchUserChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.query.userId as string;
    const { q: query } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId query parameter is required",
      });
    }

    if (!query || typeof query !== "string") {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const response = await searchChats(userId, query);

    if (!response.success) {
      return res.status(400).json(response);
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
