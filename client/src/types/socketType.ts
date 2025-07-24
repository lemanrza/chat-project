export interface Message {
  id: number;
  sender?: string;
  content: string;
  time: string;
  isMe: boolean;
}

export interface Conversation {
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
