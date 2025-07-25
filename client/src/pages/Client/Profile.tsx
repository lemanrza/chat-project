import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import controller from "@/services/commonRequest";
import endpoints from "@/services/api";
import { enqueueSnackbar } from "notistack";
import Account from "@/components/Profile/Account/Account";
import Privacy from "@/components/Profile/Privacy";
import Overview from "@/components/Profile/Overview";
import Navigation from "@/components/Profile/Navigation";
import Settings from "@/components/Profile/Settings";
import { getUserIdFromToken, isTokenExpired } from "@/utils/auth";
import type { FormData } from "@/types/profileType";

const Profile = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    bio: "",
    hobbies: [],
    connections: [],
    connectionsRequests: [],
    profileVisibility: "public"
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (isTokenExpired()) {
          localStorage.removeItem("token");
          window.location.href = "/auth/login";
          return;
        }

        const userId = getUserIdFromToken();
        if (!userId) {
          console.log("No user ID found in token, redirecting to login...");
          localStorage.removeItem("token");
          window.location.href = "/auth/login";
          return;
        }

        const response = await controller.getOne(`${endpoints.users}/me`, userId);
        setUserData(response.data);

        setFormData({
          firstName: response.data.profile?.firstName || "",
          lastName: response.data.profile?.lastName || "",
          email: response.data.email || "",
          location: response.data.profile?.location || "",
          bio: response.data.profile?.bio || "",
          hobbies: response.data.hobbies || [],
          connections: response.data.connections || [],
          connectionsRequests: response.data.connectionsRequests || [],
          profileVisibility: (response.data.profileVisibility as "public" | "private") || "public",
        });
      } catch (error: any) {
        console.error("Error fetching user data:", error);

        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log("Authentication failed, redirecting to login...");
          localStorage.removeItem("token");
          window.location.href = "/auth/login";
          return;
        }

        enqueueSnackbar(t('profile_failed_to_load'), {
          variant: "error",
          autoHideDuration: 2000,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      enqueueSnackbar(t('profile_invalid_image'), {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      enqueueSnackbar(t('profile_image_size_error'), {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
      return;
    }

    try {
      setIsUploadingImage(true);

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      const uploadFormData = new FormData();
      uploadFormData.append("avatar", file);

      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error("User ID not found");
      }

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/me/${userId}/upload-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: uploadFormData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const result = await response.json();

      setUserData((prev: any) => ({
        ...prev,
        profile: {
          ...prev.profile,
          avatar: result.data.avatar,
        },
      }));

      URL.revokeObjectURL(previewUrl);
      setImagePreview("");

      enqueueSnackbar(t('profile_image_updated'), {
        variant: "success",
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    } catch (error) {
      console.error("Error uploading image:", error);

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview("");
      }

      enqueueSnackbar(t('profile_failed_upload_image'), {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteImage = async () => {
    try {
      setIsUploadingImage(true);

      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error("User ID not found");
      }

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/me/${userId}/delete-image`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      setUserData((prev: any) => ({
        ...prev,
        profile: {
          ...prev.profile,
          avatar:
            "https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png",
        },
      }));

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview("");
      }

      enqueueSnackbar(t('profile_image_deleted'), {
        variant: "success",
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      enqueueSnackbar(t('profile_failed_delete_image'), {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00B878] mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('profile_loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">{t('profile_title')}</h1>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
          <div className="flex items-start gap-6">
            <div className="relative group">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-semibold overflow-hidden transition-all duration-200 group-hover:shadow-xl group-hover:scale-[1.02] mx-auto"
                style={{ backgroundColor: "#00B878" }}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : userData?.profile?.avatar ? (
                  <img
                    src={userData.profile.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  userData?.profile?.firstName?.charAt(0) +
                  userData?.profile?.lastName?.charAt(0) || "U"
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />

              <div className="mt-3 flex flex-col items-center gap-2">
                <button
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 ${isUploadingImage
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-[#00B878] text-white hover:bg-emerald-600 border border-[#00B878] hover:border-emerald-600"
                    }`}
                  onClick={!isUploadingImage ? triggerFileInput : undefined}
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border border-gray-400 border-t-transparent"></div>
                      <span>{t('profile_uploading')}</span>
                    </>
                  ) : (
                    <>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <path d="M12 2L12 22M2 12L22 12" />
                      </svg>
                      <span>{t('profile_change_photo')}</span>
                    </>
                  )}
                </button>

                {userData?.profile?.avatar &&
                  userData.profile.avatar !==
                  "https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png" &&
                  !imagePreview && (
                    <button
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 ${isUploadingImage
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200 hover:border-red-300"
                        }`}
                      onClick={
                        !isUploadingImage ? handleDeleteImage : undefined
                      }
                      disabled={isUploadingImage}
                    >
                      {isUploadingImage ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border border-gray-400 border-t-transparent"></div>
                          <span>{t('profile_removing')}</span>
                        </>
                      ) : (
                        <>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          >
                            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14ZM10 11v6M14 11v6" />
                          </svg>
                          <span>{t('profile_remove_photo')}</span>
                        </>
                      )}
                    </button>
                  )}
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-3xl font-semibold text-gray-900 mb-1">
                {userData?.profile?.displayName ||
                  `${formData.firstName} ${formData.lastName}`}
              </h2>
              <p className="text-gray-500 mb-4">@{userData?.username}</p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {formData.bio || t('profile_no_bio')}
              </p>

              <div className="flex items-center gap-6 text-gray-500 text-sm mb-6">
                <div className="flex items-center gap-1">
                  <span>📍</span>
                  <span>{formData.location || t('profile_no_location')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>📅</span>
                  <span>
                    {t('profile_joined')} {new Date(userData?.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div>
                  <span className="text-2xl font-bold text-gray-900">
                    {userData?.connections?.length || 0}
                  </span>
                  <p className="text-gray-500 text-sm">{t('profile_connections')}</p>
                </div>
                <div>
                  <span className="text-2xl font-bold text-gray-900">23</span>
                  <p className="text-gray-500 text-sm">{t('profile_active_chats')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "overview" && <Overview formData={formData} setFormData={setFormData} userData={userData} />}

        {activeTab === "settings" && <Settings />}

        {activeTab === "privacy" && (
          <Privacy
            userData={userData}
            setUserData={setUserData}
            formData={formData}
            handleInputChange={handleInputChange}
            setFormData={setFormData} // Pass setFormData to Privacy
          />
        )}

        {activeTab === "account" && (
          <Account
            userData={userData}
            formData={formData}
            handleInputChange={handleInputChange}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;