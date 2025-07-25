import { useState } from "react";
import { MessageCircle, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import { enqueueSnackbar } from "notistack";
import controller from "@/services/commonRequest";
import endpoints from "@/services/api";
import { getUserIdFromToken } from "@/utils/auth";
import type { UserData, FormData } from "@/types/profileType";

interface PrivacyProps {
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  formData: FormData;
  handleInputChange: (field: string, value: string) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const Privacy = ({
  userData,
  setUserData,
  formData,
  handleInputChange,
  setFormData,
}: PrivacyProps) => {
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);

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
        profileVisibility: formData.profileVisibility,
        messagePrivacy: formData.messagePrivacy,
      };

      const userId = getUserIdFromToken();
      if (!userId) throw new Error("User ID not found");

      const response = await controller.update(
        `${endpoints.users}/me`,
        userId,
        updateData
      );

      setUserData(response.data);
      setFormData({
        ...formData,
        firstName: response.data.profile?.firstName || "",
        lastName: response.data.profile?.lastName || "",
        email: response.data.email || "",
        location: response.data.profile?.location || "",
        bio: response.data.profile?.bio || "",
        profileVisibility: response.data.profileVisibility || "public",
        messagePrivacy: response.data.messagePrivacy || "everyone",
      });

      enqueueSnackbar("Privacy settings updated successfully!", {
        variant: "success",
        autoHideDuration: 2000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    } catch (error) {
      console.error("Error updating privacy settings:", error);
      enqueueSnackbar("Failed to update privacy settings", {
        variant: "error",
        autoHideDuration: 2000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-neutral-700 space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        {t("privacy_settings", "Privacy Settings")}
      </h3>

      {/* Profile Visibility */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-neutral-700 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 dark:bg-neutral-700 rounded-xl flex items-center justify-center">
              <Eye className="text-gray-600 dark:text-gray-300" size={20} />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {t("profile_visibility", "Profile Visibility")}
              </div>
              <div className="text-sm text-gray-500 dark:text-neutral-400">
                {t("control_who_can_see_profile", "Control who can see your profile")}
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
            <div className="w-11 h-6 bg-gray-200 dark:bg-neutral-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00B878]"></div>
          </label>
        </div>

        {/* Message Privacy */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 dark:bg-neutral-700 rounded-xl flex items-center justify-center">
              <MessageCircle className="text-gray-600 dark:text-gray-300" size={20} />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {t("message_privacy", "Message Privacy")}
              </div>
              <div className="text-sm text-gray-500 dark:text-neutral-400">
                {t("control_who_can_send_messages", "Control who can send you messages")}
              </div>
            </div>
          </div>
          <select
            value={formData.messagePrivacy || "everyone"}
            onChange={(e) => handleInputChange("messagePrivacy", e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="everyone">{t("everyone", "Everyone")}</option>
            <option value="friends">{t("friends_only", "Friends Only")}</option>
            <option value="none">{t("no_one", "No One")}</option>
          </select>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSaveChanges}
          disabled={isSaving}
          className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${isSaving
            ? "bg-gray-400 dark:bg-neutral-600 cursor-not-allowed text-white"
            : "bg-[#00B878] hover:bg-[#00a76d] text-white hover:shadow-lg transform hover:scale-105"
            }`}
        >
          {isSaving ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t("saving", "Saving...")}
            </span>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t("save_changes", "Save Changes")}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Privacy;
