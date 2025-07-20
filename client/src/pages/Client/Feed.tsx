
import React, { useState } from 'react'
import { Search, Phone, Video, MoreHorizontal, Paperclip, Smile, Send, Settings, Menu, X, Users, MessageCircle, User } from 'lucide-react'

interface Message {
  id: number;
  sender?: string;
  content: string;
  time: string;
  isMe: boolean;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online?: boolean;
  isGroup?: boolean;
  members?: number;
}

const Feed = () => {
  const [selectedChat, setSelectedChat] = useState('alex-chen')
  const [message, setMessage] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const conversations: Conversation[] = [
    {
      id: 'alex-chen',
      name: 'Alex Chen',
      avatar: 'AC',
      lastMessage: "Hey! How's the project going?",
      time: '2 min',
      unread: 3,
      online: true
    },
    {
      id: 'design-team',
      name: 'Design Team',
      avatar: 'DT',
      lastMessage: 'Meeting at 3 PM tomorrow',
      time: '5 min',
      unread: 0,
      isGroup: true,
      members: 8
    },
    {
      id: 'maria-garcia',
      name: 'Maria Garcia',
      avatar: 'MG',
      lastMessage: 'Thanks for the help yesterday!',
      time: '1 hour',
      unread: 1,
      online: true
    },
    {
      id: 'dev-squad',
      name: 'Dev Squad',
      avatar: 'DS',
      lastMessage: 'New feature is ready for review',
      time: '3 hours',
      unread: 0,
      isGroup: true,
      members: 12
    },
    {
      id: 'yuki-tanaka',
      name: 'Yuki Tanaka',
      avatar: 'YT',
      lastMessage: "Let's catch up soon 😊",
      time: '1 day',
      unread: 0,
      online: false
    }
  ]

  const chatMessages: Record<string, Message[]> = {
    'alex-chen': [
      {
        id: 1,
        sender: 'Alex Chen',
        content: 'Hey! How are you doing?',
        time: '10:30 AM',
        isMe: false
      },
      {
        id: 2,
        content: "I'm doing great! Thanks for asking. How about you?",
        time: '10:32 AM',
        isMe: true
      },
      {
        id: 3,
        sender: 'Alex Chen',
        content: 'Pretty good! Want to grab coffee later?',
        time: '10:35 AM',
        isMe: false
      },
      {
        id: 4,
        content: 'Sounds perfect! What time works for you?',
        time: '10:36 AM',
        isMe: true
      },
      {
        id: 5,
        sender: 'Alex Chen',
        content: 'That sounds awesome! 🎉',
        time: '10:37 AM',
        isMe: false
      }
    ],
    'design-team': [
      {
        id: 1,
        sender: 'Design Team',
        content: 'Meeting at 3 PM tomorrow',
        time: '9:00 AM',
        isMe: false
      },
      {
        id: 2,
        content: 'I will be there!',
        time: '9:02 AM',
        isMe: true
      },
      {
        id: 3,
        sender: 'Sarah Wilson',
        content: 'Great! See you all there.',
        time: '9:05 AM',
        isMe: false
      }
    ],
    'maria-garcia': [
      {
        id: 1,
        sender: 'Maria Garcia',
        content: 'Thanks for the help yesterday!',
        time: '8:30 AM',
        isMe: false
      },
      {
        id: 2,
        content: 'You are welcome! Happy to help.',
        time: '8:32 AM',
        isMe: true
      },
      {
        id: 3,
        sender: 'Maria Garcia',
        content: 'The project looks amazing now!',
        time: '8:35 AM',
        isMe: false
      }
    ],
    'dev-squad': [
      {
        id: 1,
        sender: 'Dev Squad',
        content: 'New feature is ready for review',
        time: '7:00 AM',
        isMe: false
      },
      {
        id: 2,
        content: 'Awesome! I will check it out.',
        time: '7:02 AM',
        isMe: true
      }
    ],
    'yuki-tanaka': [
      {
        id: 1,
        sender: 'Yuki Tanaka',
        content: "Let's catch up soon 😊",
        time: 'Yesterday',
        isMe: false
      },
      {
        id: 2,
        content: 'Definitely! How about this weekend?',
        time: 'Yesterday',
        isMe: true
      }
    ]
  }

  const selectedConversation = conversations.find(conv => conv.id === selectedChat)
  const messages = chatMessages[selectedChat] || []

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'w-64' : 'w-16'
      }`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 transition-opacity duration-300 ${
              sidebarOpen ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="w-6 h-6 bg-green-500 rounded"></div>
              <span className="font-semibold text-xl">Chat <span className="text-green-500">Wave</span></span>
            </div>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 text-gray-600 hover:bg-gray-100 rounded"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 px-3 py-2 text-green-600 bg-green-50 rounded-lg">
              <Users size={20} />
              {sidebarOpen && (
                <span className="transition-opacity duration-300">Feed</span>
              )}
              {sidebarOpen && (
                <div className="w-2 h-2 bg-green-500 rounded-full ml-auto"></div>
              )}
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
              <MessageCircle size={20} />
              {sidebarOpen && (
                <span className="transition-opacity duration-300">Chat</span>
              )}
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
              <User size={20} />
              {sidebarOpen && (
                <span className="transition-opacity duration-300">Profile</span>
              )}
            </div>
          </div>
        </nav>

        {/* Bottom Navigation */}
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-2">
            <div className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
              <Settings size={20} />
              {sidebarOpen && (
                <span className="transition-opacity duration-300">Settings</span>
              )}
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer">
              <span>↪</span>
              {sidebarOpen && (
                <span className="transition-opacity duration-300">Logout</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <div 
              key={conversation.id}
              onClick={() => setSelectedChat(conversation.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedChat === conversation.id ? 'bg-green-50 border-l-4 border-l-green-500' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                    conversation.id === 'alex-chen' ? 'bg-green-500' :
                    conversation.id === 'design-team' ? 'bg-purple-500' :
                    conversation.id === 'maria-garcia' ? 'bg-green-500' :
                    conversation.id === 'dev-squad' ? 'bg-purple-500' :
                    'bg-green-500'
                  }`}>
                    {conversation.avatar}
                  </div>
                  {conversation.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">{conversation.name}</h3>
                    <span className="text-xs text-gray-500">{conversation.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                    {conversation.unread > 0 && (
                      <span className="ml-2 bg-green-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                  {conversation.isGroup && (
                    <p className="text-xs text-gray-500">{conversation.members} members</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                  selectedChat === 'alex-chen' ? 'bg-green-500' :
                  selectedChat === 'design-team' ? 'bg-purple-500' :
                  selectedChat === 'maria-garcia' ? 'bg-green-500' :
                  selectedChat === 'dev-squad' ? 'bg-purple-500' :
                  'bg-green-500'
                }`}>
                  {selectedConversation?.avatar || 'AC'}
                </div>
                {selectedConversation?.online && !selectedConversation?.isGroup && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{selectedConversation?.name || 'Alex Chen'}</h3>
                <p className="text-sm text-green-500">
                  {selectedConversation?.isGroup 
                    ? `${selectedConversation.members} members` 
                    : selectedConversation?.online 
                      ? 'Online' 
                      : 'Offline'
                  }
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
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg: Message) => (
            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start gap-2 max-w-xs lg:max-w-md ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                {!msg.isMe && (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                    selectedChat === 'alex-chen' ? 'bg-green-500' :
                    selectedChat === 'design-team' ? 'bg-purple-500' :
                    selectedChat === 'maria-garcia' ? 'bg-green-500' :
                    selectedChat === 'dev-squad' ? 'bg-purple-500' :
                    'bg-green-500'
                  }`}>
                    {selectedConversation?.avatar || 'AC'}
                  </div>
                )}
                <div className={`px-4 py-2 rounded-lg ${
                  msg.isMe 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p>{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.isMe ? 'text-green-100' : 'text-gray-500'}`}>
                    {msg.time}
                  </p>
                </div>
                {msg.isMe && (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    ME
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Paperclip size={20} />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-600 hover:bg-gray-100 rounded">
                <Smile size={16} />
              </button>
            </div>
            <button className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Feed