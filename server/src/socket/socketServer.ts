import { Server } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import User from "../models/userModel.js";
import { AuthenticatedSocket } from "../types/socketType.js";
import { registerMessageHandlers } from "../utils/messageHandlers.js";

const connectedUsers = new Map<string, AuthenticatedSocket>();

const authenticateSocket = async (socket: any, next: any) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error"));
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    ) as any;
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new Error("User not found"));
    }

    socket.user = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
    };
    next();
  } catch (error) {
    next(new Error("Authentication error"));
  }
};

export const initializeSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.use(authenticateSocket);

  io.on("connection", (socket: any) => {
    const authSocket = socket as AuthenticatedSocket;
    console.log(`User ${authSocket.user.username} connected`);

    // Store connected user
    connectedUsers.set(authSocket.user.id, authSocket);

    // Join user's chats
    authSocket.on("join:chats", async (chatIds: string[]) => {
      chatIds.forEach((chatId) => {
        authSocket.join(`chat:${chatId}`);
      });
    });

    // Register all message handlers
    registerMessageHandlers(io, authSocket);

    // Handle user status
    authSocket.on("status:online", () => {
      authSocket.broadcast.emit("user:online", {
        userId: authSocket.user.id,
        username: authSocket.user.username,
      });
    });

    authSocket.on("disconnect", () => {
      console.log(`User ${authSocket.user.username} disconnected`);
      connectedUsers.delete(authSocket.user.id);

      authSocket.broadcast.emit("user:offline", {
        userId: authSocket.user.id,
        username: authSocket.user.username,
      });
    });
  });

  return io;
};
