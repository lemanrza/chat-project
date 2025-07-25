import { useEffect, useState, useRef } from "react";
import { Send, MessageSquare } from "lucide-react";
import socket from "@/socket/socket";
import { getUserIdFromToken } from "@/utils/auth";
import type { UserData } from "@/types/profileType";

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
  const [isLoading, setIsLoading] = useState(true); // Add loading state
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
        const messagesArray = data.data || data.messages || data || [];
        setMessages(Array.isArray(messagesArray) ? messagesArray : []);
      } else {
        setMessages([]);
      }
    } catch (error) {
      setMessages([]);
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
        setConnections(userData.data.connections || []);
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
        setChats(chatsArray);

        // Auto-select the first chat and load its messages
        if (chatsArray.length > 0 && !selectedChat) {
          const firstChat = chatsArray[0];
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

  useEffect(() => {
    if (!currentUserId) return;

    if (!socket.connected) {
      socket.connect();
    }

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

      setChats((prev) =>
        prev.map((chat) =>
          chat._id === message.chat ? { ...chat, lastMessage: message } : chat
        )
      );
    };

    socket.on("message:new", handleNewMessage);

    return () => {
      socket.off("message:new", handleNewMessage);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading chats...
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

        socket.emit("message:send", {
          content: messageContent,
          chatId: selectedChat._id,
        });

        setChats((prev) =>
          prev.map((chat) =>
            chat._id === selectedChat._id
              ? { ...chat, lastMessage: newMessageObj }
              : chat
          )
        );
      } else {
        setNewMessage(messageContent);
      }
    } catch (error) {
      setNewMessage(messageContent);
    }
  };

  const handleChatSelect = (chat: ChatType) => {
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
        setChats((prev) => [...prev, chatData]);
        handleChatSelect(chatData);
      }
    } catch (error) {}
  };

  const getOtherParticipant = (chat: any) => {
    if (!chat || !chat.members || !Array.isArray(chat.members)) {
      return null;
    }
    return chat.members.find(
      (member: any) =>
        member && member.user && member.user._id !== currentUserId
    )?.user;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Chats</h2>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {/* Existing Chats */}
            {chats.map((chat: any) => {
              const otherParticipant = getOtherParticipant(chat);
              if (!otherParticipant) return null; // Skip if no valid participant found

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
                      {otherParticipant?.profile?.avatar ? (
                        <img
                          src={otherParticipant.profile.avatar}
                          alt={otherParticipant.profile.displayName || "User"}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-600 font-medium">
                          {otherParticipant?.profile?.displayName
                            ?.charAt(0)
                            .toUpperCase() || "U"}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {otherParticipant?.profile?.displayName ||
                          "Unknown User"}
                      </h3>
                      {chat.lastMessage && (
                        <p className="text-sm text-gray-500 truncate">
                          {chat.lastMessage.content}
                        </p>
                      )}
                    </div>
                    {chat.lastMessage?.message && (
                      <span className="text-xs text-gray-400">
                        {formatTime(chat.lastMessage.message.createdAt)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Available Connections */}
            {connections.map((connection) => {
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
                  className="p-3 rounded-lg cursor-pointer transition-colors mb-2 hover:bg-gray-100 border-l-4 border-green-400"
                  onClick={() => createChatWithConnection(connection)}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                      {connection?.profile?.avatar ? (
                        <img
                          src={connection.profile.avatar}
                          alt={connection.name || "User"}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-600 font-medium">
                          {connection.profile?.displayName
                            ?.charAt(0)
                            .toUpperCase() ||
                            connection.firstName?.charAt(0).toUpperCase() ||
                            "U"}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {connection.profile?.displayName ||
                          `${connection.firstName || ""} ${
                            connection.lastName || ""
                          }`.trim() ||
                          "Unknown User"}
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
            <div className="p-4 bg-white border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
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
                    <span className="text-gray-600 font-medium">
                      {getOtherParticipant(selectedChat)
                        ?.profile?.displayName?.charAt(0)
                        .toUpperCase() || "U"}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {getOtherParticipant(selectedChat)?.profile?.displayName ||
                      "Unknown User"}
                  </h3>

                  {getOtherParticipant(selectedChat)?.profile?.isOnline ? (
                    <p className="text-sm text-green-500">Online</p>
                  ) : (
                    <p className="text-sm text-red-500">Offline</p>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages &&
                  messages.map((message) => {
                    const isOwn = message.sender._id === currentUserId;
                    return (
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
                          <p>{message.content}</p>
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
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Welcome to Chat
              </h3>
              <p className="text-gray-500">
                Select a chat or connection to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
