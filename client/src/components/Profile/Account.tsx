import { useState } from "react";
import { enqueueSnackbar } from "notistack";

const Account = ({
  userData,
  formData,
  handleInputChange,
  handleLogout,
}: any) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev],
    }));
  };

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);

    return {
      isValid:
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers,
      errors: [
        ...(password.length < minLength
          ? ["Password must be at least 8 characters long"]
          : []),
        ...(!hasUpperCase
          ? ["Password must contain at least one uppercase letter"]
          : []),
        ...(!hasLowerCase
          ? ["Password must contain at least one lowercase letter"]
          : []),
        ...(!hasNumbers ? ["Password must contain at least one number"] : []),
      ],
    };
  };

  const handleSubmitPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      enqueueSnackbar("All password fields are required", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      enqueueSnackbar("New password and confirmation don't match", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
      return;
    }

    const validation = validatePassword(passwordData.newPassword);
    if (!validation.isValid) {
      enqueueSnackbar(validation.errors[0], {
        variant: "error",
        autoHideDuration: 4000,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
      return;
    }

    try {
      setIsChangingPassword(true);

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/me/change-password`,
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

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to change password");
      }

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      enqueueSnackbar("Password changed successfully!", {
        variant: "success",
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    } catch (error: any) {
      console.error("Error changing password:", error);
      enqueueSnackbar(error.message || "Failed to change password", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Personal Information Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B878] focus:border-[#00B878] transition-colors"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B878] focus:border-[#00B878] transition-colors"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder="Enter your last name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B878] focus:border-[#00B878] transition-colors"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter your email address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              value={userData?.username || ""}
              disabled
              placeholder="Username cannot be changed"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B878] focus:border-[#00B878] transition-colors"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Enter your location"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B878] focus:border-[#00B878] transition-colors resize-none"
              rows={4}
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              placeholder="Tell us about yourself..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.bio.length}/500 characters
            </p>
          </div>
        </div>
      </div>

      {/* Account Settings Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Account Settings
        </h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Account Type</h4>
              <p className="text-sm text-gray-500">
                {userData?.provider === "local"
                  ? "Email Account"
                  : userData?.provider === "google"
                  ? "Google Account"
                  : userData?.provider === "github"
                  ? "GitHub Account"
                  : "Standard Account"}
              </p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              {userData?.emailVerified ? "Verified" : "Unverified"}
            </span>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">
                Two-Factor Authentication
              </h4>
              <p className="text-sm text-gray-500">
                Add an extra layer of security to your account
              </p>
            </div>
            <button className="px-4 py-2 bg-[#00B878] text-white rounded-lg hover:bg-[#00a76d] transition-colors text-sm font-medium">
              Enable 2FA
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Login Sessions</h4>
              <p className="text-sm text-gray-500">
                Manage your active login sessions
              </p>
            </div>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
              View Sessions
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Change Password
        </h3>
        {userData?.provider === "local" ? (
          <form onSubmit={handleSubmitPasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B878] focus:border-[#00B878] transition-colors"
                  placeholder="Enter your current password"
                  value={passwordData.currentPassword}
                  onChange={(e) => {
                    handlePasswordChange("currentPassword", e.target.value);
                  }}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => togglePasswordVisibility("current")}
                >
                  {showPasswords.current ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B878] focus:border-[#00B878] transition-colors"
                  placeholder="Enter your new password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    handlePasswordChange("newPassword", e.target.value)
                  }
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => togglePasswordVisibility("new")}
                >
                  {showPasswords.new ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {passwordData.newPassword && (
                <div className="mt-2 text-xs text-gray-500">
                  <p className="mb-1">Password must contain:</p>
                  <ul className="space-y-1">
                    <li
                      className={`flex items-center ${
                        passwordData.newPassword.length >= 8
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      <span className="mr-1">
                        {passwordData.newPassword.length >= 8 ? "✓" : "✗"}
                      </span>
                      At least 8 characters
                    </li>
                    <li
                      className={`flex items-center ${
                        /[A-Z]/.test(passwordData.newPassword)
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      <span className="mr-1">
                        {/[A-Z]/.test(passwordData.newPassword) ? "✓" : "✗"}
                      </span>
                      One uppercase letter
                    </li>
                    <li
                      className={`flex items-center ${
                        /[a-z]/.test(passwordData.newPassword)
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      <span className="mr-1">
                        {/[a-z]/.test(passwordData.newPassword) ? "✓" : "✗"}
                      </span>
                      One lowercase letter
                    </li>
                    <li
                      className={`flex items-center ${
                        /\d/.test(passwordData.newPassword)
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      <span className="mr-1">
                        {/\d/.test(passwordData.newPassword) ? "✓" : "✗"}
                      </span>
                      One number
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B878] focus:border-[#00B878] transition-colors"
                  placeholder="Confirm your new password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    handlePasswordChange("confirmPassword", e.target.value)
                  }
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => togglePasswordVisibility("confirm")}
                >
                  {showPasswords.confirm ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {passwordData.confirmPassword &&
                passwordData.newPassword !== passwordData.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">
                    Passwords do not match
                  </p>
                )}
            </div>
            <button
              type="submit"
              disabled={isChangingPassword}
              className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium transition-colors ${
                isChangingPassword
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-[#00B878] hover:bg-[#00a76d] text-white"
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
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
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
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Password Not Available
            </h4>
            <p className="text-gray-500 mb-4">
              You signed up with{" "}
              {userData?.provider === "google" ? "Google" : "GitHub"}. Password
              changes are managed through your{" "}
              {userData?.provider === "google" ? "Google" : "GitHub"} account.
            </p>
            <button
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() =>
                window.open(
                  userData?.provider === "google"
                    ? "https://myaccount.google.com/security"
                    : "https://github.com/settings/security",
                  "_blank"
                )
              }
            >
              Manage on {userData?.provider === "google" ? "Google" : "GitHub"}
            </button>
          </div>
        )}
      </div>

      {/* Danger Zone Section */}
      <div className="bg-red-50 rounded-xl p-6 shadow-sm border border-red-200">
        <h3 className="text-xl font-semibold text-red-900 mb-6 flex items-center gap-2">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          Danger Zone
        </h3>

        <div className="space-y-4">
          {/* Sign Out Option */}
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Sign Out</h4>
                <p className="text-sm text-gray-500">
                  Sign out from your current session
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
            >
              Sign Out
            </button>
          </div>

          {/* Delete Account Option */}
          <div className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-red-200">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <svg
                className="w-5 h-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-red-900 mb-2">Delete Account</h4>
              <p className="text-sm text-red-700 mb-4">
                Permanently remove your account and all associated data. This
                action cannot be undone.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-xs text-red-600">
                  <span>•</span>
                  <span>All chat history will be permanently deleted</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-red-600">
                  <span>•</span>
                  <span>Profile and personal information will be removed</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-red-600">
                  <span>•</span>
                  <span>Account recovery will not be possible</span>
                </div>
              </div>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you absolutely sure you want to delete your account? This action cannot be undone."
                    )
                  ) {
                    alert(
                      "Account deletion functionality will be implemented soon."
                    );
                  }
                }}
              >
                Delete My Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
