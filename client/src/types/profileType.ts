export interface UserData {
  id: string;
  username?: string;
  email?: string;
  provider?: "local" | "google" | "github";
  emailVerified?: boolean;
  hobbies?: string[];
  connections: string[];
  lastLogin?: Date;
  lastSeen?: Date;
  isOnline?: boolean;
  profile?: {
    firstName?: string;
    lastName?: string;
    location?: string;
    bio?: string;
    displayName?: string;
    avatar?: string;
  };
}

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  bio: string;
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
