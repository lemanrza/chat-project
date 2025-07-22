export interface UserData {
  username?: string;
  email?: string;
  provider?: "local" | "google" | "github";
  emailVerified?: boolean;
  profile?: {
    firstName?: string;
    lastName?: string;
    location?: string;
    bio?: string;
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
  handleLogout: () => void;
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
