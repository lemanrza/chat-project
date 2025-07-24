export interface UserData {
  _id?: string;
  id?: string;
  username?: string;
  email?: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    avatar?: string;
    bio?: string;
    location?: string;
    dateOfBirth?: string | null;
    public_id?: string;
    _id?: string;
  };
  provider?: string;
  providerId?: string | null;
  hobbies?: string[];
  connections?: any[];
  lastLogin?: string | null;
  loginAttempts?: number;
  lockUntil?: string | null;
  lastSeen?: string | null;
  isOnline?: boolean;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  pushNotifications?: {
    enabled?: boolean;
    preferences?: {
      groupMessages?: boolean;
      mentions?: boolean;
      messages?: boolean;
    };
    tokens?: any[];
  };
  status?: string;
  profileVisibility?: string;
  connectionsRequests?: any[];
  socketId?: string | null;
}

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  bio: string;
}
