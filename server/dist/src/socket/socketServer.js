import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { registerMessageHandlers } from "../utils/messageHandlers.js";
import { registerChatHandlers } from "../utils/chatHandlers.js";
const connectedUsers = new Map();
const authenticateSocket = async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication error"));
        }
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY || "secret");
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
    }
    catch (error) {
        next(new Error("Authentication error"));
    }
};
export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            credentials: true,
        },
    });
    io.use(authenticateSocket);
    io.on("connection", (socket) => {
        const authSocket = socket;
        connectedUsers.set(authSocket.user.id, authSocket);
        authSocket.on("join:chats", async (chatIds) => {
            chatIds.forEach((chatId) => {
                authSocket.join(`chat:${chatId}`);
            });
        });
        registerMessageHandlers(io, authSocket);
        registerChatHandlers(io, authSocket);
        authSocket.on("status:online", () => {
            authSocket.broadcast.emit("user:online", {
                userId: authSocket.user.id,
                username: authSocket.user.username,
            });
        });
        authSocket.on("disconnect", () => {
            connectedUsers.delete(authSocket.user.id);
            authSocket.broadcast.emit("user:offline", {
                userId: authSocket.user.id,
                username: authSocket.user.username,
            });
        });
    });
    return io;
};
