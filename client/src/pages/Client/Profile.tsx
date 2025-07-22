import { useState, useRef, useEffect } from "react";
import controller from "@/services/commonRequest";
import endpoints from "@/services/api";
import { enqueueSnackbar } from "notistack";
import Account from "@/components/Profile/Account";
import Privacy from "@/components/Profile/Privacy";
import Overview from "@/components/Profile/Overview";
import Navigation from "@/components/Profile/Navigation";
import Settings from "@/components/Profile/Settings";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    bio: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await controller.getOne(`${endpoints.users}/me`);
        setUserData(response.data);

        setFormData({
          firstName: response.data.profile?.firstName || "",
          lastName: response.data.profile?.lastName || "",
          email: response.data.email || "",
          location: response.data.profile?.location || "",
          bio: response.data.profile?.bio || "",
        });
      } catch (error: any) {
        console.error("Error fetching user data:", error);

        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log("Authentication failed, redirecting to login...");
          localStorage.removeItem("token");
          window.location.href = "/auth/login";
          return;
        }

        enqueueSnackbar("Failed to load user data", {
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
      enqueueSnackbar("Please select a valid image file (JPEG, PNG, or GIF)", {
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
      enqueueSnackbar("Image size must be less than 5MB", {
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

      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/me/upload-image`,
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

      enqueueSnackbar("Profile image updated successfully!", {
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

      enqueueSnackbar("Failed to upload image. Please try again.", {
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

  const handleSaveChanges = async () => {
    try {
      const updateData = {
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          location: formData.location,
          bio: formData.bio,
        },
        email: formData.email,
      };

      await controller.update(`${endpoints.users}/me`, "", updateData);
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
    }
  };

  const handleLogout = () => {
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
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Profile</h1>
          <button
            onClick={handleSaveChanges}
            className="text-white px-6 py-2 rounded-lg transition-colors"
            style={{ backgroundColor: "#00B878" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#00a76d")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#00B878")
            }
          >
            ✏ Save Changes
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-semibold overflow-hidden"
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
              <div
                className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                  isUploadingImage
                    ? "bg-blue-500 cursor-not-allowed"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={!isUploadingImage ? triggerFileInput : undefined}
                title={
                  isUploadingImage ? "Uploading..." : "Change profile picture"
                }
              >
                {isUploadingImage ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                ) : (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2L12 22M2 12L22 12" />
                  </svg>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-semibold text-gray-900 mb-1">
                {userData?.profile?.displayName ||
                  `${formData.firstName} ${formData.lastName}`}
              </h2>
              <p className="text-gray-500 mb-4">@{userData?.username}</p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {formData.bio || "No bio available"}
              </p>

              {/* Location and Join Date */}
              <div className="flex items-center gap-6 text-gray-500 text-sm mb-6">
                <div className="flex items-center gap-1">
                  <span>📍</span>
                  <span>{formData.location || "Location not set"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>📅</span>
                  <span>
                    Joined{" "}
                    {new Date(userData?.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8">
                <div>
                  <span className="text-2xl font-bold text-gray-900">
                    {userData?.connections?.length || 0}
                  </span>
                  <p className="text-gray-500 text-sm">Connections</p>
                </div>
                <div>
                  <span className="text-2xl font-bold text-gray-900">23</span>
                  <p className="text-gray-500 text-sm">Active Chats</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content */}
        {activeTab === "overview" && <Overview />}

        {activeTab === "settings" && <Settings />}

        {activeTab === "privacy" && <Privacy />}

        {activeTab === "account" && (
          <Account
            userData={userData}
            formData={formData}
            handleInputChange={handleInputChange}
            handleLogout={handleLogout}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
