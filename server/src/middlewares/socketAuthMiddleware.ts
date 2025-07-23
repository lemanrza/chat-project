import jwt from "jsonwebtoken";
import { CustomSocket } from "../types/socketType.js";
import config from "../config/config.js";
import { getOne } from "../services/userService.js";

export const socketAuthMiddleware = async (socket: CustomSocket, next: any) => {
  try {
    const token =
      socket.handshake.auth.token ||
      socket.handshake.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return next(new Error("Authentication token required"));
    }

    const decoded = jwt.verify(token, "") as any;
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
  } catch (error) {
    console.error("Socket authentication error:", error);
    next(new Error("Invalid authentication token"));
  }
};
