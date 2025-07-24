export interface Message {
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

export interface Chat {
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

export interface Connection {
  _id: string;
  username: string;
  profile: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}
