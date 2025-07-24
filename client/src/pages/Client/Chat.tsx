import { useEffect, useState } from "react";
import {
  Search,
  Phone,
  Video,
  MoreHorizontal,
  Paperclip,
  Smile,
  Send,
} from "lucide-react";
import socket from "@/socket/socket";
import controller from "@/services/commonRequest";
import endpoints from "@/services/api";
import { getUserIdFromToken } from "@/utils/auth";
import { enqueueSnackbar } from "notistack";

interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    username: string;
    profile: {
      firstName: string;
      lastName: string;
      avatar?: string;
    };
  };
  chat: string;
  createdAt: string;
  updatedAt: string;
  isMe?: boolean;
}

interface Chat {
  _id: string;
  name?: string;
  isGroup: boolean;
  members: Array<{
    _id: string;
    username: string;
    profile: {
      firstName: string;
      lastName: string;
      avatar?: string;
    };
  }>;
  lastMessage?: {
    content: string;
    createdAt: string;
    sender: string;
  };
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
}

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState<string>("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [typing, setTyping] = useState<{ [key: string]: boolean }>({});

  // Initialize user and load chats
  useEffect(() => {
    initializeUser();
    setupSocketListeners();

    return () => {
      cleanupSocketListeners();
    };
  }, []);

  const initializeUser = async () => {
    try {
      const userId = getUserIdFromToken();
      if (userId) {
        setCurrentUserId(userId);
        await loadUserChats(userId);
      } else {
        enqueueSnackbar("Please login to view chats", {
          variant: "error",
          autoHideDuration: 3000,
        });
      }
    } catch (error) {
      console.error("Error initializing user:", error);
    }
  };

  // Load user's chats from API
  const loadUserChats = async (userId: string) => {
    try {
      setLoading(true);
      const response = await controller.getAll(
        `${endpoints.chats}?userId=${userId}`
      );

      if (response.success && response.data) {
        setChats(response.data);
        // Select first chat if available
        if (response.data.length > 0) {
          setSelectedChat(response.data[0]._id);
        }
      }
    } catch (error) {
      console.error("Error loading chats:", error);
      enqueueSnackbar("Failed to load chats", {
        variant: "error",
        autoHideDuration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Load messages for selected chat
  useEffect(() => {
    if (selectedChat && currentUserId) {
      loadChatMessages(selectedChat);
      // Join the selected chat room via Socket.io
      socket.emit("join:chats", [selectedChat]);
    }
  }, [selectedChat, currentUserId]);

  const loadChatMessages = async (chatId: string) => {
    try {
      const response = await controller.getAll(
        `${endpoints.messages}/chat/${chatId}?userId=${currentUserId}`
      );

      if (response.success && response.data) {
        const messagesWithFlag = response.data.map((msg: Message) => ({
          ...msg,
          isMe: msg.sender._id === currentUserId,
        }));
        setMessages(messagesWithFlag);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      enqueueSnackbar("Failed to load messages", {
        variant: "error",
        autoHideDuration: 3000,
      });
    }
  };

  // Socket.io event listeners
  const setupSocketListeners = () => {
    // Listen for new messages
    socket.on("message:new", handleNewMessage);

    // Listen for typing indicators
    socket.on("message:typing", handleTyping);
    socket.on("message:stopTyping", handleStopTyping);

    // Listen for user status changes
    socket.on("user:online", handleUserOnline);
    socket.on("user:offline", handleUserOffline);

    // Handle socket errors
    socket.on("error", handleSocketError);
  };

  const cleanupSocketListeners = () => {
    socket.off("message:new", handleNewMessage);
    socket.off("message:typing", handleTyping);
    socket.off("message:stopTyping", handleStopTyping);
    socket.off("user:online", handleUserOnline);
    socket.off("user:offline", handleUserOffline);
    socket.off("error", handleSocketError);
  };

  // Socket event handlers
  const handleNewMessage = (newMessage: Message) => {
    const messageWithFlag = {
      ...newMessage,
      isMe: newMessage.sender._id === currentUserId,
    };

    setMessages((prev) => [...prev, messageWithFlag]);

    // Update last message in chat list
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat._id === newMessage.chat
          ? {
              ...chat,
              lastMessage: {
                content: newMessage.content,
                createdAt: newMessage.createdAt,
                sender: newMessage.sender._id,
              },
            }
          : chat
      )
    );
  };

  const handleTyping = (data: {
    userId: string;
    chatId: string;
    username: string;
  }) => {
    if (data.chatId === selectedChat && data.userId !== currentUserId) {
      setTyping((prev) => ({ ...prev, [data.userId]: true }));
    }
  };

  const handleStopTyping = (data: { userId: string; chatId: string }) => {
    if (data.chatId === selectedChat) {
      setTyping((prev) => ({ ...prev, [data.userId]: false }));
    }
  };

  const handleUserOnline = (data: { userId: string; username: string }) => {
    console.log(`${data.username} came online`);
    // Update user online status in chat list if needed
  };

  const handleUserOffline = (data: { userId: string; username: string }) => {
    console.log(`${data.username} went offline`);
    // Update user offline status in chat list if needed
  };

  const handleSocketError = (error: any) => {
    console.error("Socket error:", error);
    enqueueSnackbar("Connection error occurred", {
      variant: "error",
      autoHideDuration: 3000,
    });
  };

  // Send message via Socket.io and API
  const sendMessage = async () => {
    if (!message.trim() || !selectedChat || !currentUserId) return;

    const messageContent = message.trim();
    setMessage(""); // Clear input immediately for better UX

    try {
      // Create message data for API
      const messageData = {
        content: messageContent,
        chat: selectedChat,
        sender: currentUserId,
      };

      // Send to API first for persistence
      const response = await controller.post(
        `${endpoints.messages}?userId=${currentUserId}`,
        messageData
      );

      if (response.success && response.data) {
        // Send via Socket.io for real-time updates
        socket.emit("message:send", {
          chatId: selectedChat,
          content: messageContent,
          type: "text",
        });

        // Add message to local state immediately
        const newMessage: Message = {
          _id: response.data._id || Date.now().toString(),
          content: messageContent,
          sender: {
            _id: currentUserId,
            username: "You",
            profile: {
              firstName: "You",
              lastName: "",
            },
          },
          chat: selectedChat,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isMe: true,
        };

        setMessages((prev) => [...prev, newMessage]);

        // Update last message in chat list
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === selectedChat
              ? {
                  ...chat,
                  lastMessage: {
                    content: messageContent,
                    createdAt: newMessage.createdAt,
                    sender: currentUserId,
                  },
                }
              : chat
          )
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      enqueueSnackbar("Failed to send message", {
        variant: "error",
        autoHideDuration: 3000,
      });
      setMessage(messageContent); // Restore message if failed
    }
  };

  // Handle typing indicators for socket emission
  const emitTyping = () => {
    if (selectedChat) {
      socket.emit("message:typing", {
        chatId: selectedChat,
      });
    }
  };

  const emitStopTyping = () => {
    if (selectedChat) {
      socket.emit("message:stopTyping", {
        chatId: selectedChat,
      });
    }
  };

  // Handle input changes with typing indicators
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    // Throttled typing indicator
    if (e.target.value.trim()) {
      emitTyping();
      // Auto stop typing after 2 seconds of no typing
      setTimeout(() => {
        emitStopTyping();
      }, 2000);
    } else {
      emitStopTyping();
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  // Get chat display info
  const getSelectedChatInfo = () => {
    const chat = chats.find((c) => c._id === selectedChat);
    if (!chat) return null;

    if (chat.isGroup) {
      return {
        name: chat.name || "Group Chat",
        avatar: "GC",
        status: `${chat.members.length} members`,
        isOnline: false,
      };
    } else {
      // For direct chats, show the other person's info
      const otherMember = chat.members.find((m) => m._id !== currentUserId);
      if (otherMember) {
        return {
          name: `${otherMember.profile.firstName} ${otherMember.profile.lastName}`,
          avatar:
            otherMember.profile.avatar ||
            `${otherMember.profile.firstName[0]}${otherMember.profile.lastName[0]}`,
          status: "Online", // You can implement real online status later
          isOnline: true,
        };
      }
    }
    return null;
  };

  // Format time functions
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatChatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  // Check if someone is typing
  const isTyping = Object.values(typing).some(Boolean);
  const selectedChatInfo = getSelectedChatInfo();

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00B878] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Chat List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Messages</h2>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B878] focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {chats.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>No chats available</p>
              <p className="text-sm mt-2">Start a new conversation!</p>
            </div>
          ) : (
            chats.map((chat) => {
              const isSelected = selectedChat === chat._id;
              const chatName = chat.isGroup
                ? chat.name || "Group Chat"
                : chat.members
                    .filter((m) => m._id !== currentUserId)
                    .map((m) => `${m.profile.firstName} ${m.profile.lastName}`)
                    .join(", ") || "Unknown";

              const avatarText = chat.isGroup
                ? "GC"
                : chat.members.filter((m) => m._id !== currentUserId)[0]
                    ?.profile.firstName[0] +
                    chat.members.filter((m) => m._id !== currentUserId)[0]
                      ?.profile.lastName[0] || "U";

              return (
                <div
                  key={chat._id}
                  onClick={() => setSelectedChat(chat._id)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-150 hover:bg-[#E6FAF3] ${
                    isSelected
                      ? "bg-[#E6FAF3] border-l-4 border-l-[#00B878] shadow"
                      : ""
                  }`}
                  style={{ minHeight: 80 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold shadow"
                        style={{
                          backgroundColor: chat.isGroup ? "#a78bfa" : "#00B878",
                        }}
                      >
                        {avatarText}
                      </div>
                      {!chat.isGroup && (
                        <div
                          className="absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full"
                          style={{ backgroundColor: "#00B878" }}
                        ></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 truncate">
                          {chatName}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {chat.lastMessage
                            ? formatChatTime(chat.lastMessage.createdAt)
                            : formatChatTime(chat.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate">
                          {chat.lastMessage?.content || "No messages yet"}
                        </p>
                        {(chat.unreadCount || 0) > 0 && (
                          <span
                            className="ml-2 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center shadow"
                            style={{ backgroundColor: "#00B878" }}
                          >
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                      {chat.isGroup && (
                        <p className="text-xs text-gray-500">
                          {chat.members.length} members
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-[#F8FAFB] h-full">
        {selectedChat && selectedChatInfo ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow"
                      style={{
                        backgroundColor: selectedChatInfo.isOnline
                          ? "#00B878"
                          : "#a78bfa",
                      }}
                    >
                      {selectedChatInfo.avatar}
                    </div>
                    {selectedChatInfo.isOnline && (
                      <div
                        className="absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white rounded-full"
                        style={{ backgroundColor: "#00B878" }}
                      ></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {selectedChatInfo.name}
                    </h3>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#00B878" }}
                    >
                      {selectedChatInfo.status}
                      {isTyping && " • typing..."}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Phone size={20} />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Video size={20} />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <MoreHorizontal size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 min-h-0">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${
                      msg.isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-start gap-2 max-w-xs lg:max-w-md ${
                        msg.isMe ? "flex-row-reverse" : ""
                      }`}
                    >
                      {!msg.isMe && (
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow"
                          style={{ backgroundColor: "#00B878" }}
                        >
                          {msg.sender.profile.firstName[0]}
                          {msg.sender.profile.lastName[0]}
                        </div>
                      )}
                      <div
                        className="px-4 py-2 rounded-2xl shadow"
                        style={
                          msg.isMe
                            ? {
                                backgroundColor: "#00B878",
                                color: "#fff",
                                borderTopRightRadius: 8,
                                borderBottomRightRadius: 24,
                                borderTopLeftRadius: 24,
                                borderBottomLeftRadius: 8,
                              }
                            : {
                                backgroundColor: "#F3F4F6",
                                color: "#222",
                                borderTopLeftRadius: 8,
                                borderBottomLeftRadius: 24,
                                borderTopRightRadius: 24,
                                borderBottomRightRadius: 8,
                              }
                        }
                      >
                        <p>{msg.content}</p>
                        <p
                          className="text-xs mt-1"
                          style={
                            msg.isMe
                              ? { color: "#E6FAF3" }
                              : { color: "#6B7280" }
                          }
                        >
                          {formatTime(msg.createdAt)}
                        </p>
                      </div>
                      {msg.isMe && (
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow">
                          ME
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Paperclip size={20} />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={handleMessageChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B878] focus:border-transparent shadow-sm"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-600 hover:bg-gray-100 rounded">
                    <Smile size={16} />
                  </button>
                </div>
                <button
                  className="p-2 text-white rounded-lg transition-colors shadow"
                  style={{ backgroundColor: "#00B878" }}
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#00a76d")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#00B878")
                  }
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500">
                Choose a chat from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
