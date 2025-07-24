import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Users, MessageCircle, MapPin, UserPlus } from 'lucide-react';
import endpoints from '@/services/api';
import controller from '@/services/commonRequest';
import type { UserData } from '@/types/profileType';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import type { UserState } from '@/features/userSlice';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const Feed = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user) as UserState;

  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);


  const { t, i18n } = useTranslation();
  const tabs: Tab[] = [
    { id: 'discover', label: t('feed_tab_discover'), icon: <Search className="w-4 h-4" /> },
    { id: 'trending', label: t('feed_tab_trending'), icon: <div className="w-4 h-4 flex items-center">📈</div> },
    { id: 'nearby', label: t('feed_tab_nearby'), icon: <MapPin className="w-4 h-4" /> },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user.token) {
        console.log("User not authenticated, redirecting to login");
        navigate('/auth/login');
        return;
      }
      try {
        setLoading(true);
        const response = await controller.getAll(endpoints.users);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [user.isAuthenticated, user.token, navigate]);

  const filteredUsers = users.filter(userData =>
    userData.profile?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    userData.profile?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    userData.profile?.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle connection request logic
  const handleConnect = async (userId: string) => {
    try {
      const isAlreadyConnected = user.connections.includes(userId);
      const isRequestPending = user.connectionsRequests.includes(userId);

      if (isAlreadyConnected) {
        console.log("Already connected with this user");
        return;
      }

      if (isRequestPending) {
        console.log("Connection request is already pending");
        return;
      }

      // Send connection request (set it in connectionsRequests)
      await controller.update(`${endpoints.users}/${user.id}`, "", {
        connectionsRequests: [...user.connectionsRequests, userId],
      });

      enqueueSnackbar("Connection request sent!", {
        variant: "success",
        autoHideDuration: 2000,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    } catch (error) {
      console.error("Error sending connection request:", error);
      enqueueSnackbar("Failed to send connection request", {
        variant: "error",
        autoHideDuration: 2000,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    }
  };

  const handleMessage = (userId: string) => {
    console.log('Messaging user:', userId);
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00B878] mx-auto mb-4"></div>
          <p className="text-gray-600">{t('feed_loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-8 py-8 rounded-t-2xl shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: '#374151' }}>
                {t('feed_discover_title')}
              </h1>
              <p className="mt-2 text-base" style={{ color: '#6B7280' }}>
                {t('feed_discover_subtitle')}
              </p>
            </div>
            <button
              style={{ backgroundColor: '#00B878' }}
              className="hover:brightness-110 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all font-medium text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-[#00B878] focus:ring-offset-2"
            >
              <Users className="w-4 h-4" style={{ color: '#fff' }} />
              {t('feed_create_group')}
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-4 sm:gap-8 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                  ${activeTab === tab.id
                    ? 'shadow-md scale-105 text-[#00B878]'
                    : 'bg-transparent text-gray-700 hover:bg-gray-100'
                  }`}
                style={activeTab === tab.id ? { backgroundColor: '#00B878' } : {}}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('feed_search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg text-base border border-gray-200 bg-white text-gray-700 focus:ring-2 focus:ring-green-400 focus:border-transparent focus:outline-none shadow-sm"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 hover:text-green-600 transition-all shadow-sm"
            >
              <Filter className="w-4 h-4" />
              {t('feed_filters')}
            </button>
          </div>
        </div>

        {/* User Grid */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => {
              const isAlreadyConnected = user.connections.includes(user.id);
              const isRequestPending = user.connectionsRequests?.includes(user.id);

              return (
                <div
                  key={user.id}
                  className="rounded-2xl p-6 bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-200 group"
                >
                  {/* User Avatar and Status */}
                  <div className="flex items-start mb-4">
                    <div className="relative">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform duration-200"
                        style={{ backgroundColor: '#00B878' }}
                      >
                        <img className="rounded-full" src={user.profile?.avatar} alt={user.profile?.firstName} />
                      </div>
                      {user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full" style={{ backgroundColor: '#00B878' }}></div>
                      )}
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="mb-6">
                    <h3 className="font-bold text-lg mb-1" style={{ color: '#374151' }}>
                      {user.profile?.firstName} {user.profile?.lastName}
                    </h3>
                    <p className="text-sm mb-3" style={{ color: '#6B7280' }}>
                      {user.username}
                    </p>

                    {/* Location and Connections */}
                    <div className="space-y-1 mb-4">
                      <div className="flex items-center text-sm" style={{ color: '#6B7280' }}>
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{user.profile?.location}</span>
                      </div>
                      <div className="flex items-center text-sm" style={{ color: '#6B7280' }}>
                        <Users className="w-4 h-4 mr-2" />
                        <span>{t('feed_connections', { count: user.connections.length })}</span>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-sm mb-4 leading-relaxed" style={{ color: '#6B7280' }}>
                      {user.profile?.bio}
                    </p>

                    {/* Interests */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {user.hobbies?.map((interest, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm rounded-full font-medium"
                          style={{
                            backgroundColor: '#F3F4F6',
                            color: '#374151'
                          }}
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {isAlreadyConnected ? (
                      <button
                        disabled
                        className="flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 font-medium text-white bg-green-600 cursor-not-allowed"
                      >
                        {t('feed_connected')}
                      </button>
                    ) : isRequestPending ? (
                      <button
                        disabled
                        className="flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 font-medium text-white bg-gray-400 cursor-not-allowed"
                      >
                        {t('feed_pending')}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleConnect(user.id)}
                        className="flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 font-medium text-white bg-[#00B878] hover:bg-[#00a76d] cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4" style={{ color: '#fff' }} />
                        {t('feed_connect')}
                      </button>
                    )}
                    <button
                      onClick={() => handleMessage(user.id)}
                      className="flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 hover:text-green-600 transition-all shadow"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {t('feed_message')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4" style={{ color: '#6B7280' }} />
              <h3 className="text-lg font-medium mb-2" style={{ color: '#374151' }}>
                {t('feed_no_users')}
              </h3>
              <p style={{ color: '#6B7280' }}>
                {t('feed_no_users_sub')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
