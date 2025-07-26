import { getUserChats } from "../services/chatService.js";
export const registerChatHandlers = (io, socket) => {
    socket.on("auth:join", async () => {
        try {
            const userChats = await getUserChats(socket.user.id);
            userChats.forEach((chat) => {
                socket.join(`chat:${chat._id}`);
            });
            socket.join(`user:${socket.user.id}`);
            socket.broadcast.emit("user:online", {
                userId: socket.user.id,
                status: "online",
                timestamp: new Date(),
            });
        }
        catch (error) {
            console.error("Error joining chat rooms:", error);
            socket.emit("error", { message: "Failed to join chat rooms" });
        }
    });
    socket.on("chat:join", (data) => {
        socket.join(`chat:${data.chatId}`);
    });
    socket.on("chat:leave", (data) => {
        socket.leave(`chat:${data.chatId}`);
    });
};
