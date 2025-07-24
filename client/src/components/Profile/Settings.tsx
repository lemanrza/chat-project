import { Sun, Bell, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Settings = () => {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check the saved preference from localStorage or default to light mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark'); // Apply dark mode
    } else {
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark'); // Apply light mode
    }
  };

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setSelectedLanguage(languageCode);
  };

  const getLanguageClass = (languageCode: string) => {
    return selectedLanguage === languageCode
      ? "border-2 border-[#00B878] bg-[#E6FAF3]"
      : "border border-gray-200 hover:border-gray-300";
  };
  return (
    <div className="space-y-8">
      {/* Language & Region */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Language & Region</h3>
        <div className="grid grid-cols-4 gap-4">
          <div
            className={`rounded-lg p-4 cursor-pointer ${getLanguageClass('en')}`}
            onClick={() => handleLanguageChange('en')}  // Change to English
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">US</span>
              <span className="text-sm text-gray-600">English</span>
            </div>
          </div>
          <div
            className={`rounded-lg p-4 cursor-pointer ${getLanguageClass('az')}`}
            onClick={() => handleLanguageChange('az')}  // Change to Azerbaijani
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">AZ</span>
              <span className="text-sm text-gray-600">Azərbaycan</span>
            </div>
          </div>
          <div
            className={`rounded-lg p-4 cursor-pointer ${getLanguageClass('ru')}`}
            onClick={() => handleLanguageChange('ru')}  // Change to Russian
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">RU</span>
              <span className="text-sm text-gray-600">Русский</span>
            </div>
          </div>
          <div
            className={`rounded-lg p-4 cursor-pointer ${getLanguageClass('tr')}`}
            onClick={() => handleLanguageChange('tr')}  // Change to Turkish
          >
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
                {/* Switch between Sun/Moon icons based on theme */}
                {isDarkMode ? (
                  <Moon className="text-gray-600" size={20} />
                ) : (
                  <Sun className="text-gray-600" size={20} />
                )}
              </div>
              <div>
                <div className="font-medium text-gray-900">Dark Mode</div>
                <div className="text-sm text-gray-500">
                  Switch between light and dark themes
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isDarkMode}
                onChange={handleThemeToggle} // Handle theme toggle on checkbox change
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00B878]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Notifications
        </h3>
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Bell className="text-gray-600" size={20} />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Message Notifications
                  </div>
                  <div className="text-sm text-gray-500">
                    Get notified when you receive new messages
                  </div>
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
                  <div className="font-medium text-gray-900">
                    Connection Requests
                  </div>
                  <div className="text-sm text-gray-500">
                    Get notified when someone wants to connect
                  </div>
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
                  <div className="text-sm text-gray-500">
                    Get notified about new features and updates
                  </div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
