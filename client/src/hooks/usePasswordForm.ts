import type { PasswordData, ShowPasswords } from "@/types/profileType";
import { useState } from "react";

export const usePasswordForm = () => {
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState<ShowPasswords>({
    current: false,
    new: false,
    confirm: false,
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const updatePassword = (field: keyof PasswordData, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const togglePasswordVisibility = (field: keyof ShowPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const resetForm = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return {
    passwordData,
    showPasswords,
    isChangingPassword,
    updatePassword,
    togglePasswordVisibility,
    resetForm,
    setIsChangingPassword,
  };
};
