import { MessageCircle, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";

const Privacy = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          {t('privacy_settings', 'Privacy Settings')}
        </h3>

        {/* Profile Visibility */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Eye className="text-gray-600" size={20} />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {t('profile_visibility', 'Profile Visibility')}
                  </div>
                  <div className="text-sm text-gray-500">
                    {t('control_who_can_see_profile', 'Control who can see your profile')}
                  </div>
                </div>
              </div>
              <select className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="public">{t('public', 'Public')}</option>
                <option value="friends">{t('friends_only', 'Friends Only')}</option>
                <option value="private">{t('private', 'Private')}</option>
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
                  <div className="font-medium text-gray-900">
                    {t('message_privacy', 'Message Privacy')}
                  </div>
                  <div className="text-sm text-gray-500">
                    {t('control_who_can_send_messages', 'Control who can send you messages')}
                  </div>
                </div>
              </div>
              <select className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="everyone">{t('everyone', 'Everyone')}</option>
                <option value="friends">{t('friends_only', 'Friends Only')}</option>
                <option value="none">{t('no_one', 'No One')}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
