import Swal from "sweetalert2";

interface DangerZoneProps {
  handleLogout: () => void;
}

const DangerZone = ({ handleLogout }: DangerZoneProps) => {
  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: "Delete Account?",
      html: `
        <div class="text-left">
          <p class="mb-4 text-gray-700">Are you absolutely sure you want to delete your account?</p>
          <div class="bg-red-50 p-3 rounded-lg mb-4">
            <p class="text-sm text-red-700 font-medium mb-2">This action will:</p>
            <ul class="text-sm text-red-600 space-y-1">
              <li>• Permanently delete all your chat history</li>
              <li>• Remove your profile and personal information</li>
              <li>• Make account recovery impossible</li>
            </ul>
          </div>
          <p class="text-sm text-gray-600">This action cannot be undone.</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete my account",
      cancelButtonText: "Cancel",
      focusCancel: true,
      customClass: {
        popup: "!rounded-xl",
        title: "!text-xl !font-semibold !text-gray-900",
        htmlContainer: "!m-0",
        actions: "!mt-6",
        confirmButton: "!px-6 !py-2.5 !rounded-lg !font-medium",
        cancelButton: "!px-6 !py-2.5 !rounded-lg !font-medium",
      },
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/auth/me`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete account");
        }

        // Clear token and redirect to login
        localStorage.removeItem("token");

        await Swal.fire({
          title: "Account Deleted",
          text: "Your account has been successfully deleted.",
          icon: "success",
          confirmButtonColor: "#00B878",
          confirmButtonText: "Continue to Login",
          customClass: {
            popup: "!rounded-xl",
            title: "!text-xl !font-semibold !text-gray-900",
            confirmButton: "!px-6 !py-2.5 !rounded-lg !font-medium",
          },
        });

        window.location.href = "/auth/login";
      } catch (error) {
        console.error("Error deleting account:", error);

        await Swal.fire({
          title: "Deletion Failed",
          text: "Failed to delete account. Please try again.",
          icon: "error",
          confirmButtonColor: "#dc2626",
          confirmButtonText: "Try Again",
          customClass: {
            popup: "!rounded-xl",
            title: "!text-xl !font-semibold !text-gray-900",
            confirmButton: "!px-6 !py-2.5 !rounded-lg !font-medium",
          },
        });
      }
    }
  };

  return (
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
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium cursor-pointer"
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
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium cursor-pointer"
              onClick={handleDeleteAccount}
            >
              Delete My Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DangerZone;
