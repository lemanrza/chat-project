import { Heart, MessageCircle, Settings, Shield, Users } from "lucide-react";
<<<<<<< HEAD
import { useTranslation } from "react-i18next";

const Overview = () => {
  const { t } = useTranslation();
=======
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
  const connectionRequests = userData?.connectionsRequests || [];
  if (connectionRequests.length > 0) {
    console.log("First connection request:", connectionRequests[0]);
    console.log(
      "First request keys:",
      Object.keys(connectionRequests[0] || {})
    );
  }
  console.log("formData:", formData);
  console.log("=== END DEBUG ===");

  // Handle accepting a connection request
  const handleAcceptRequest = async (requestUser: any) => {
    try {
      // Check for user ID in different possible locations
      const currentUserId = userData?.id || (userData as any)?._id;
      if (!currentUserId) {
        console.error("No user ID found in userData:", userData);
        enqueueSnackbar("User ID not found", {
          variant: "error",
          autoHideDuration: 2000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
        return;
      }

      console.log("Accepting connection request from:", requestUser);
      console.log("Current user ID:", currentUserId);

      // Get the request user ID from different possible locations
      const requestUserId = requestUser?.id || requestUser?._id || requestUser;

      // Use the new accept endpoint
      const response = await controller.post(
        `${endpoints.users}/me/${currentUserId}/connections/accept`,
        {
          requesterId: requestUserId,
        }
      );

      console.log("Accept response:", response);

      // Remove the request from connectionsRequests and add to connections
      const updatedRequests = connectionRequests.filter((req: any) => {
        const reqId = req?.id || req?._id || req;
        return reqId !== requestUserId;
      });

      // Update formData locally
      setFormData((prev) => ({
        ...prev,
        connections: [...prev.connections, requestUserId],
        connectionsRequests: updatedRequests.map(
          (req: any) => req?.id || req?._id || req
        ),
      }));

      enqueueSnackbar("Connection request accepted!", {
        variant: "success",
        autoHideDuration: 2000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    } catch (error: any) {
      console.error("Error accepting connection request:", error);
      console.error("Error details:", error.response?.data);
      enqueueSnackbar(
        error.response?.data?.message || "Failed to accept connection request",
        {
          variant: "error",
          autoHideDuration: 2000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        }
      );
    }
  };

  // Handle rejecting a connection request
  const handleRejectRequest = async (requestUser: any) => {
    try {
      // Check for user ID in different possible locations
      const currentUserId = userData?.id || (userData as any)?._id;
      if (!currentUserId) {
        console.error("No user ID found in userData:", userData);
        enqueueSnackbar("User ID not found", {
          variant: "error",
          autoHideDuration: 2000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
        return;
      }

      console.log("Rejecting connection request from:", requestUser);

      // Get the request user ID from different possible locations
      const requestUserId = requestUser?.id || requestUser?._id || requestUser;

      // Use the new reject endpoint
      const response = await controller.post(
        `${endpoints.users}/me/${currentUserId}/connections/reject`,
        {
          requesterId: requestUserId,
        }
      );

      console.log("Reject response:", response);

      // Remove the request from connectionsRequests
      const updatedRequests = connectionRequests.filter((req: any) => {
        const reqId = req?.id || req?._id || req;
        return reqId !== requestUserId;
      });

      const updatedRequestIds = updatedRequests.map(
        (req: any) => req?.id || req?._id || req
      );

      // Update formData locally
      setFormData((prev) => ({
        ...prev,
        connectionsRequests: updatedRequestIds,
      }));

      enqueueSnackbar("Connection request rejected", {
        variant: "info",
        autoHideDuration: 2000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    } catch (error: any) {
      console.error("Error rejecting connection request:", error);
      console.error("Error details:", error.response?.data);
      enqueueSnackbar(
        error.response?.data?.message || "Failed to reject connection request",
        {
          variant: "error",
          autoHideDuration: 2000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        }
      );
    }
  };

>>>>>>> 50fd8beca30dec3d2907d24344bf8e3dab4d58ec
  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "#E6FAF3" }}
            >
              <MessageCircle size={24} style={{ color: "#00B878" }} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">154</div>
              <div className="text-gray-500 text-sm">{t('overview_total_messages', 'Total Messages')}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
<<<<<<< HEAD
              <div className="text-2xl font-bold text-gray-900">47</div>
              <div className="text-gray-500 text-sm">{t('overview_connections', 'Connections')}</div>
=======
              <div className="text-2xl font-bold text-gray-900">
                {formData.connections.length}
              </div>
              <div className="text-gray-500 text-sm">Connections</div>
>>>>>>> 50fd8beca30dec3d2907d24344bf8e3dab4d58ec
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
              <div className="text-gray-500 text-sm">{t('overview_favorites', 'Favorites')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="col-span-9">
<<<<<<< HEAD
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('quick_actions', 'Quick Actions')}</h3>
=======
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
>>>>>>> 50fd8beca30dec3d2907d24344bf8e3dab4d58ec
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow cursor-pointer">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
              style={{ background: "#E6FAF3" }}
            >
              <MessageCircle size={24} style={{ color: "#00B878" }} />
            </div>
            <div className="font-medium text-gray-900 mb-1">{t('new_chat', 'New Chat')}</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="text-blue-600" size={24} />
            </div>
            <div className="font-medium text-gray-900 mb-1">{t('find_friends', 'Find Friends')}</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Settings className="text-purple-600" size={24} />
            </div>
            <div className="font-medium text-gray-900 mb-1">{t('preferences', 'Preferences')}</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Shield className="text-orange-600" size={24} />
            </div>
            <div className="font-medium text-gray-900 mb-1">{t('privacy', 'Privacy')}</div>
          </div>
        </div>
      </div>

      {/* Connection Requests */}
      <div className="mt-6">
<<<<<<< HEAD
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('connection_requests', 'Connection Requests')}</h3>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          {/* Sample Connection Request */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {/* Profile Picture */}
              <div className="w-10 h-10 rounded-full bg-gray-200"></div>
              <div>
                <div className="font-medium text-gray-900">John Doe</div>
                <div className="text-sm text-gray-500">{t('overview_sent_connection_request', 'Sent you a connection request')}</div>
              </div>
            </div>
            <div className="space-x-2">
              <button className="bg-[#00B878] text-white px-4 py-2 rounded-lg hover:bg-[#00a76d] focus:outline-none transition duration-200">
                {t('accept', 'Accept')}
              </button>
              <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 focus:outline-none transition duration-200">
                {t('reject', 'Reject')}
              </button>
            </div>
          </div>
=======
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Connection Requests
        </h3>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          {connectionRequests.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-600">No pending connection requests</p>
            </div>
          ) : (
            connectionRequests.map((request: any, index: number) => {
              console.log(
                "Processing connection request:",
                request,
                "Type:",
                typeof request
              );

              // Handle different data structures
              const requestId = request?.id || request?._id || request;
              let isUserObject = false;
              let firstName = "Unknown";
              let lastName = "";
              let avatar =
                "https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png";

              if (request && typeof request === "object") {
                isUserObject = true;
                // Try different property paths for name
                firstName =
                  request.firstName || request.profile?.firstName || "Unknown";
                lastName = request.lastName || request.profile?.lastName || "";
                avatar = request.avatar || request.profile?.avatar || avatar;
              }

              console.log("Rendering request:", {
                request,
                isUserObject,
                requestId,
                firstName,
                lastName,
              });

              return (
                <div
                  key={requestId || index}
                  className="flex items-center justify-between mb-4 last:mb-0"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img
                        src={avatar}
                        alt={`${firstName} ${lastName}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {isUserObject
                          ? `${firstName} ${lastName}`.trim()
                          : `User ID: ${requestId}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        Sent you a connection request
                      </div>
                    </div>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        console.log("Accept button clicked for:", request);
                        handleAcceptRequest(request);
                      }}
                      className="bg-[#00B878] text-white px-4 py-2 rounded-lg hover:bg-[#00a76d] focus:outline-none transition duration-200"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => {
                        console.log("Reject button clicked for:", request);
                        handleRejectRequest(request);
                      }}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 focus:outline-none transition duration-200"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })
          )}
>>>>>>> 50fd8beca30dec3d2907d24344bf8e3dab4d58ec
        </div>
      </div>
    </>
  );
};

export default Overview;
