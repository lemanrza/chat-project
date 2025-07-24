import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import controller from "@/services/commonRequest";
import endpoints from "@/services/api";
import type { UserData, FormData } from "./types";
import { getUserIdFromToken } from "@/utils/auth";

interface PersonalInformationsProps {
  formData: FormData;
  handleInputChange: (field: string, value: string) => void;
  userData: UserData | null;
}

const PersonalInformations = ({
  formData,
  handleInputChange,
  userData,
}: PersonalInformationsProps) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);

      const updateData = {
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          location: formData.location,
          bio: formData.bio,
          avatar: userData?.profile?.avatar,
        },
        email: formData.email,
      };

      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error("User ID not found");
      }

      await controller.update(`${endpoints.users}/me`, userId, updateData);
      enqueueSnackbar("Profile updated successfully!", {
        variant: "success",
        autoHideDuration: 2000,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      enqueueSnackbar("Failed to update profile", {
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

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSaveChanges}
          disabled={isSaving}
          className={`px-3.5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
            isSaving
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
              Saving...
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
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PersonalInformations;
