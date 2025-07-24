import type { Message } from "@/types/socketType";

export const setupSocketListeners = (
  socket: any,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  // Listen for new messages
  socket.on("message:new", (newMessage: any) => {
    const formattedMessage: Message = {
      id: Date.now(),
      sender: newMessage.sender?.username,
      content: newMessage.content,
      time: new Date(newMessage.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: false, // Server messages are from others
    };
    setMessages((prev) => [...prev, formattedMessage]);
  });

  // Listen for typing indicators
  socket.on("message:typing", (data: any) => {
    console.log(`${data.username} is typing...`);
  });

  socket.on("message:stopTyping", (data: any) => {
    console.log(`${data.username} stopped typing`);
  });

  // Listen for user status changes
  socket.on("user:online", (data: any) => {
    console.log(`${data.username} came online`);
  });

  socket.on("user:offline", (data: any) => {
    console.log(`${data.username} went offline`);
  });

  // Handle errors
  socket.on("error", (error: any) => {
    console.error("Socket error:", error.message);
  });
};
