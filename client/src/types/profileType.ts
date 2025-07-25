export interface UserData {
  id: string
  profile: {
    firstName: string;
    lastName: string;
    bio: string;
    avatar: string;
    location: string;
    displayName?: string;
  };
  email: string;
  username: string;
  connections: string[] | UserData[]; // Can be either IDs or populated user objects
  connectionsRequests: string[] | UserData[]; // Can be either IDs or populated user objects
  hobbies: string[];
  createdAt: string;
  provider: string;
  emailVerified: boolean;
  isOnline: boolean;
  profileVisibility: "public" | "private";
}

export interface FormData {
  messagePrivacy: string;
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  bio: string;
  hobbies: string[];
  connections: string[];
  connectionsRequests: string[];
  profileVisibility: "public" | "private";
}
export interface ConnectionRequest {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface AccountProps {
  userData: UserData | null;
  formData: FormData;
  handleInputChange: (field: string, value: string) => void;
}

export interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ShowPasswords {
  current: boolean;
  new: boolean;
  confirm: boolean;
}

export interface PasswordRequirement {
  id: string;
  label: string;
  isValid: boolean;
}
