import jwt from "jsonwebtoken";
import { getOne } from "../services/userService.js";
export const socketAuthMiddleware = async (socket, next) => {
    try {
        const token = socket.handshake.auth.token ||
            socket.handshake.headers.authorization?.replace("Bearer ", "");
        if (!token) {
            return next(new Error("Authentication token required"));
        }
        const decoded = jwt.verify(token, "");
        const user = await getOne(decoded.id);
        if (!user) {
            return next(new Error("User not found"));
        }
        socket.user = {
            id: user._id.toString(),
            email: user.email,
            username: user.username,
        };
        next();
    }
    catch (error) {
        console.error("Socket authentication error:", error);
        next(new Error("Invalid authentication token"));
    }
};
