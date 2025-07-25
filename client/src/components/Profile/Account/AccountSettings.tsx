
import { useTranslation } from "react-i18next";
import type { UserData } from "@/types/profileType";

interface AccountSettingsProps {
  userData: UserData | null;
}

const AccountSettings = ({ userData }: AccountSettingsProps) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-neutral-700">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        {t("account.settingsTitle")}
      </h3>

      <div className="space-y-6">
        {/* Account Type */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              {t("account.accountTypeTitle")}
            </h4>
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              {userData?.provider === "local"
                ? t("account.accountTypeEmail")
                : userData?.provider === "google"
                  ? t("account.accountTypeGoogle")
                  : userData?.provider === "github"
                    ? t("account.accountTypeGithub")
                    : t("account.accountTypeStandard")}
            </p>
          </div>
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-sm font-medium rounded-full">
            {userData?.emailVerified ? t("account.verified") : t("account.unverified")}
          </span>
        </div>

        {/* Two-Factor Authentication */}
        <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-neutral-700 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              {t("account.twoFactorTitle")}
            </h4>
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              {t("account.twoFactorDesc")}
            </p>
          </div>
          <button className="px-4 py-2 bg-[#00B878] text-white rounded-lg hover:bg-[#00a76d] transition-colors text-sm font-medium">
            {t("account.enable2faBtn")}
          </button>
        </div>

        {/* Login Sessions */}
        <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-neutral-700 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              {t("account.loginSessionsTitle")}
            </h4>
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              {t("account.loginSessionsDesc")}
            </p>
          </div>
          <button className="px-4 py-2 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors text-sm font-medium">
            {t("account.viewSessionsBtn")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
