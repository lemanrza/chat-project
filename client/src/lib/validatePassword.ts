import type { PasswordRequirement } from "@/types/profileType";
import { enqueueSnackbar } from "notistack";

// Utility functions for password validation and notifications
export const validatePassword = (password: string) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);

  const requirements: PasswordRequirement[] = [
    {
      id: "length",
      label: "At least 8 characters",
      isValid: password.length >= minLength,
    },
    {
      id: "uppercase",
      label: "One uppercase letter",
      isValid: hasUpperCase,
    },
    {
      id: "lowercase",
      label: "One lowercase letter",
      isValid: hasLowerCase,
    },
    {
      id: "number",
      label: "One number",
      isValid: hasNumbers,
    },
  ];

  return {
    isValid: requirements.every((req) => req.isValid),
    requirements,
  };
};

export const showNotification = (
  message: string,
  type: "success" | "error" = "error"
) => {
  enqueueSnackbar(message, {
    variant: type,
    autoHideDuration: 3000,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "right",
    },
  });
};
