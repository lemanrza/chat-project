import { Server } from "socket.io";
import { AuthenticatedSocket } from "../types/socketType.js";
import { getUserChats } from "../services/chatService.js";

export const registerChatHandlers = (
  io: Server,
  socket: AuthenticatedSocket
) => {
  socket.on("auth:join", async () => {
    try {
      const userChats: any = await getUserChats(socket.user.id);

      userChats.forEach((chat: any) => {
        socket.join(`chat:${chat._id}`);
      });

      socket.join(`user:${socket.user.id}`);

      socket.broadcast.emit("user:online", {
        userId: socket.user.id,
        status: "online",
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error joining chat rooms:", error);
      socket.emit("error", { message: "Failed to join chat rooms" });
    }
  });

  socket.on("chat:join", (data: { chatId: string }) => {
    socket.join(`chat:${data.chatId}`);
  });

  socket.on("chat:leave", (data: { chatId: string }) => {
    socket.leave(`chat:${data.chatId}`);
  });
};
