import { Settings, Shield, Link, User, MessageCircle, Users, Heart, Sun, Bell, Eye } from 'lucide-react'
import { useState } from 'react'

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview')
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded"></div>
            <span className="font-semibold text-xl">Chat <span className="text-green-500">Wave</span></span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <User size={20} />
              <span>Feed</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <MessageCircle size={20} />
              <span>Chat</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-green-600 bg-green-50 rounded-lg">
              <Users size={20} />
              <span>Profile</span>
              <div className="w-2 h-2 bg-green-500 rounded-full ml-auto"></div>
            </div>
          </div>
        </nav>

        {/* Bottom Navigation */}
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-2">
            <div className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <Settings size={20} />
              <span>Settings</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg">
              <span>↪</span>
              <span>Logout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Profile</h1>
          <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors">
            ✏ Save Changes
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                AJ
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L12 22M2 12L22 12" />
                </svg>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-semibold text-gray-900 mb-1">Alex Johnson</h2>
              <p className="text-gray-500 mb-4">@alexj_2024</p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Digital enthusiast, coffee lover, and ChatWave explorer! Always excited to connect with new people and share interesting conversations.
              </p>
              
              {/* Location and Join Date */}
              <div className="flex items-center gap-6 text-gray-500 text-sm mb-6">
                <div className="flex items-center gap-1">
                  <span>📍</span>
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>📅</span>
                  <span>Joined January 2024</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8">
                <div>
                  <span className="text-2xl font-bold text-gray-900">47</span>
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
        <div className="flex gap-1 mb-8">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg ${
              activeTab === 'overview' 
                ? 'bg-green-500 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <User size={16} />
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg ${
              activeTab === 'settings' 
                ? 'bg-green-500 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Settings size={16} />
            Settings
          </button>
          <button 
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg ${
              activeTab === 'privacy' 
                ? 'bg-green-500 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Shield size={16} />
            Privacy
          </button>
          <button 
            onClick={() => setActiveTab('account')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg ${
              activeTab === 'account' 
                ? 'bg-green-500 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Link size={16} />
            Account
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <MessageCircle className="text-green-600" size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">154</div>
                    <div className="text-gray-500 text-sm">Total Messages</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">47</div>
                    <div className="text-gray-500 text-sm">Connections</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Heart className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">12</div>
                    <div className="text-gray-500 text-sm">Favorites</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="text-green-600" size={24} />
                  </div>
                  <div className="font-medium text-gray-900 mb-1">New Chat</div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Users className="text-blue-600" size={24} />
                  </div>
                  <div className="font-medium text-gray-900 mb-1">Find Friends</div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Settings className="text-purple-600" size={24} />
                  </div>
                  <div className="font-medium text-gray-900 mb-1">Preferences</div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow cursor-pointer">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Shield className="text-orange-600" size={24} />
                  </div>
                  <div className="font-medium text-gray-900 mb-1">Privacy</div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8">
            {/* Language & Region */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Language & Region</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="border-2 border-green-500 bg-green-50 rounded-lg p-4 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">US</span>
                    <span className="text-sm text-gray-600">English</span>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">AZ</span>
                    <span className="text-sm text-gray-600">Azərbaycan</span>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">RU</span>
                    <span className="text-sm text-gray-600">Русский</span>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">TR</span>
                    <span className="text-sm text-gray-600">Türkçe</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Appearance */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h3>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Sun className="text-gray-600" size={20} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Dark Mode</div>
                      <div className="text-sm text-gray-500">Switch between light and dark themes</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Bell className="text-gray-600" size={20} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Message Notifications</div>
                        <div className="text-sm text-gray-500">Get notified when you receive new messages</div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Bell className="text-gray-600" size={20} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Connection Requests</div>
                        <div className="text-sm text-gray-500">Get notified when someone wants to connect</div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Bell className="text-gray-600" size={20} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">App Updates</div>
                        <div className="text-sm text-gray-500">Get notified about new features and updates</div>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Privacy Settings</h3>
              
              {/* Profile Visibility */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Eye className="text-gray-600" size={20} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Profile Visibility</div>
                        <div className="text-sm text-gray-500">Control who can see your profile</div>
                      </div>
                    </div>
                    <select className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option value="public">Public</option>
                      <option value="friends">Friends Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </div>

                {/* Message Privacy */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <MessageCircle className="text-gray-600" size={20} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Message Privacy</div>
                        <div className="text-sm text-gray-500">Control who can send you messages</div>
                      </div>
                    </div>
                    <select className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option value="everyone">Everyone</option>
                      <option value="friends">Friends Only</option>
                      <option value="none">No One</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="space-y-12">
            {/* Personal Information Section */}
            <div className="bg-white rounded-xl p-8 shadow-md border border-gray-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h3>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-base font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-base"
                    defaultValue="Alex Johnson"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-base"
                    defaultValue="alex.johnson@email.com"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-base"
                    defaultValue="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-base"
                    defaultValue="San Francisco, CA"
                  />
                </div>
              </div>
            </div>

            {/* Change Password Section */}
            <div className="bg-white rounded-xl p-8 shadow-md border border-gray-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-base font-medium text-gray-700">Current Password</label>
                  <input
                    type="password"
                    className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-base"
                    placeholder="Enter your current password"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-base"
                    placeholder="Enter your new password"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700">Confirm New Password</label>
                  <input
                    type="password"
                    className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-base"
                    placeholder="Confirm your new password"
                  />
                </div>
              </div>
              <button className="mt-6 bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors text-base">
                Update Password
              </button>
            </div>

            {/* Danger Zone Section */}
            <div className="bg-white rounded-xl p-8 shadow-md border border-gray-300">
              <h3 className="text-xl font-semibold text-red-500 mb-6">Danger Zone</h3>
              <div className="space-y-6">
                <button className="w-full bg-red-50 text-red-500 px-8 py-3 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-3 text-base">
                  <span>↪</span>
                  Sign Out
                </button>
                <button className="w-full bg-red-50 text-red-500 px-8 py-3 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-3 text-base">
                  <span>✖</span>
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile