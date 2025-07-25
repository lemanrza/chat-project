import { t } from "i18next";
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
      document.documentElement.classList.add('dark');
    } else {
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-black mb-4">
          {t("settings_language_region", "Language & Region")}
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {["en", "az", "ru", "tr"].map((lang) => (
            <div
              key={lang}
              className={`rounded-lg p-4 cursor-pointer bg-gray-50 dark:bg-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-600 transition ${getLanguageClass(lang)}`}
              onClick={() => handleLanguageChange(lang)}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {t(`settings_language_${lang}`, lang.toUpperCase())}
                </span>
                <span className="text-sm text-gray-600 dark:text-neutral-300">
                  {t(`settings_language_${lang}_full`)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-black mb-4">
          {t("settings_appearance", "Appearance")}
        </h3>
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-neutral-700 rounded-xl flex items-center justify-center">
                {isDarkMode ? (
                  <Moon className="text-gray-600 dark:text-neutral-300" size={20} />
                ) : (
                  <Sun className="text-gray-600 dark:text-neutral-300" size={20} />
                )}
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {t("settings_dark_mode", "Dark Mode")}
                </div>
                <div className="text-sm text-gray-500 dark:text-neutral-400">
                  {t("settings_dark_mode_description", "Switch between light and dark themes")}
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isDarkMode}
                onChange={handleThemeToggle}
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-neutral-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-neutral-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00B878]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-black mb-4">
          {t("settings_notifications", "Notifications")}
        </h3>
        <div className="space-y-4">
          {[
            {
              title: "settings_message_notifications",
              desc: "settings_message_notifications_desc",
            },
            {
              title: "settings_connection_requests",
              desc: "settings_connection_requests_desc",
            },
            {
              title: "settings_app_updates",
              desc: "settings_app_updates_desc",
              defaultChecked: true,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-neutral-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-neutral-700 rounded-xl flex items-center justify-center">
                    <Bell className="text-gray-600 dark:text-neutral-300" size={20} />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {t(item.title)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-neutral-400">
                      {t(item.desc)}
                    </div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked={item.defaultChecked}
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-neutral-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-neutral-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  );
};

export default Settings;
