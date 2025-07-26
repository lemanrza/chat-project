import { useEffect, useState } from "react";
import {
  Search,
  Phone,
  Video,
  MoreHorizontal,
  Paperclip,
  Smile,
  Send,
  Plus,
  Users,
} from "lucide-react";
import socket from "@/socket/socket";
import controller from "@/services/commonRequest";
import endpoints from "@/services/api";
import { getUserIdFromToken } from "@/utils/auth";
import { enqueueSnackbar } from "notistack";
import type { ChatData, Connection, Message } from "@/types/chatType";

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState<string>("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<ChatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [typing, setTyping] = useState<{ [key: string]: boolean }>({});
  const [connections, setConnections] = useState<Connection[]>([]);
  const [showConnectionsModal, setShowConnectionsModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<Connection[]>([]);
  const [showBrowseUsersModal, setShowBrowseUsersModal] = useState(false);

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
        await Promise.all([
          loadUserChats(userId),
          loadUserConnections(userId),
          loadAvailableUsers(userId),
        ]);
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

  const loadUserChats = async (userId: string) => {
    try {
      setLoading(true);
      const response = await controller.getAll(
        `${endpoints.chats}?userId=${userId}`
      );

      if (response.success && response.data) {
        setChats(response.data);
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

  const loadUserConnections = async (userId: string) => {
    try {
      const response = await controller.getAll(
        `${endpoints.users}/me/${userId}`
      );

      if (response.success && response.data && response.data.connections) {
        console.log(response.data.connections);
        setConnections(response.data.connections);
      }
    } catch (error) {
      console.error("Error loading connections:", error);
    }
  };

  const loadAvailableUsers = async (userId: string) => {
    try {
      const response = await controller.getAll(
        `${endpoints.users}/me/${userId}/available`
      );

      if (response.success && response.data) {
        setAvailableUsers(response.data);
      }
    } catch (error) {
      console.error("Error loading available users:", error);
    }
  };

  const connectWithUser = async (connectionId: string) => {
    try {
      const response = await controller.post(
        `${endpoints.users}/me/${currentUserId}/connections`,
        { connectionId }
      );

      if (response.success) {
        enqueueSnackbar("Connected successfully!", {
          variant: "success",
          autoHideDuration: 3000,
        });

        // Refresh connections and available users
        await Promise.all([
          loadUserConnections(currentUserId),
          loadAvailableUsers(currentUserId),
        ]);
      }
    } catch (error) {
      console.error("Error connecting with user:", error);
      enqueueSnackbar("Failed to connect with user", {
        variant: "error",
        autoHideDuration: 3000,
      });
    }
  };
  const createDirectChatWithConnection = async (connectionId: string) => {
    try {
      const response = await controller.post(
        `${endpoints.chats}?userId=${currentUserId}`,
        {
          type: "direct",
          members: [connectionId],
        }
      );

      if (response.success && response.data) {
        // Refresh chat list to show the new chat
        await loadUserChats(currentUserId);
        // Select the new chat
        setSelectedChat(response.data._id);
        setShowConnectionsModal(false);
        enqueueSnackbar("Chat created successfully!", {
          variant: "success",
          autoHideDuration: 3000,
        });
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      enqueueSnackbar("Failed to create chat", {
        variant: "error",
        autoHideDuration: 3000,
      });
    }
  };

  useEffect(() => {
    if (selectedChat && currentUserId) {
      loadChatMessages(selectedChat);
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

  const setupSocketListeners = () => {
    socket.on("message:new", handleNewMessage);

    socket.on("message:typing", handleTyping);
    socket.on("message:stopTyping", handleStopTyping);

    socket.on("user:online", handleUserOnline);
    socket.on("user:offline", handleUserOffline);

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

  const handleNewMessage = (newMessage: Message) => {
    const messageWithFlag = {
      ...newMessage,
      isMe: newMessage.sender._id === currentUserId,
    };

    setMessages((prev) => [...prev, messageWithFlag]);

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
  };

  const handleUserOffline = (data: { userId: string; username: string }) => {
    console.log(`${data.username} went offline`);
  };

  const handleSocketError = (error: any) => {
    console.error("Socket error:", error);
    enqueueSnackbar("Connection error occurred", {
      variant: "error",
      autoHideDuration: 3000,
    });
  };

  const sendMessage = async () => {
    if (!message.trim() || !selectedChat || !currentUserId) return;

    const messageContent = message.trim();
    setMessage("");

    try {
      const messageData = {
        content: messageContent,
        chat: selectedChat,
        sender: currentUserId,
      };

      const response = await controller.post(
        `${endpoints.messages}?userId=${currentUserId}`,
        messageData
      );

      if (response.success && response.data) {
        socket.emit("message:send", {
          chatId: selectedChat,
          content: messageContent,
          type: "text",
        });

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

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    if (e.target.value.trim()) {
      emitTyping();
      setTimeout(() => {
        emitStopTyping();
      }, 2000);
    } else {
      emitStopTyping();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

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
      const otherMember = chat.members.find((m) => m._id !== currentUserId);
      if (otherMember) {
        return {
          name: `${otherMember.profile.firstName} ${otherMember.profile.lastName}`,
          avatar:
            otherMember.profile.avatar ||
            `${otherMember.profile.firstName[0]}${otherMember.profile.lastName[0]}`,
          status: "Online",
          isOnline: true,
        };
      }
    }
    return null;
  };

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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowBrowseUsersModal(true)}
                className="p-2 text-gray-600 border border-gray-300 rounded-lg transition-colors hover:bg-gray-50"
                title="Browse users to connect"
              >
                <Users size={20} />
              </button>
              <button
                onClick={() => setShowConnectionsModal(true)}
                className="p-2 text-white rounded-lg transition-colors shadow hover:bg-[#00a76d]"
                style={{ backgroundColor: "#00B878" }}
                title="Start new chat with connections"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
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
              <Send size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No chats available</p>
              <p className="text-sm mb-4">
                Start conversations with your connections!
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setShowConnectionsModal(true)}
                  className="px-4 py-2 text-white rounded-lg transition-colors shadow hover:bg-[#00a76d]"
                  style={{ backgroundColor: "#00B878" }}
                >
                  View Connections
                </button>
                <button
                  onClick={() => setShowBrowseUsersModal(true)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Browse Users to Connect
                </button>
              </div>
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

      {/* Connections Modal */}
      {showConnectionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Start New Chat
                </h3>
                <button
                  onClick={() => setShowConnectionsModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Choose from your connections to start a conversation
              </p>
            </div>

            <div className="overflow-y-auto max-h-96">
              {connections.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Users size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No connections yet</p>
                  <p className="text-sm">
                    Connect with other users to start chatting with them!
                  </p>
                </div>
              ) : (
                connections.map((connection) => {
                  // Check if chat already exists with this connection
                  const existingChat = chats.find(
                    (chat) =>
                      !chat.isGroup &&
                      chat.members.some(
                        (member) => member._id === connection._id
                      )
                  );

                  return (
                    <div
                      key={connection._id}
                      onClick={() => {
                        if (existingChat) {
                          setSelectedChat(existingChat._id);
                          setShowConnectionsModal(false);
                        } else {
                          createDirectChatWithConnection(connection._id);
                        }
                      }}
                      className="p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold shadow"
                          style={{ backgroundColor: "#00B878" }}
                        >
                          {connection.profile.firstName[0]}
                          {connection.profile.lastName[0]}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {connection.profile.firstName}{" "}
                            {connection.profile.lastName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            @{connection.username}
                          </p>
                          {existingChat ? (
                            <p className="text-xs text-green-600 mt-1">
                              Chat exists - click to open
                            </p>
                          ) : (
                            <p className="text-xs text-blue-600 mt-1">
                              Click to start chat
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowConnectionsModal(false)}
                className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Browse Users Modal */}
      {showBrowseUsersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Browse Users
                </h3>
                <button
                  onClick={() => setShowBrowseUsersModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Connect with other users in the platform
              </p>
            </div>

            <div className="overflow-y-auto max-h-96">
              {availableUsers.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Users size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No users available</p>
                  <p className="text-sm">
                    You're already connected to all users or there are no other
                    users yet!
                  </p>
                </div>
              ) : (
                availableUsers.map((user) => (
                  <div key={user._id} className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold shadow"
                        style={{ backgroundColor: "#00B878" }}
                      >
                        {user.profile.firstName[0]}
                        {user.profile.lastName[0]}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {user.profile.firstName} {user.profile.lastName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          @{user.username}
                        </p>
                      </div>
                      <button
                        onClick={() => connectWithUser(user._id)}
                        className="px-3 py-1 text-sm text-white rounded-lg transition-colors shadow hover:bg-[#00a76d]"
                        style={{ backgroundColor: "#00B878" }}
                      >
                        Connect
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowBrowseUsersModal(false)}
                className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
