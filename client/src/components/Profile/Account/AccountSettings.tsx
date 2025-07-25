
import { useTranslation } from "react-i18next";
import type { UserData } from "@/types/profileType";

interface AccountSettingsProps {
  userData: UserData | null;
}

const AccountSettings = ({ userData }: AccountSettingsProps) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        {t("account.settingsTitle")}
      </h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">{t("account.accountTypeTitle")}</h4>
            <p className="text-sm text-gray-500">
              {userData?.provider === "local"
                ? t("account.accountTypeEmail")
                : userData?.provider === "google"
                ? t("account.accountTypeGoogle")
                : userData?.provider === "github"
                ? t("account.accountTypeGithub")
                : t("account.accountTypeStandard")}
            </p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
            {userData?.emailVerified ? t("account.verified") : t("account.unverified")}
          </span>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">
              {t("account.twoFactorTitle")}
            </h4>
            <p className="text-sm text-gray-500">
              {t("account.twoFactorDesc")}
            </p>
          </div>
          <button className="px-4 py-2 bg-[#00B878] text-white rounded-lg hover:bg-[#00a76d] transition-colors text-sm font-medium">
            {t("account.enable2faBtn")}
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">{t("account.loginSessionsTitle")}</h4>
            <p className="text-sm text-gray-500">
              {t("account.loginSessionsDesc")}
            </p>
          </div>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            {t("account.viewSessionsBtn")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
