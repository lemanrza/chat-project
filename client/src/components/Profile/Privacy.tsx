import { useState } from "react";
import { MessageCircle, Eye } from "lucide-react";
import { enqueueSnackbar } from "notistack";
import controller from "@/services/commonRequest";
import endpoints from "@/services/api";
import { getUserIdFromToken } from "@/utils/auth";
import type { UserData, FormData } from "@/types/profileType";
import { t } from "i18next";

interface PrivacyProps {
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  formData: FormData;
  handleInputChange: (field: string, value: string) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const Privacy = ({ userData, setUserData, formData, handleInputChange, setFormData }: PrivacyProps) => {
  const [isSaving, setIsSaving] = useState(false);

  // Save changes
  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      const updateData = {
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          bio: formData.bio,
          avatar: userData?.profile?.avatar,
          location: formData.location,
        },
        email: formData.email,
        profileVisibility: formData.profileVisibility, // Use formData.profileVisibility
      };

      console.log("Saving privacy settings with data:", updateData);

      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error("User ID not found");
      }

      const response = await controller.update(`${endpoints.users}/me`, userId, updateData);

      // Update parent component's userData and formData with the response
      setUserData(response.data);
      setFormData({
        ...formData,
        firstName: response.data.profile?.firstName || "",
        lastName: response.data.profile?.lastName || "",
        email: response.data.email || "",
        location: response.data.profile?.location || "",
        bio: response.data.profile?.bio || "",
        profileVisibility: response.data.profileVisibility || "public",
      });

      enqueueSnackbar("Privacy settings updated successfully!", {
        variant: "success",
        autoHideDuration: 2000,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    } catch (error) {
      console.error("Error updating privacy settings:", error);
      enqueueSnackbar("Failed to update privacy settings", {
        variant: "error",
        autoHideDuration: 2000,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#262626] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        {t("privacy_settings")}
      </h3>

      <div className="space-y-6">
        {/* Profile Visibility */}
        <div className="bg-white dark:bg-[#262626] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                <Eye className="text-gray-600 dark:text-white" size={20} />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {t("profile_visibility")}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {t("control_who_can_see_your_profile")}
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formData.profileVisibility === "public"}
                onChange={() =>
                  handleInputChange(
                    "profileVisibility",
                    formData.profileVisibility === "public" ? "private" : "public"
                  )
                }
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:bg-[#00B878] peer-checked:border-[#00B878] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
        </div>

        {/* Message Privacy */}
        <div className="bg-white dark:bg-[#262626] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                <MessageCircle className="text-gray-600 dark:text-white" size={20} />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {t("message_privacy")}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {t("control_who_can_send_you_messages")}
                </div>
              </div>
            </div>
            <select className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option value="everyone">{t("everyone")}</option>
              <option value="friends">{t("friends_only")}</option>
              <option value="none">{t("no_one")}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSaveChanges}
          disabled={isSaving}
          className={`px-3.5 py-2.5 rounded-lg font-medium transition-all duration-200 ${isSaving
            ? "bg-gray-400 cursor-not-allowed text-white"
            : "bg-[#00B878] hover:bg-[#00a76d] text-white hover:shadow-lg transform hover:scale-105 cursor-pointer"
            }`}
        >
          {isSaving ? (
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
              {t("saving")}
            </span>
          ) : (
            <>
              <svg
                className="w-5 h-5 mr-2 inline"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {t("save_changes")}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Privacy;
