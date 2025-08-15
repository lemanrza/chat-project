import { enqueueSnackbar } from "notistack";
import PasswordInput from "./components/PasswordInput";
import PasswordRequirements from "./components/PasswordRequirements";
import type { UserData } from "@/types/profileType";
import { usePasswordForm } from "@/hooks/usePasswordForm";
import { validatePassword } from "@/lib/validatePassword";
import { getUserIdFromToken } from "@/utils/auth";
import { t } from "i18next";

interface ChangePasswordProps {
  userData: UserData | null;
}

const ChangePassword = ({ userData }: ChangePasswordProps) => {
  const {
    passwordData,
    showPasswords,
    isChangingPassword,
    updatePassword,
    togglePasswordVisibility,
    resetForm,
    setIsChangingPassword,
  } = usePasswordForm();

  if (!userData) {
    return (
      <div className="bg-white dark:bg-[#262626] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Change Password
        </h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const passwordValidation = validatePassword(passwordData.newPassword);
  const passwordsMatch =
    passwordData.newPassword === passwordData.confirmPassword;
  const isSameAsCurrentPassword =
    passwordData.currentPassword === passwordData.newPassword;

  const handleSubmitPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      enqueueSnackbar("All password fields are required", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
      return;
    }

    if (isSameAsCurrentPassword) {
      enqueueSnackbar("New password must be different from current password", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
      return;
    }

    if (!passwordsMatch) {
      enqueueSnackbar("New password and confirmation don't match", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
      return;
    }

    if (!passwordValidation.isValid) {
      enqueueSnackbar("Please ensure your password meets all requirements", {
        variant: "error",
        autoHideDuration: 4000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
      return;
    }

    try {
      setIsChangingPassword(true);

      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/me/${userId}/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      );

      if (!response.ok) {
        let errorMessage = "Failed to change password";
        try {
          const result = await response.json();
          errorMessage = result.message || errorMessage;
        } catch {
          errorMessage = `Server error (${response.status}): ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      try {
        await response.json();
      } catch {
        console.log("✅ Password changed successfully (no JSON response)");
      }

      try {
        const testResponse = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: userData?.email || "unknown@email.com",
              password: passwordData.newPassword,
            }),
          }
        );

        if (testResponse.ok) {
          console.log("✅ NEW PASSWORD WORKS! Password was actually updated.");
        } else {
          const errorResult = await testResponse.json();
          console.log("❌ NEW PASSWORD DOESN'T WORK:", errorResult.message);
          console.log(
            "❌ This means the password wasn't actually updated in the database"
          );
        }
      } catch (testError) {
        console.log("❌ Error testing new password:", testError);
      }
      resetForm();
      enqueueSnackbar("Password changed successfully!", {
        variant: "success",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    } catch (error: any) {
      console.error("Error changing password:", error);
      enqueueSnackbar(error.message || "Failed to change password", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Non-local provider view
  if (userData?.provider !== "local") {
    return (
      <div className="bg-white dark:bg-[#262626] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          {t("change_password")}
        </h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400 dark:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {t("change_password_not_available")}
          </h4>
          <p className="text-gray-500 dark:text-gray-300 mb-4">
            {t("change_password_provider_info")}{" "}
            {userData?.provider === "google" ? "Google" : "GitHub"}. Password
            changes are managed through your{" "}
            {userData?.provider === "google" ? "Google" : "GitHub"} account.
          </p>
          <button
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            onClick={() =>
              window.open(
                userData?.provider === "google"
                  ? "https://myaccount.google.com/security"
                  : "https://github.com/settings/security",
                "_blank"
              )
            }
          >
            {t("")} {userData?.provider === "google" ? "Google" : "GitHub"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#262626] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Change Password
      </h3>

      <form onSubmit={handleSubmitPasswordChange} className="space-y-6">
        {/* Current Password */}
        <PasswordInput
          label="Current Password"
          placeholder="Enter your current password"
          value={passwordData.currentPassword}
          showPassword={showPasswords.current}
          onChange={(value) => updatePassword("currentPassword", value)}
          onToggleVisibility={() => togglePasswordVisibility("current")}
          required
          autoComplete="current-password"
        />

        {/* New Password */}
        <div>
          <PasswordInput
            label="New Password"
            placeholder="Enter your new password"
            value={passwordData.newPassword}
            showPassword={showPasswords.new}
            onChange={(value) => updatePassword("newPassword", value)}
            onToggleVisibility={() => togglePasswordVisibility("new")}
            error={
              passwordData.newPassword && isSameAsCurrentPassword
                ? "New password must be different from current password"
                : undefined
            }
            required
            autoComplete="new-password"
          />

          {/* Password Requirements */}
          {passwordData.newPassword && (
            <PasswordRequirements
              requirements={passwordValidation.requirements}
              className="animate-in slide-in-from-top-2 duration-300"
            />
          )}
        </div>

        {/* Confirm Password */}
        <PasswordInput
          label="Confirm New Password"
          placeholder="Confirm your new password"
          value={passwordData.confirmPassword}
          showPassword={showPasswords.confirm}
          onChange={(value) => updatePassword("confirmPassword", value)}
          onToggleVisibility={() => togglePasswordVisibility("confirm")}
          error={
            passwordData.confirmPassword && !passwordsMatch
              ? "Passwords do not match"
              : undefined
          }
          required
          autoComplete="new-password"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={
            isChangingPassword ||
            !passwordValidation.isValid ||
            !passwordsMatch ||
            isSameAsCurrentPassword
          }
          className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            isChangingPassword ||
            !passwordValidation.isValid ||
            !passwordsMatch ||
            isSameAsCurrentPassword
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-[#00B878] hover:bg-[#00a76d] text-white hover:shadow-lg transform hover:scale-105"
          }`}
        >
          {isChangingPassword ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Updating Password...
            </span>
          ) : (
            "Update Password"
          )}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
