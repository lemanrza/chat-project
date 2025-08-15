import endpoints from "@/services/api";
import controller from "@/services/commonRequest";
import { enqueueSnackbar } from "notistack";
import Swal from "sweetalert2";
import { getUserIdFromToken } from "@/utils/auth";
import { t } from "i18next";

const DangerZone = () => {
  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: t("delete_account.title"),
      html: `
    <div class="text-left">
      <p class="mb-4 text-gray-700 dark:text-gray-300">${t("delete_account.warning_text")}</p>
      <div class="bg-red-50 dark:bg-red-700 p-3 rounded-lg mb-4">
        <p class="text-sm text-red-700 dark:text-red-300 font-medium mb-2">${t("delete_account.consequences_title")}</p>
        <ul class="text-sm text-red-600 dark:text-red-400 space-y-1">
          <li>• ${t("delete_account.consequences.delete_history")}</li>
          <li>• ${t("delete_account.consequences.remove_profile")}</li>
          <li>• ${t("delete_account.consequences.no_recovery")}</li>
        </ul>
      </div>
      <p class="text-sm text-gray-600 dark:text-gray-300">${t("delete_account.irreversible")}</p>
    </div>
  `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: t("delete_account.confirm"),
      cancelButtonText: t("delete_account.cancel"),
      focusCancel: true,
      customClass: {
        popup: "!rounded-xl",
        title: "!text-xl !font-semibold !text-gray-900 dark:text-white",
        htmlContainer: "!m-0",
        actions: "!mt-6",
        confirmButton: "!px-6 !py-2.5 !rounded-lg !font-medium",
        cancelButton: "!px-6 !py-2.5 !rounded-lg !font-medium",
      },
    });


    if (result.isConfirmed) {
      try {
        const userId = getUserIdFromToken();
        if (!userId) {
          throw new Error("User ID not found");
        }

        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/auth/me/${userId}`,
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

        localStorage.removeItem("token");

        await Swal.fire({
          title: "Account Deleted",
          text: "Your account has been successfully deleted.",
          icon: "success",
          confirmButtonColor: "#00B878",
          confirmButtonText: "Continue to Login",
          customClass: {
            popup: "!rounded-xl",
            title: "!text-xl !font-semibold !text-gray-900 dark:text-white",
            confirmButton: "!px-6 !py-2.5 !rounded-lg !font-medium",
          },
        });

        window.location.href = "/auth/login";
      } catch (error) {
        console.error("Error deleting account:", error);

        await Swal.fire({
          title: t("deletion_failed", "Deletion Failed"),
          text: t("delete_account_failed", "Failed to delete account. Please try again."),
          icon: "error",
          confirmButtonColor: "#dc2626",
          confirmButtonText: t("try_again", "Try Again"),
          customClass: {
            popup: "!rounded-xl",
            title: "!text-xl !font-semibold !text-gray-900 dark:text-white",
            confirmButton: "!px-6 !py-2.5 !rounded-lg !font-medium",
          },
        });
      }
    }
  };

  const handleLogout = async () => {
    const userId = getUserIdFromToken();
    if (userId) {
      await controller.update(`${endpoints.users}/me`, userId, {
        isOnline: false,
      });
    }

    localStorage.removeItem("token");
    enqueueSnackbar("Logged out successfully", {
      variant: "success",
      autoHideDuration: 2000,
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right",
      },
    });
    window.location.href = "/auth/login";
  };

  return (
    <div className="bg-red-50 dark:bg-red-800 rounded-xl p-6 shadow-sm border border-red-200 dark:border-red-700">
      <h3 className="text-xl font-semibold text-red-900 dark:text-white mb-6 flex items-center gap-2">
        <svg
          className="w-6 h-6 text-red-600 dark:text-red-400"
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
        {t("danger_zone", "Danger Zone")}
      </h3>

      <div className="space-y-4">
        {/* Sign Out Option */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-[#262626] rounded-lg border border-red-200 dark:border-red-600">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-700 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-orange-600 dark:text-orange-300"
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
              <h4 className="font-medium text-gray-900 dark:text-white">
                {t("sign_out", "Sign Out")}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("sign_out_description")}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium cursor-pointer"
          >
            {t("sign_out", "Sign Out")}
          </button>
        </div>

        {/* Delete Account Option */}
        <div className="flex items-start space-x-3 p-4 bg-white dark:bg-[#262626] rounded-lg border border-red-200 dark:border-red-600">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <svg
              className="w-5 h-5 text-red-600 dark:text-red-400"
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
            <h4 className="font-medium text-red-900 dark:text-white mb-2">
              {t("delete_account", "Delete Account")}
            </h4>
            <p className="text-sm text-red-700 dark:text-red-400 mb-4">
              {t("delete_account_confirmation")}
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-xs text-red-600 dark:text-red-400">
                <span>•</span>
                <span>
                  {t("delete_account_chat_history")}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-red-600 dark:text-red-400">
                <span>•</span>
                <span>
                  {t("delete_account_profile_info")}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-red-600 dark:text-red-400">
                <span>•</span>
                <span>
                  {t("delete_account_recovery")}
                </span>
              </div>
            </div>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium cursor-pointer"
              onClick={handleDeleteAccount}
            >
              {t("delete_account", "Delete My Account")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DangerZone;
