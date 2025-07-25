import { Heart, MessageCircle, Settings, Shield, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import controller from "@/services/commonRequest";
import endpoints from "@/services/api";
import { enqueueSnackbar } from "notistack";
import type { UserData, FormData } from "@/types/profileType";

interface OverviewProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  userData: UserData | null;
}

const Overview = ({ formData, setFormData, userData }: OverviewProps) => {
  const { t } = useTranslation();

  const connectionRequests = userData?.connectionsRequests || [];

  const handleAcceptRequest = async (requestUser: any) => {
    try {
      const currentUserId = userData?.id || (userData as any)?._id;
      if (!currentUserId) {
        enqueueSnackbar(t("user_id_not_found", "User ID not found"), {
          variant: "error",
          autoHideDuration: 2000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
        return;
      }
      const requestUserId = requestUser?.id || requestUser?._id || requestUser;
      await controller.post(
        `${endpoints.users}/me/${currentUserId}/connections/accept`,
        { requesterId: requestUserId }
      );
      const updatedRequests = connectionRequests.filter((req: any) => {
        const reqId = req?.id || req?._id || req;
        return reqId !== requestUserId;
      });
      setFormData((prev) => ({
        ...prev,
        connections: [...prev.connections, requestUserId],
        connectionsRequests: updatedRequests.map(
          (req: any) => req?.id || req?._id || req
        ),
      }));
      enqueueSnackbar(
        t("connection_request_accepted", "Connection request accepted!"),
        {
          variant: "success",
          autoHideDuration: 2000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        }
      );
    } catch (error: any) {
      enqueueSnackbar(
        error.response?.data?.message ||
        t("failed_accept_connection", "Failed to accept connection request"),
        {
          variant: "error",
          autoHideDuration: 2000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        }
      );
    }
  };

  const handleRejectRequest = async (requestUser: any) => {
    try {
      const currentUserId = userData?.id || (userData as any)?._id;
      if (!currentUserId) {
        enqueueSnackbar(t("user_id_not_found", "User ID not found"), {
          variant: "error",
          autoHideDuration: 2000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
        return;
      }
      const requestUserId = requestUser?.id || requestUser?._id || requestUser;
      await controller.post(
        `${endpoints.users}/me/${currentUserId}/connections/reject`,
        { requesterId: requestUserId }
      );
      const updatedRequests = connectionRequests.filter((req: any) => {
        const reqId = req?.id || req?._id || req;
        return reqId !== requestUserId;
      });

      setFormData((prev) => ({
        ...prev,
        connectionsRequests: updatedRequests.map(
          (req: any) => req?.id || req?._id || req
        ),
      }));
      enqueueSnackbar(
        t("connection_request_rejected", "Connection request rejected"),
        {
          variant: "info",
          autoHideDuration: 2000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        }
      );
    } catch (error: any) {
      enqueueSnackbar(
        error.response?.data?.message ||
        t("failed_reject_connection", "Failed to reject connection request"),
        {
          variant: "error",
          autoHideDuration: 2000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        }
      );
    }
  };

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#E6FAF3" }}>
              <MessageCircle size={24} style={{ color: "#00B878" }} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">154</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">Total Messages</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-200/20 rounded-xl flex items-center justify-center">
              <Users className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{formData.connections.length}</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">{t("overview_connections", "Connections")}</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-200/20 rounded-xl flex items-center justify-center">
              <Heart className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">12</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">Favorites</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="col-span-9">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t("quick_actions", "Quick Actions")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: <MessageCircle size={24} style={{ color: "#00B878" }} />, label: "New Chat", bg: "#E6FAF3" },
            { icon: <Users className="text-blue-600 dark:text-blue-400" size={24} />, label: "Find Friends", bg: "bg-blue-100 dark:bg-blue-200/20" },
            { icon: <Settings className="text-purple-600 dark:text-purple-400" size={24} />, label: "Preferences", bg: "bg-purple-100 dark:bg-purple-200/20" },
            { icon: <Shield className="text-orange-600 dark:text-orange-400" size={24} />, label: "Privacy", bg: "bg-orange-100 dark:bg-orange-200/20" },
          ].map((action, index) => (
            <div
              key={index}
              className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-neutral-700 text-center hover:shadow-md transition-shadow cursor-pointer"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${action.bg ? action.bg : ""}`}
                style={action.bg.startsWith("#") ? { background: action.bg } : {}}
              >
                {action.icon}
              </div>
              <div className="font-medium text-gray-900 dark:text-white mb-1">{action.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Connection Requests */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t("connection_requests", "Connection Requests")}
        </h3>
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-neutral-700">
          {connectionRequests.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-600 dark:text-gray-400">
                {t("no_pending_connection_requests", "No pending connection requests")}
              </p>
            </div>
          ) : (
            connectionRequests.map((request: any, index: number) => {
              const requestId = request?.id || request?._id || request;
              let isUserObject = false;
              let firstName = "Unknown";
              let lastName = "";
              let avatar = "https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png";

              if (request && typeof request === "object") {
                isUserObject = true;
                firstName = request.firstName || request.profile?.firstName || "Unknown";
                lastName = request.lastName || request.profile?.lastName || "";
                avatar = request.avatar || request.profile?.avatar || avatar;
              }

              return (
                <div key={requestId || index} className="flex items-center justify-between mb-4 last:mb-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img
                        src={avatar}
                        alt={`${firstName} ${lastName}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {isUserObject ? `${firstName} ${lastName}`.trim() : `User ID: ${requestId}`}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {t("overview_sent_connection_request", "Sent you a connection request")}
                      </div>
                    </div>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleAcceptRequest(request)}
                      className="bg-[#00B878] text-white px-4 py-2 rounded-lg hover:bg-[#00a76d] focus:outline-none transition duration-200"
                    >
                      {t("accept", "Accept")}
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request)}
                      className="bg-gray-300 dark:bg-neutral-700 dark:text-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-neutral-600 focus:outline-none transition duration-200"
                    >
                      {t("reject", "Reject")}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Overview;
