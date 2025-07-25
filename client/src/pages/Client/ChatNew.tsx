import { useEffect, useState, useRef } from "react";
import { Send, MessageSquare } from "lucide-react";
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
  participants: {
    _id: string;
    name: string;
    profilePicture?: string;
  }[];
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
  const [chats, setChats] = useState<ChatType[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatType | null>(null);
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

  // Initialize user and fetch data
  useEffect(() => {
    const userId = getUserIdFromToken();
    if (userId) {
      setCurrentUserId(userId);
      fetchUserData(userId);
    }
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch user with connections
      const userResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/me/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setConnections(userData.connections || []);
      }

      // Fetch existing chats
      const chatsResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (chatsResponse.ok) {
        const chatsData = await chatsResponse.json();
        setChats(chatsData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
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
        `${import.meta.env.VITE_BACKEND_URL}/api/message/chat/${chatId}`,
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
        `${import.meta.env.VITE_BACKEND_URL}/api/message`,
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
        `${import.meta.env.VITE_BACKEND_URL}/api/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            participants: [currentUserId, connection._id],
          }),
        }
      );

      if (response.ok) {
        const newChat = await response.json();
        setChats((prev) => [...prev, newChat]);
        handleChatSelect(newChat);
      }
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const getOtherParticipant = (chat: ChatType) => {
    return chat.participants.find((p) => p._id !== currentUserId);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (!currentUserId) {
    return (
      <div className="flex items-center justify-center h-full">
        Please log in to access chat.
      </div>
    );
  }

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
            {chats.map((chat) => {
              const otherParticipant = getOtherParticipant(chat);
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
                      <h3 className="font-medium text-gray-900 truncate">
                        {otherParticipant?.name}
                      </h3>
                      {chat.lastMessage && (
                        <p className="text-sm text-gray-500 truncate">
                          {chat.lastMessage.text}
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
              // Don't show connections that already have active chats
              const hasExistingChat = chats.some((chat) =>
                chat.participants.some((p) => p._id === connection._id)
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
            <div className="p-4 bg-white border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                  {getOtherParticipant(selectedChat)?.profilePicture ? (
                    <img
                      src={getOtherParticipant(selectedChat)?.profilePicture}
                      alt={getOtherParticipant(selectedChat)?.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 font-medium">
                      {getOtherParticipant(selectedChat)
                        ?.name?.charAt(0)
                        .toUpperCase()}
                    </span>
                  )}
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
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message) => {
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
