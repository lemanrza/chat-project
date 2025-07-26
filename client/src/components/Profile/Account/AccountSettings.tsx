import type { UserData } from "@/types/profileType";
import { t } from "i18next";

interface AccountSettingsProps {
  userData: UserData | null;
}

const AccountSettings = ({ userData }: AccountSettingsProps) => {
  return (
    <div className="bg-white dark:bg-[#262626] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        {t("account_settings.title")}
      </h3>

      <div className="space-y-6">
        {/* Account Type Section */}
        <div className="flex items-center justify-between p-4 dark:border dark:border-gray-700 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              {t("account_settings.account_type")}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {
                userData?.provider === "local"
                  ? t("account_settings.providers.email")
                  : userData?.provider === "google"
                    ? t("account_settings.providers.google")
                    : userData?.provider === "github"
                      ? t("account_settings.providers.github")
                      : t("account_settings.providers.standard")
              }
            </p>
          </div>
          <span className="px-3 py-1 bg-green-100 dark:bg-[#00B878] text-green-800 dark:text-white text-sm font-medium rounded-full">
            {userData?.emailVerified ? t("account_settings.verified") : t("account_settings.unverified")}
          </span>
        </div>

        {/* Two-Factor Authentication Section */}
        <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              {t("account_settings.two_factor")}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("account_settings.two_factor_desc")}
            </p>
          </div>
          <button className="px-4 py-2 bg-[#00B878] text-white rounded-lg hover:bg-[#00a76d] transition-colors text-sm font-medium">
            {t("account_settings.enable_2fa")}
          </button>
        </div>

        {/* Login Sessions Section */}
        <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              {t("account_settings.sessions")}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("account_settings.sessions_desc")}
            </p>
          </div>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm font-medium">
            {t("account_settings.view_sessions")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
