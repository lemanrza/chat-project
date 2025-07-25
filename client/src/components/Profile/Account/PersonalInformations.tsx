import { useEffect, useState } from "react";
import {
  Coffee,
  Plane,
  Monitor,
  Laptop,
  Dog,
  Cat,
  Music,
  BookOpen,
  Dumbbell,
  ChefHat,
  Palette,
  Camera,
  Gamepad2,
  Mountain,
  Waves,
  TreePine,
  Theater,
  Pizza,
  FolderRoot as Football,
  Sprout,
  Guitar,
  Flame,
  ShoppingBasket as Basketball,
  Target,
  Home,
  Wine,
  Beer,
  Umbrella,
  Snowflake,
  Car,
  Tent,
  Film,
  Globe,
  Piano,
} from "lucide-react";
import { enqueueSnackbar } from "notistack";
import controller from "@/services/commonRequest";
import endpoints from "@/services/api";
import { getUserIdFromToken } from "@/utils/auth";
import axios from "axios";
import type { UserData, FormData } from "@/types/profileType";
import { useTranslation } from "react-i18next";

interface LocationData {
  id: string;
  city: string;
  country: string;
}

interface PersonalInformationsProps {
  formData: FormData;
  handleInputChange: (field: string, value: string) => void;
  userData: UserData | null;
}

const interests = [
  { name: "Coffee", icon: Coffee },
  { name: "Travel", icon: Plane },
  { name: "Netflix", icon: Monitor },
  { name: "Coding", icon: Laptop },
  { name: "Dogs", icon: Dog },
  { name: "Cats", icon: Cat },
  { name: "Music", icon: Music },
  { name: "Reading", icon: BookOpen },
  { name: "Fitness", icon: Dumbbell },
  { name: "Cooking", icon: ChefHat },
  { name: "Art", icon: Palette },
  { name: "Photo", icon: Camera },
  { name: "Gaming", icon: Gamepad2 },
  { name: "Hiking", icon: Mountain },
  { name: "Swimming", icon: Waves },
  { name: "Yoga", icon: TreePine },
  { name: "Theater", icon: Theater },
  { name: "Food", icon: Pizza },
  { name: "Sports", icon: Football },
  { name: "Garden", icon: Sprout },
  { name: "Guitar", icon: Guitar },
  { name: "Dancing", icon: Flame },
  { name: "Basketball", icon: Basketball },
  { name: "Soccer", icon: Target },
  { name: "Darts", icon: Target },
  { name: "Games", icon: Home },
  { name: "Wine", icon: Wine },
  { name: "Beer", icon: Beer },
  { name: "Beach", icon: Umbrella },
  { name: "Winter", icon: Snowflake },
  { name: "Cars", icon: Car },
  { name: "Comedy", icon: Tent },
  { name: "Movies", icon: Film },
  { name: "Tech", icon: Globe },
  { name: "Nature", icon: Globe },
  { name: "Piano", icon: Piano },
];

