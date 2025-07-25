<<<<<<< HEAD
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
=======
import { useEffect, useState, useRef } from "react";
import { Send, MessageSquare } from "lucide-react";
>>>>>>> 50fd8beca30dec3d2907d24344bf8e3dab4d58ec
import socket from "@/socket/socket";
import { getUserIdFromToken } from "@/utils/auth";

interface Message {
  _id: string;
  text: string;
  sender: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  createdAt: string;
}

interface ChatType {
  _id: string;
  members: {
    user: {
      _id: string;
      username: string;
      email: string;
      profile: {
        firstName: string;
        lastName: string;
        avatar?: string;
      };
    };
    role: string;
    joinedAt: string;
    isActive: boolean;
  }[];
  type: "direct" | "group" | "channel";
  name?: string;
  description?: string;
  avatar?: string;
  lastMessage?: Message;
  createdAt: string;
  updatedAt: string;
}

interface Connection {
  _id: string;
  name: string;
  profilePicture?: string;
}

const Chat = () => {
<<<<<<< HEAD
  const { t } = useTranslation();
  const [selectedChat, setSelectedChat] = useState<string>("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
=======
>>>>>>> 50fd8beca30dec3d2907d24344bf8e3dab4d58ec
  const [chats, setChats] = useState<ChatType[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const userId = getUserIdFromToken();
    if (userId) {
      setCurrentUserId(userId);
      fetchUserData(userId);
    }
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
<<<<<<< HEAD
      const userId = getUserIdFromToken();
      if (userId) {
        setCurrentUserId(userId);
        await Promise.all([loadUserChats(userId), loadUserConnections(userId)]);
      } else {
        enqueueSnackbar(t('chat_login_to_view'), {
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
      enqueueSnackbar(t('chat_failed_to_load'), {
        variant: "error",
        autoHideDuration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserConnections = async (userId: string) => {
    try {
      // Get current user data with populated connections using the /me/:id endpoint
      const response = await controller.getAll(
        `${endpoints.users}/me/${userId}`
      );

      if (response.success && response.data && response.data.connections) {
        setConnections(response.data.connections);
      }
    } catch (error) {
      console.error("Error loading connections:", error);
    }
  };
  const createDirectChatWithConnection = async (connectionId: string) => {
    try {
      const response = await controller.post(
        `${endpoints.chats}?userId=${currentUserId}`,
=======
      const userResponse = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/me/${userId}`,
>>>>>>> 50fd8beca30dec3d2907d24344bf8e3dab4d58ec
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

<<<<<<< HEAD
      if (response.success && response.data) {
        // Refresh chat list to show the new chat
        await loadUserChats(currentUserId);
        // Select the new chat
        setSelectedChat(response.data._id);
        setShowConnectionsModal(false);
        enqueueSnackbar(t('chat_created_success'), {
          variant: "success",
          autoHideDuration: 3000,
        });
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      enqueueSnackbar(t('chat_failed_to_create'), {
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
      enqueueSnackbar(t('chat_failed_to_load_messages'), {
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
    enqueueSnackbar(t('chat_connection_error'), {
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
=======
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setConnections(userData.data.connections || []);
      } else {
        console.error(
          `Failed to fetch user data: ${userResponse.status} ${userResponse.statusText}`
        );
      }

      const chatsResponse = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/chats?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
>>>>>>> 50fd8beca30dec3d2907d24344bf8e3dab4d58ec
          },
        }
      );

      if (chatsResponse.ok) {
        const chatsData = await chatsResponse.json();
        setChats(chatsData.data || chatsData);
      } else {
        console.error(
          `Failed to fetch chats: ${chatsResponse.status} ${chatsResponse.statusText}`
        );
      }
    } catch (error) {
<<<<<<< HEAD
      console.error("Error sending message:", error);
      enqueueSnackbar(t('chat_failed_to_send'), {
        variant: "error",
        autoHideDuration: 3000,
      });
      setMessage(messageContent); // Restore message if failed
=======
      console.error("Error fetching user data:", error);
>>>>>>> 50fd8beca30dec3d2907d24344bf8e3dab4d58ec
    }
  };

  // Socket.IO event listeners
  useEffect(() => {
    if (!currentUserId) return;

    socket.emit("join", currentUserId);

    const handleNewMessage = (message: Message) => {
      setMessages((prev) => [...prev, message]);

      setChats((prev) =>
        prev.map((chat) =>
          chat._id === selectedChat?._id
            ? { ...chat, lastMessage: message }
            : chat
        )
      );
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [currentUserId, selectedChat?._id]);

  const fetchMessages = async (chatId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/message/chat/${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !currentUserId) return;

    const messageData = {
      text: newMessage,
      chatId: selectedChat._id,
      senderId: currentUserId,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(messageData),
        }
      );

      if (response.ok) {
        const message = await response.json();
        socket.emit("sendMessage", message);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleChatSelect = (chat: ChatType) => {
    setSelectedChat(chat);
    fetchMessages(chat._id);
  };

  const createChatWithConnection = async (connection: Connection) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/chats`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            type: "direct",
            members: [connection._id],
          }),
        }
      );

      console.log("Response status:", response.status);

      if (response.ok) {
        const newChat = await response.json();
        console.log("New chat created:", newChat);
        setChats((prev) => [...prev, newChat.data || newChat]);
        handleChatSelect(newChat.data || newChat);
      } else {
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        console.error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Network error creating chat:", error);
    }
  };

  const getOtherParticipant = (chat: any) => {
    return chat.members.find((member: any) => member.user._id !== currentUserId)
      ?.user;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (!currentUserId) {
    return (
<<<<<<< HEAD
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00B878] mx-auto mb-4"></div>
          <p className="text-gray-600">{t('chat_loading')}</p>
        </div>
=======
      <div className="flex items-center justify-center h-full">
        Please log in to access chat.
>>>>>>> 50fd8beca30dec3d2907d24344bf8e3dab4d58ec
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
<<<<<<< HEAD
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{t('chat_messages')}</h2>
            <button
              onClick={() => setShowConnectionsModal(true)}
              className="p-2 text-white rounded-lg transition-colors shadow hover:bg-[#00a76d]"
              style={{ backgroundColor: "#00B878" }}
              title="Start new chat with connections"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder={t('chat_search_conversations')}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B878] focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {chats.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <Send size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">{t('chat_no_chats')}</p>
              <p className="text-sm mb-4">{t('chat_start_conversation')}</p>
              <button
                onClick={() => setShowConnectionsModal(true)}
                className="px-4 py-2 text-white rounded-lg transition-colors shadow hover:bg-[#00a76d]"
                style={{ backgroundColor: "#00B878" }}
              >
                {t('chat_view_connections')}
              </button>
            </div>
          ) : (
            chats.map((chat) => {
              const isSelected = selectedChat === chat._id;
              const chatName = chat.isGroup
                ? chat.name || "Group Chat"
                : chat.members
                    .filter((m) => m._id !== currentUserId)
                    .map((m) => `${m.profile.firstName} ${m.profile.lastName}`)
                    .join(", ") || t('chat_unknown');

              const avatarText = chat.isGroup
                ? "GC"
                : chat.members.filter((m) => m._id !== currentUserId)[0]
                    ?.profile.firstName[0] +
                    chat.members.filter((m) => m._id !== currentUserId)[0]
                      ?.profile.lastName[0] || "U";

=======
          <h2 className="text-xl font-semibold text-gray-800">Chats</h2>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {/* Existing Chats */}
            {chats.map((chat) => {
              const otherParticipant = getOtherParticipant(chat);
>>>>>>> 50fd8beca30dec3d2907d24344bf8e3dab4d58ec
              return (
                <div
                  key={chat._id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                    selectedChat?._id === chat._id
                      ? "bg-blue-100 border-l-4 border-blue-500"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleChatSelect(chat)}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                      {otherParticipant?.profilePicture ? (
                        <img
                          src={otherParticipant.profilePicture}
                          alt={otherParticipant.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-600 font-medium">
                          {otherParticipant?.name?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
<<<<<<< HEAD
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
                          {chat.lastMessage?.content || t('chat_no_messages_yet')}
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
                          {t('chat_members_count', { count: chat.members.length })}
=======
                      <h3 className="font-medium text-gray-900 truncate">
                        {otherParticipant?.name}
                      </h3>
                      {chat.lastMessage && (
                        <p className="text-sm text-gray-500 truncate">
                          {chat.lastMessage.text}
>>>>>>> 50fd8beca30dec3d2907d24344bf8e3dab4d58ec
                        </p>
                      )}
                    </div>
                    {chat.lastMessage && (
                      <span className="text-xs text-gray-400">
                        {formatTime(chat.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Available Connections */}
            {connections.map((connection) => {
              const hasExistingChat = chats.some((chat) =>
                chat.members.some(
                  (member) => member.user._id === connection._id
                )
              );

              if (hasExistingChat) return null;

              return (
                <div
                  key={`connection-${connection._id}`}
                  className="p-3 rounded-lg cursor-pointer transition-colors mb-2 hover:bg-gray-100 border-l-4 border-green-400"
                  onClick={() => createChatWithConnection(connection)}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                      {connection.profilePicture ? (
                        <img
                          src={connection.profilePicture}
                          alt={connection.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-600 font-medium">
                          {connection.name?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {connection.name}
                      </h3>
                      <p className="text-sm text-green-600">
                        Click to start chat
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Empty State */}
            {chats.length === 0 && connections.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No connections yet</p>
                <p className="text-sm">
                  Add some connections to start chatting
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
<<<<<<< HEAD
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
                      {isTyping && ` • ${t('chat_typing')}`}
                    </p>
                  </div>
=======
            {console.log("Selected chat:", getOtherParticipant(selectedChat))}
            <div className="p-4 bg-white border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                  {getOtherParticipant(selectedChat)?.profile.avatar ? (
                    <img
                      src={getOtherParticipant(selectedChat)?.profile.avatar}
                      alt={
                        getOtherParticipant(selectedChat)?.profile.displayName
                      }
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 font-medium">
                      {getOtherParticipant(selectedChat)
                        ?.name?.charAt(0)
                        .toUpperCase()}
                    </span>
                  )}
>>>>>>> 50fd8beca30dec3d2907d24344bf8e3dab4d58ec
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {getOtherParticipant(selectedChat)?.name}
                  </h3>
                  <p className="text-sm text-gray-500">Active now</p>
                </div>
              </div>
            </div>

            {/* Messages */}
<<<<<<< HEAD
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 min-h-0">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">
                    {t('chat_no_messages_yet_start')}
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
=======
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message) => {
                  const isOwn = message.sender._id === currentUserId;
                  return (
>>>>>>> 50fd8beca30dec3d2907d24344bf8e3dab4d58ec
                    <div
                      key={message._id}
                      className={`flex ${
                        isOwn ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isOwn
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-900"
                        }`}
                      >
                        <p>{message.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isOwn ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          {formatTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
<<<<<<< HEAD
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
                    placeholder={t('chat_type_message')}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B878] focus:border-transparent shadow-sm"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-600 hover:bg-gray-100 rounded">
                    <Smile size={16} />
                  </button>
                </div>
=======
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
>>>>>>> 50fd8beca30dec3d2907d24344bf8e3dab4d58ec
                <button
                  onClick={sendMessage}
<<<<<<< HEAD
                  disabled={!message.trim()}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#00a76d")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#00B878")
                  }
                  title={t('chat_send_message')}
=======
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
>>>>>>> 50fd8beca30dec3d2907d24344bf8e3dab4d58ec
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
<<<<<<< HEAD
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('chat_select_conversation')}
              </h3>
              <p className="text-gray-500">
                {t('chat_choose_sidebar')}
=======
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Welcome to Chat
              </h3>
              <p className="text-gray-500">
                Select a chat or connection to start messaging
>>>>>>> 50fd8beca30dec3d2907d24344bf8e3dab4d58ec
              </p>
            </div>
          </div>
        )}
      </div>
<<<<<<< HEAD

      {/* Connections Modal */}
      {showConnectionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t('chat_start_new_chat')}
                </h3>
                <button
                  onClick={() => setShowConnectionsModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {t('chat_choose_connection')}
              </p>
            </div>

            <div className="overflow-y-auto max-h-96">
              {connections.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Users size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">{t('chat_no_connections')}</p>
                  <p className="text-sm">{t('chat_connect_with_users')}</p>
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
                              {t('chat_exists_click_open')}
                            </p>
                          ) : (
                            <p className="text-xs text-blue-600 mt-1">
                              {t('chat_click_start')}
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
                {t('chat_cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
=======
>>>>>>> 50fd8beca30dec3d2907d24344bf8e3dab4d58ec
    </div>
  );
};

export default Chat;
