import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Send, MessageSquare } from "lucide-react";
import socket, { reconnectSocket } from "@/socket/socket";
import { getUserIdFromToken } from "@/utils/auth";
import type { UserData } from "@/types/profileType";
import GifPicker from "@/components/GifPicker";
import { Image } from "lucide-react";
import { t } from "i18next";

interface Message {
  _id: string;
  attachments: string[];
  chat: string;
  deleted: boolean;
  edited: boolean;
  reactions: [];
  seenBy: {
    _id: string;
    seenAt: Date;
    user: UserData;
  }[];
  content: string;
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
  firstName: string;
  profilePicture?: string;
}

const Chat = () => {
  const [chats, setChats] = useState<ChatType[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showGifPicker, setShowGifPicker] = useState(false);

  const location = useLocation();
  const navigationState = location.state as {
    targetUserId?: string;
    targetUserName?: string;
  } | null;

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

  useEffect(() => {
    const handleTargetUserChat = async () => {
      if (
        !navigationState?.targetUserId ||
        !currentUserId ||
        chats.length === 0
      ) {
        return;
      }

      const targetUserId = navigationState.targetUserId;

      const existingChat = chats.find((chat) => {
        return chat.members?.some(
          (member: any) => member.user && member.user._id === targetUserId
        );
      });

      if (existingChat) {
        setSelectedChat(existingChat);
        fetchMessages(existingChat._id, currentUserId);
      } else {
        const targetConnection = connections.find(
          (conn: any) => conn._id === targetUserId || conn.id === targetUserId
        );

        if (targetConnection) {
          await createChatWithConnection(targetConnection);
        }
      }

      window.history.replaceState({}, document.title);
    };

    if (currentUserId && chats.length > 0) {
      handleTargetUserChat();
    }
  }, [navigationState, currentUserId, chats, connections]);

  const fetchMessages = async (chatId: string, userId?: string) => {
    const userIdToUse = userId || currentUserId;
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/messages/chat/${chatId}?userId=${userIdToUse}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const messagesArray = data.data?.messages || [];
        setMessages(messagesArray);
      } else {
        setMessages([]);
      }
    } catch (error) {
      setMessages([]);
    }
  };

  const fetchChatData = async (chatId: string) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/api/chats/${chatId}?userId=${currentUserId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const chatData = await response.json();
        const chat = chatData.data || chatData;

        setChats((prev) => {
          const existingIndex = prev.findIndex(
            (existingChat) => existingChat._id === chat._id
          );
          if (existingIndex !== -1) {
            // Update existing chat
            const updatedChats = [...prev];
            updatedChats[existingIndex] = chat;
            return updatedChats;
          } else {
            // Add new chat to the end, not beginning to avoid auto-selection
            return [...prev, chat];
          }
        });

        setSelectedChat((prevSelected: any) => {
          if (prevSelected && prevSelected._id === chat._id) {
            return chat;
          }
          return prevSelected;
        });

        return chat;
      } else {
        const errorText = await response.text();
        console.error(
          "❌ Failed to fetch chat data. Status:",
          response.status,
          "Error:",
          errorText
        );

        console.warn(
          "⚠️ Failed to fetch individual chat, refreshing all chats"
        );
        if (currentUserId) {
          refreshChatsData(currentUserId);
        }
        return null;
      }
    } catch (error) {
      console.error("❌ Error fetching chat data:", error);
      if (currentUserId) {
        refreshChatsData(currentUserId);
      }
      return null;
    }
  };

  const fetchUserData = async (userId: string) => {
    setIsLoading(true);
    try {
      const userResponse = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/me/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (userResponse.ok) {
        const userData = await userResponse.json();
        const connections = userData.data.connections || [];

        // Simple deduplication using Map
        const connectionMap = new Map();
        connections.forEach((conn: any) => {
          if (conn && conn._id) {
            connectionMap.set(conn._id, conn);
          }
        });

        setConnections(Array.from(connectionMap.values()));
      } else {
        setConnections([]);
      }

      const chatsResponse = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/chats?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (chatsResponse.ok) {
        const chatsData = await chatsResponse.json();
        const chatsArray = chatsData.data || chatsData;

        // Simple deduplication using Map
        const chatMap = new Map();
        chatsArray.forEach((chat: any) => {
          if (chat && chat._id) {
            chatMap.set(chat._id, chat);
          }
        });
        const uniqueChats = Array.from(chatMap.values());

        setChats(uniqueChats);

        if (selectedChat) {
          const chatStillExists = uniqueChats.some(
            (chat: ChatType) => chat._id === selectedChat._id
          );
          if (!chatStillExists) {
            setSelectedChat(null);
            setMessages([]);
          }
        }

        // Only auto-select first chat on initial load, not on periodic updates
        if (
          uniqueChats.length > 0 &&
          !selectedChat &&
          !navigationState?.targetUserId
        ) {
          const firstChat = uniqueChats[0];
          setSelectedChat(firstChat);
          fetchMessages(firstChat._id, userId);
        }
      } else {
        setChats([]);
      }
    } catch (error) {
      setConnections([]);
      setChats([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Separate function for periodic updates that doesn't interfere with chat selection
  const refreshChatsData = async (userId: string) => {
    try {
      const userResponse = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/me/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (userResponse.ok) {
        const userData = await userResponse.json();
        const connections = userData.data.connections || [];

        // Simple deduplication using Map
        const connectionMap = new Map();
        connections.forEach((conn: any) => {
          if (conn && conn._id) {
            connectionMap.set(conn._id, conn);
          }
        });

        setConnections(Array.from(connectionMap.values()));
      }

      const chatsResponse = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/chats?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (chatsResponse.ok) {
        const chatsData = await chatsResponse.json();
        const chatsArray = chatsData.data || chatsData;

        // Simple deduplication using Map
        const chatMap = new Map();
        chatsArray.forEach((chat: any) => {
          if (chat && chat._id) {
            chatMap.set(chat._id, chat);
          }
        });
        const uniqueChats = Array.from(chatMap.values());

        setChats(uniqueChats);

        // Don't change selected chat during periodic updates
        if (selectedChat) {
          const chatStillExists = uniqueChats.some(
            (chat: ChatType) => chat._id === selectedChat._id
          );
          if (!chatStillExists) {
            setSelectedChat(null);
            setMessages([]);
          }
        }
      }
    } catch (error) {
      console.error("Error refreshing chats data:", error);
    }
  };

  useEffect(() => {
    if (!currentUserId) return;

    if (!socket.connected) {
      reconnectSocket();
    }

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
    });

    socket.emit("auth:join");

    const handleNewMessage = (messageData: any) => {
      const message: Message = {
        _id: messageData.id || messageData._id,
        content: messageData.content,
        chat: messageData.chatId,
        sender: {
          _id: messageData.senderId,
          name: messageData.senderName || "User",
          profilePicture: "",
        },
        createdAt:
          messageData.timestamp ||
          messageData.createdAt ||
          new Date().toISOString(),
        attachments: [],
        deleted: false,
        edited: false,
        reactions: [],
        seenBy: [],
      };

      if (selectedChat && message.chat === selectedChat._id) {
        setMessages((prev) => {
          const exists = prev.some((msg) => msg._id === message._id);
          if (exists) return prev;
          return [...prev, message];
        });
      }

      setChats((prev) => {
        const existingChatIndex = prev.findIndex(
          (chat) => chat._id === message.chat
        );

        if (existingChatIndex !== -1) {
          const updatedChats = [...prev];
          updatedChats[existingChatIndex] = {
            ...updatedChats[existingChatIndex],
            lastMessage: message,
          };
          return updatedChats;
        } else {
          if (currentUserId) {
            fetchChatData(message.chat);
          }
          return prev;
        }
      });
    };

    const handleChatDeleted = (data: { chatId: string }) => {
      setChats((prev) => prev.filter((chat) => chat._id !== data.chatId));

      if (selectedChat && selectedChat._id === data.chatId) {
        setSelectedChat(null);
        setMessages([]);
      }
    };

    socket.on("message:new", handleNewMessage);
    socket.on("chat:deleted", handleChatDeleted);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("chat:deleted", handleChatDeleted);
      socket.off("test:broadcast");
      socket.off("connect");
      socket.off("connect_error");
    };
  }, [currentUserId, selectedChat?._id]);

  useEffect(() => {
    if (chats.length > 0 && currentUserId) {
      const chatIds = chats.map((chat) => chat._id);
      socket.emit("join:chats", chatIds);
    }
  }, [chats, currentUserId]);

  useEffect(() => {
    if (selectedChat && currentUserId) {
      fetchMessages(selectedChat._id);
    }
  }, [selectedChat, currentUserId]);

  useEffect(() => {
    if (!currentUserId) return;

    // Disable periodic refresh to prevent auto-switching
    // Users can manually refresh by navigating away and back
    // const interval = setInterval(() => {
    //   refreshChatsData(currentUserId);
    // }, 30000);

    // return () => clearInterval(interval);
  }, [currentUserId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        {t("loading")}
      </div>
    );
  }

  if (!currentUserId) {
    return (
      <div className="flex items-center justify-center h-full">
        Please log in to access chat.
      </div>
    );
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !currentUserId) return;

    const messageContent = newMessage;
    setNewMessage("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            content: messageContent,
            chatId: selectedChat._id,
          }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        const newMessageObj = responseData.data || responseData;

        // Don't update messages immediately - let socket handle it to avoid duplicates
        // The server will broadcast the message back via socket

        // Update the chat list with the new last message
        setChats((prev) =>
          prev.map((chat) =>
            chat._id === selectedChat._id
              ? { ...chat, lastMessage: newMessageObj }
              : chat
          )
        );
      } else {
        console.error("❌ Failed to send message:", response.status);
        setNewMessage(messageContent);
      }
    } catch (error) {
      console.error("❌ Error sending message:", error);
      setNewMessage(messageContent);
    }
  };

  const handleChatSelect = (chat: ChatType) => {
    const otherParticipant = getOtherParticipant(chat);
    if (
      !otherParticipant ||
      !otherParticipant.profile ||
      (!otherParticipant.profile.displayName &&
        !otherParticipant.profile.firstName)
    ) {
      return;
    }
    setSelectedChat(chat);
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

      if (response.ok) {
        const newChat = await response.json();
        const chatData = newChat.data || newChat;

        const completeChat = await fetchChatData(chatData._id);

        if (completeChat) {
          setSelectedChat(completeChat);
          fetchMessages(completeChat._id, currentUserId);
        } else {
          setSelectedChat(chatData);
          fetchMessages(chatData._id, currentUserId);
        }
      }
    } catch (error) {
      console.error("Failed to create chat:", error);
    }
  };

  const getOtherParticipant = (chat: any) => {
    if (!chat || !chat.members || !Array.isArray(chat.members)) {
      return null;
    }

    const otherMember = chat.members.find(
      (member: any) =>
        member && member.user && member.user._id !== currentUserId
    );

    if (!otherMember || !otherMember.user) {
      return null;
    }

    const user = otherMember.user;

    const userWithDisplayName = {
      ...user,
      profile: {
        ...user.profile,
        displayName:
          user.profile?.displayName ||
          (user.profile?.firstName || user.profile?.lastName
            ? `${user.profile.firstName || ""} ${
                user.profile.lastName || ""
              }`.trim()
            : user.username || "Unknown User"),
      },
      isOnline: user.isOnline,
      lastSeen: user.lastSeen,
    };

    return userWithDisplayName;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const sendGifMessage = async (gifUrl: string) => {
    if (!gifUrl || !selectedChat || !currentUserId) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            content: gifUrl,
            chatId: selectedChat._id,
            isGif: true,
          }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        const newMessageObj = responseData.data || responseData;

        // Don't update messages immediately - let socket handle it to avoid duplicates
        // The server will broadcast the message back via socket

        // Update the chat list with the new last message
        setChats((prev) =>
          prev.map((chat) =>
            chat._id === selectedChat._id
              ? { ...chat, lastMessage: newMessageObj }
              : chat
          )
        );

        setShowGifPicker(false);
      } else {
        console.error("❌ Failed to send GIF:", response.status);
      }
    } catch (err) {
      console.error("❌ Error sending GIF:", err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-800">
      {/* Sidebar */}
      <div className="w-1/3 bg-white dark:bg-[#262626] border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Chats
          </h2>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {/* Existing Chats */}
            {chats
              .filter((chat: any) => {
                if (!chat || !chat._id) return false;
                const otherParticipant = getOtherParticipant(chat);
                return (
                  otherParticipant &&
                  otherParticipant.profile &&
                  (otherParticipant.profile.displayName ||
                    otherParticipant.profile.firstName)
                );
              })
              .map((chat: any) => {
                const otherParticipant = getOtherParticipant(chat);

                return (
                  <div
                    key={`chat-${chat._id}`}
                    className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                      selectedChat?._id === chat._id
                        ? "bg-blue-100 dark:bg-blue-600 border-l-4 border-blue-500"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => handleChatSelect(chat)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        {otherParticipant?.profile?.avatar ? (
                          <img
                            src={otherParticipant.profile.avatar}
                            alt={otherParticipant.profile.displayName || "User"}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-600 dark:text-gray-300 font-medium">
                            {otherParticipant?.profile?.displayName
                              ?.charAt(0)
                              .toUpperCase() || "U"}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">
                          {otherParticipant?.profile?.displayName ||
                            "Unknown User"}
                        </h3>
                        {chat.lastMessage && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {chat.lastMessage.content}
                          </p>
                        )}
                      </div>
                      {chat.lastMessage && chat.lastMessage.createdAt && (
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {formatTime(chat.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

            {/* Available Connections */}
            {connections
              .filter((connection: any) => connection && connection._id)
              .map((connection: any) => {
                if (!connection || !connection._id) return null;

                const hasExistingChat = chats.some(
                  (chat) =>
                    chat.members &&
                    chat.members.some(
                      (member) =>
                        member &&
                        member.user &&
                        member.user._id === connection._id
                    )
                );

                if (hasExistingChat) return null;

                return (
                  <div
                    key={`connection-${connection._id}`}
                    className="p-3 rounded-lg cursor-pointer transition-colors mb-2 hover:bg-gray-100 dark:hover:bg-gray-700 border-l-4 border-green-400"
                    onClick={() => createChatWithConnection(connection)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        {connection?.profile?.avatar ? (
                          <img
                            src={connection.profile.avatar}
                            alt={connection.name || "User"}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-600 dark:text-gray-300 font-medium">
                            {connection.profile?.displayName
                              ?.charAt(0)
                              .toUpperCase() ||
                              connection.firstName?.charAt(0).toUpperCase() ||
                              "U"}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">
                          {connection.profile?.displayName ||
                            `${connection.firstName || ""} ${
                              connection.lastName || ""
                            }`.trim() ||
                            "Unknown User"}
                        </h3>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          {t("click_to_start")}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

            {/* Empty State */}
            {chats.length === 0 && connections.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No connections yet</p>
                <p className="text-sm">
                  {t("add_connections_to_start_chatting")}
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
            <div className="p-4 bg-white dark:bg-[#262626] border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  {getOtherParticipant(selectedChat)?.profile?.avatar ? (
                    <img
                      src={getOtherParticipant(selectedChat)?.profile.avatar}
                      alt={
                        getOtherParticipant(selectedChat)?.profile
                          ?.displayName || "User"
                      }
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 dark:text-gray-300 font-medium">
                      {getOtherParticipant(selectedChat)
                        ?.profile?.displayName?.charAt(0)
                        .toUpperCase() || "U"}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {getOtherParticipant(selectedChat)?.profile?.displayName ||
                      "Unknown User"}
                  </h3>

                  {getOtherParticipant(selectedChat)?.isOnline === true ? (
                    <p className="text-sm text-green-500 dark:text-green-400">
                      {t("online")}
                    </p>
                  ) : (
                    <p className="text-sm text-red-500 dark:text-red-400">
                      {t("offline")}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-[#262626]">
              <div className="space-y-4">
                {messages &&
                  messages.map((message) => {
                    if (!message || !message.sender || !message.sender._id) {
                      return null;
                    }

                    const isOwn = message.sender._id === currentUserId;
                    return (
                      <div
                        key={message._id}
                        className={`flex message-container ${
                          isOwn ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md rounded-2xl overflow-hidden ${
                            message.content &&
                            (message.content.includes("giphy.com") ||
                              message.content.includes(".gif") ||
                              message.content.startsWith("https://media"))
                              ? "bg-transparent p-1"
                              : isOwn
                              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2"
                          }`}
                        >
                          {/* Check if message content is a GIF URL */}
                          {message.content &&
                          (message.content.includes("giphy.com") ||
                            message.content.includes(".gif") ||
                            message.content.startsWith("https://media")) ? (
                            <div className="gif-message">
                              <img
                                src={message.content}
                                alt="GIF"
                                className="w-full h-auto rounded-xl shadow-sm hover:shadow-md transition-shadow"
                                style={{
                                  maxHeight: "250px",
                                  minWidth: "200px",
                                }}
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  const fallback =
                                    target.nextElementSibling as HTMLElement;
                                  target.style.display = "none";
                                  if (fallback) {
                                    fallback.style.display = "block";
                                    fallback.className = `px-4 py-2 rounded-2xl ${
                                      isOwn
                                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                                    }`;
                                  }
                                }}
                              />
                              <p
                                style={{ display: "none" }}
                                className="text-sm"
                              >
                                Failed to load GIF: {message.content}
                              </p>
                            </div>
                          ) : (
                            <p className="break-words">
                              {message.content || "No content"}
                            </p>
                          )}

                          <p
                            className={`text-xs mt-1 ${
                              message.content &&
                              (message.content.includes("giphy.com") ||
                                message.content.includes(".gif") ||
                                message.content.startsWith("https://media"))
                                ? isOwn
                                  ? "text-gray-600 bg-white/80 px-2 py-1 rounded-full inline-block ml-auto"
                                  : "text-white bg-gray-800/80 px-2 py-1 rounded-full inline-block"
                                : isOwn
                                ? "text-blue-100"
                                : "text-gray-500"
                            }`}
                          >
                            {message.createdAt
                              ? formatTime(message.createdAt)
                              : ""}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white dark:bg-[#262626] border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-3 items-center">
                <button
                  onClick={() => setShowGifPicker(true)}
                  className={`p-2.5 rounded-full transition-all duration-200 ${
                    showGifPicker
                      ? "bg-blue-500 text-white shadow-lg"
                      : "hover:bg-gray-100 text-gray-600 hover:text-blue-500"
                  }`}
                  title="Send GIF"
                >
                  <Image className="w-5 h-5" />
                </button>

                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 disabled:hover:from-blue-500 disabled:hover:to-blue-600"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>

              {showGifPicker && (
                <GifPicker
                  onSelect={(gifUrl) => sendGifMessage(gifUrl)}
                  onClose={() => setShowGifPicker(false)}
                />
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-[#262626]">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                {t("welcome_to_chat")}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {t("start_messaging")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
