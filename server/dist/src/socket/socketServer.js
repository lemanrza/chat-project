import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { registerMessageHandlers } from "../utils/messageHandlers.js";
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
export const initializeSocket = async (server) => {
    // Use type assertion to bypass TypeScript module resolution issues
    const SocketIO = await import("socket.io");
    const io = new SocketIO.Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);
        // Authentication check
        socket.on("auth:join", (data) => {
            if (!data.userId) {
                socket.emit("auth:error", { message: "User ID is required" });
                return;
            }
            socket.userId = data.userId;
            socket.join(`user:${data.userId}`);
            console.log(`User ${data.userId} joined room`);
        });
        // Join chat rooms
        socket.on("join:chats", (chatIds) => {
            if (!socket.userId) {
                socket.emit("auth:error", { message: "Authentication required" });
                return;
            }
            chatIds.forEach((chatId) => {
                socket.join(`chat:${chatId}`);
            });
            console.log(`User ${socket.userId} joined chats:`, chatIds);
        });
        // Register message handlers
        registerMessageHandlers(io, socket);
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
    // Store io instance globally for access in other parts of the app
    global.io = io;
    return io;
};
