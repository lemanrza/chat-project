import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import endpoints from '@/services/api';
import controller from '@/services/commonRequest';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import type { UserData } from "@/types/profileType";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { addConnection } from "@/features/userSlice";
import {
  Search,
  Filter,
  Users,
  MessageCircle,
  MapPin,
  UserPlus,
  Clock,
  Check,
} from "lucide-react";

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const hobbiesList = [
  'Music', 'Sports', 'Travel', 'Reading', 'Gaming', 'Art', 'Cooking', 'Fitness', 'Movies', 'Tech', 'Photography', 'Writing', 'Fashion', 'Nature', 'DIY'
];
const countriesList = [
  'Azerbaijan', 'Turkey', 'Russia', 'USA', 'UK', 'Germany', 'France', 'Italy', 'Spain', 'China', 'Japan', 'India', 'Brazil', 'Canada', 'Australia'
];

const Feed = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("discover");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  const { t } = useTranslation();
  const reduxUser = useSelector((state: RootState) => state.user);
  const tabs: Tab[] = [
    {
      id: "discover",
      label: t("feed_tab_discover"),
      icon: <Search className="w-4 h-4" />,
    },
    {
      id: "trending",
      label: t("feed_tab_trending"),
      icon: <div className="w-4 h-4 flex items-center">📈</div>,
    },
    {
      id: "nearby",
      label: t("feed_tab_nearby"),
      icon: <MapPin className="w-4 h-4" />,
    },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!reduxUser.id) return;
        const response = await controller.getOne(endpoints.users, reduxUser.id)
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await controller.getAll(endpoints.users);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
    fetchUser();
  }, [navigate]);

  const currentUserId = reduxUser?.id;
  const filteredUsers = users
    .filter(user => user.id !== currentUserId)
    .filter(userData => {
      const matchesSearch =
        userData.profile?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        userData.profile?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        userData.profile?.location?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesHobbies =
        selectedHobbies.length === 0 ||
        (userData.hobbies && userData.hobbies.some(hobby => selectedHobbies.includes(hobby)));

      const matchesCountry =
        selectedCountries.length === 0 ||
        (userData.profile?.location && selectedCountries.includes(userData.profile.location));

      return matchesSearch && matchesHobbies && matchesCountry;
    });

  const handleConnect = async (targetUserId: string) => {
    try {
      if (!user) {
        enqueueSnackbar("User not loaded", {
          variant: "error",
          autoHideDuration: 2000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
        return;
      }

      // Check if already connected
      const userConnections = user.connections && Array.isArray(user.connections)
        ? user.connections.map(conn => typeof conn === 'string' ? conn : (conn as UserData).id)
        : [];

      const isAlreadyConnected = userConnections.includes(targetUserId);

      if (isAlreadyConnected) {
        enqueueSnackbar("Already connected with this user", {
          variant: "info",
          autoHideDuration: 2000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
        return;
      }

      const targetUserResponse = await controller.getOne(endpoints.users, targetUserId);
      const targetUser = targetUserResponse.data;

      if (!targetUser) {
        enqueueSnackbar("User not found", {
          variant: "error",
          autoHideDuration: 2000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
        return;
      }

      // Check if request already pending
      const targetUserConnectionRequests = Array.isArray(targetUser.connectionsRequests)
        ? targetUser.connectionsRequests.map((req: any) => typeof req === 'string' ? req : (req as UserData).id)
        : [];

      const isRequestPending = user.id ? targetUserConnectionRequests.includes(user.id) : false;

      if (isRequestPending) {
        enqueueSnackbar("Connection request is already pending", {
          variant: "info",
          autoHideDuration: 2000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
        return;
      }

      if (targetUser.profileVisibility === "private") {
        // For private profile, add to connectionsRequests
        const updatedConnectionsRequests = [...targetUserConnectionRequests, user.id];

        await controller.update(`${endpoints.users}/update`, targetUserId, {
          connectionsRequests: updatedConnectionsRequests,
        });

        enqueueSnackbar("Connection request sent! Waiting for approval.", {
          variant: "info",
          autoHideDuration: 3000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
      } else {
        // For public profile, connect both users immediately
        const targetUserConnections = Array.isArray(targetUser.connections)
          ? targetUser.connections.map((conn: any) => typeof conn === 'string' ? conn : (conn as UserData).id)
          : [];

        // Update target user's connections
        await controller.update(`${endpoints.users}/update`, targetUserId, {
          connections: [...targetUserConnections, user.id],
        });

        // Update current user's connections (check user.id exists)
        if (user.id) {
          await controller.update(`${endpoints.users}/update`, user.id, {
            connections: [...userConnections, targetUserId],
          });
        }

        enqueueSnackbar("Connected successfully!", {
          variant: "success",
          autoHideDuration: 2000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });

        // Update Redux state to reflect the new connection
        dispatch(addConnection(targetUserId));
      }
    } catch (error: any) {
      console.error("Error sending connection request:", error);

      let errorMessage = "Failed to send connection request";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = "User not found";
      } else if (error.response?.status === 401) {
        errorMessage = "Unauthorized: Please log in again";
        localStorage.removeItem("token");
        navigate("/auth/login");
      }

      enqueueSnackbar(errorMessage, {
        variant: "error",
        autoHideDuration: 2000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    }
  }

  const handleMessage = (userId: string) => {
    console.log("Messaging user:", userId);
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00B878] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">{t("feed_loading")}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00B878] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">{t("feed_loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex relative">
      <AnimatePresence>
        {showFilters && (
          <motion.aside
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 25 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm z-40 flex flex-col p-6 backdrop-blur-lg bg-white/80 dark:bg-neutral-900/70 border-l border-gray-200 dark:border-neutral-700 shadow-xl"
            style={{ boxShadow: '0 12px 32px rgba(0,0,0,0.15)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-[#00B878] dark:text-[#00E89E]">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-800 transition"
                aria-label="Close sidebar"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Hobbies Section */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 dark:text-white mb-3 text-base">Hobbies</h3>
              <div className="flex flex-wrap gap-2">
                {hobbiesList.map(hobby => (
                  <button
                    key={hobby}
                    onClick={() =>
                      setSelectedHobbies(
                        selectedHobbies.includes(hobby)
                          ? selectedHobbies.filter(h => h !== hobby)
                          : [...selectedHobbies, hobby]
                      )
                    }
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all shadow-sm ${selectedHobbies.includes(hobby)
                        ? 'bg-[#00B878] text-white border-[#00B878]'
                        : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-neutral-600 hover:bg-[#f1faf6] dark:hover:bg-neutral-700'
                      }`}
                  >
                    {hobby}
                  </button>
                ))}
              </div>
            </div>

            {/* Countries Section */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 dark:text-white mb-3 text-base">Countries</h3>
              <div className="flex flex-wrap gap-2">
                {countriesList.map(country => (
                  <button
                    key={country}
                    onClick={() =>
                      setSelectedCountries(
                        selectedCountries.includes(country)
                          ? selectedCountries.filter(c => c !== country)
                          : [...selectedCountries, country]
                      )
                    }
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all shadow-sm ${selectedCountries.includes(country)
                        ? 'bg-[#00B878] text-white border-[#00B878]'
                        : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-neutral-600 hover:bg-[#f1faf6] dark:hover:bg-neutral-700'
                      }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto flex gap-2 pt-4 border-t border-gray-200 dark:border-neutral-700">
              <button
                onClick={() => {
                  setSelectedHobbies([]);
                  setSelectedCountries([]);
                }}
                className="flex-1 py-3 rounded-lg bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-white font-medium hover:bg-gray-200 dark:hover:bg-neutral-700 transition"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 py-3 rounded-lg bg-[#00B878] text-white font-medium hover:bg-[#00a76d] transition"
              >
                Apply
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>


      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-8 py-8 rounded-t-2xl shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {t("feed_discover_title")}
              </h1>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                {t("feed_discover_subtitle")}
              </p>
            </div>
            <button
              style={{ backgroundColor: "#00B878" }}
              className="hover:brightness-110 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all font-medium text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-[#00B878] focus:ring-offset-2"
            >
              <Users className="w-4 h-4" style={{ color: "#fff" }} />
              {t("feed_create_group")}
            </button>
          </div>

          <div className="flex items-center gap-4 sm:gap-8 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                ${activeTab === tab.id
                    ? "shadow-md scale-105 text-[#00B878]"
                    : "bg-transparent text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-700"
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-2">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t("feed_search_placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg text-base border border-gray-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-700 dark:text-white focus:ring-2 focus:ring-green-400 focus:border-transparent focus:outline-none shadow-sm"
              />
            </div>
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium border border-gray-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-700 transition-all shadow-sm"
            >
              <Filter className="w-4 h-4" />
              {t("feed_filters")}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((userData) => {
              if (!user) return null;

              let userConnections: any = [];
              if (user.connections && Array.isArray(user.connections) && user.connections.length > 0) {
                userConnections = user.connections.filter(connection => connection != null).map(connection => typeof connection === 'string' ? connection : connection.id);
              }

              const isAlreadyConnected = userConnections.includes(userData.id);
              const targetUserConnectionRequests = Array.isArray(userData.connectionsRequests)
                ? userData.connectionsRequests.map((req) => (typeof req === 'string' ? req : (req as UserData).id))
                : [];

              const isRequestPending = user.id ? targetUserConnectionRequests.includes(user.id) : false;

              const handleConnectedClick = () => {
                enqueueSnackbar("You are already connected with this user", {
                  variant: "info",
                  autoHideDuration: 2000,
                  anchorOrigin: { vertical: "bottom", horizontal: "right" },
                });
              };

              const handlePendingClick = () => {
                enqueueSnackbar("Connection request is pending approval", {
                  variant: "info",
                  autoHideDuration: 2000,
                  anchorOrigin: { vertical: "bottom", horizontal: "right" },
                });
              };

              const isPublic = userData.profileVisibility === 'public';

              return (
                <div
                  key={userData.id}
                  className="rounded-2xl p-6 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 shadow-sm hover:shadow-lg transition-shadow duration-200 group relative"
                >
                  <div className="flex items-start mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden">
                        <img
                          className="rounded-full object-cover w-full h-full"
                          src={userData.profile?.avatar}
                          alt={userData.profile?.firstName}
                        />
                      </div>
                      {userData.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white dark:border-neutral-800 rounded-full" style={{ backgroundColor: "#00B878" }}></div>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1">
                      {userData.profile?.firstName} {userData.profile?.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-300 mb-3">
                      {userData.username}
                    </p>

                    <div className="space-y-1 mb-4">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{userData.profile?.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{t("feed_connections", { count: userData.connections.length })}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-300 mb-4 leading-relaxed">
                      {userData.profile?.bio}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {userData.hobbies?.map((interest, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm rounded-full font-medium bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-white"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="absolute top-5 right-3 px-5 py-2 text-sm font-medium text-white rounded-full"
                    style={{ backgroundColor: isPublic ? '#a8d08d' : '#2c6e49' }}
                  >
                    {isPublic ? 'Public' : 'Private'}
                  </div>

                  <div className="flex gap-3">
                    {isAlreadyConnected ? (
                      <button
                        onClick={handleConnectedClick}
                        className="flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 font-medium text-white bg-green-600 hover:bg-green-700 transition-colors cursor-pointer"
                      >
                        <Check /> {t("feed_connected")}
                      </button>
                    ) : isRequestPending ? (
                      <button
                        onClick={handlePendingClick}
                        className="flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors cursor-pointer"
                      >
                        <Clock /> {t("feed_pending")}
                      </button>
                    ) : (
                      <button
                        onClick={() => userData.id && handleConnect(userData.id)}
                        className="flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 font-medium text-white bg-[#00B878] hover:bg-[#00a76d] cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4" />
                        {t("feed_connect")}
                      </button>
                    )}
                    <button
                      onClick={() => userData.id && handleMessage(userData.id)}
                      className="flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 font-medium border border-gray-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-700 transition-all shadow"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {t("feed_message")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                {t("feed_no_users")}
              </h3>
              <p className="text-gray-500 dark:text-gray-300">{t("feed_no_users_sub")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

};

export default Feed;