const PersonalInformations = ({
  formData,
  handleInputChange,
  userData,
}: PersonalInformationsProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [locationSearch, setLocationSearch] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const { t } = useTranslation();
  useEffect(() => {
    if (userData?.hobbies) {
      setSelectedHobbies(userData.hobbies);
    }
  }, [userData]);

  const handleLocationSearch = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const searchTerm = e.target.value;
    setLocationSearch(searchTerm);

    if (searchTerm.length > 1) {
      setIsSearching(true);
      try {
        const response = await axios.get(
          "https://6802fd740a99cb7408ead6e1.mockapi.io/cities/location",
          {
            params: { search: searchTerm },
          }
        );
        const locationData: LocationData[] = response.data.map((item: any) => ({
          id: item.id || Math.random().toString(),
          city: item.city || item.name || item.location,
          country: item.country || "Unknown",
        }));
        setLocations(locationData);
      } catch (error) {
        console.error("Error fetching locations:", error);
        enqueueSnackbar("Failed to fetch locations", {
          variant: "error",
          autoHideDuration: 2000,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      } finally {
        setIsSearching(false);
      }
    } else {
      setLocations([]);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      if (!isMinHobbiesSelected) {
        enqueueSnackbar("Please select at least 3 hobbies.", {
          variant: "error",
          autoHideDuration: 2000,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
        return;
      }
      const updateData = {
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          location: formData.location,
          bio: formData.bio,
          avatar: userData?.profile?.avatar,
        },
        email: formData.email,
        hobbies: selectedHobbies,
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

  const handleHobbyChange = (hobby: string) => {
    if (selectedHobbies.includes(hobby)) {
      setSelectedHobbies((prev) => prev.filter((h) => h !== hobby));
    } else {
      if (selectedHobbies.length < 5) {
        setSelectedHobbies((prev) => [...prev, hobby]);
      }
    }
  };

  const isMinHobbiesSelected = selectedHobbies.length >= 3;

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-neutral-700">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Personal Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("first_name", "First Name")}
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#00B878] focus:border-[#00B878] transition-colors"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            placeholder="Enter your first name"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("last_name", "Last Name")}
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#00B878] focus:border-[#00B878] transition-colors"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            placeholder="Enter your last name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#00B878] focus:border-[#00B878] transition-colors"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Enter your email address"
          />
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("username", "Username")}
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-gray-50 dark:bg-neutral-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            value={userData?.username || ""}
            disabled
            placeholder="Username cannot be changed"
          />
        </div>

        {/* Location */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("account.locationLabel", "Location")}
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#00B878] focus:border-[#00B878] transition-colors"
            value={locationSearch || formData.location}
            onChange={(e) => {
              handleInputChange("location", e.target.value);
              handleLocationSearch(e);
            }}
            placeholder="Search and select your location"
          />
          {isSearching && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {t("account.searching", "Searching...")}
            </div>
          )}
          {locations.length > 0 && (
            <ul className="bg-white dark:bg-neutral-900 shadow-md border border-gray-300 dark:border-neutral-700 mt-2 rounded-lg max-h-60 overflow-auto">
              {locations.map((location) => (
                <li
                  key={location.id}
                  className="px-4 py-2 cursor-pointer hover:bg-[#00B878] hover:text-white"
                  onClick={() => {
                    handleInputChange(
                      "location",
                      `${location.city}, ${location.country}`
                    );
                    setLocationSearch(`${location.city}, ${location.country}`);
                    setLocations([]);
                  }}
                >
                  {location.city}, {location.country}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Bio */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bio
          </label>
          <textarea
            className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-[#00B878] focus:border-[#00B878] transition-colors resize-none"
            rows={4}
            value={formData.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            placeholder="Tell us about yourself..."
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formData.bio.length}/{t("500_characters", "characters")}
          </p>
        </div>

        {/* Hobbies */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("account.hobbiesLabel", "Hobbies")}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {interests.map((interest) => {
              const IconComponent = interest.icon;
              const isChecked = selectedHobbies.includes(interest.name);
              const isDisabled = selectedHobbies.length >= 5 && !isChecked;

              return (
                <div key={interest.name} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={interest.name}
                    checked={isChecked}
                    disabled={isDisabled}
                    onChange={() => handleHobbyChange(interest.name)}
                    className="h-5 w-5 rounded border-gray-300 text-[#00B878] focus:ring-[#00B878] focus:ring-2 accent-[#00B878]"
                  />
                  <label
                    htmlFor={interest.name}
                    className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    <span className="mr-2">
                      <IconComponent size={16} className="inline" />
                    </span>
                    {interest.name}
                  </label>
                </div>
              );
            })}
          </div>
          {!isMinHobbiesSelected && (
            <p className="text-sm text-red-500 mt-2">
              {t("account.minHobbiesError", "Please select at least 3 hobbies.")}
            </p>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSaveChanges}
          disabled={isSaving}
          className={`px-3.5 py-2.5 rounded-lg font-medium transition-all duration-200 ${isSaving
              ? "bg-gray-400 dark:bg-neutral-700 cursor-not-allowed text-white"
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
              {t("saving", "Saving...")}
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
              {t("save_changes", "Save Changes")}
            </>
          )}
        </button>
      </div>
    </div>

  );
};

export default PersonalInformations;