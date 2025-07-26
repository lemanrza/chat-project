import { Heart, MessageCircle, Settings, Shield, Users } from "lucide-react";
import controller from "@/services/commonRequest";
import endpoints from "@/services/api";
import { enqueueSnackbar } from "notistack";
import type { UserData, FormData } from "@/types/profileType";

interface OverviewProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
}

const Overview = ({
  formData,
  setFormData,
  userData,
  setUserData,
}: OverviewProps) => {
  const connectionRequests = userData?.connectionsRequests || [];
  const connections = userData?.connections || [];

  const handleAcceptRequest = async (requestUser: any) => {
    try {
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

      const requestUserId = requestUser?.id || requestUser?._id || requestUser;

      await controller.post(
        `${endpoints.users}/me/${currentUserId}/connections/accept`,
        {
          requesterId: requestUserId,
        }
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

      setUserData((prev: any) => ({
        ...prev,
        connections: [...(prev.connections || []), requestUser],
        connectionsRequests: updatedRequests,
      }));

      enqueueSnackbar("Connection request accepted!", {
        variant: "success",
        autoHideDuration: 2000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    } catch (error: any) {
      console.error("Error accepting connection request:", error);
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

  const handleRejectRequest = async (requestUser: any) => {
    try {
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

      const requestUserId = requestUser?.id || requestUser?._id || requestUser;

      await controller.post(
        `${endpoints.users}/me/${currentUserId}/connections/reject`,
        {
          requesterId: requestUserId,
        }
      );

      const updatedRequests = connectionRequests.filter((req: any) => {
        const reqId = req?.id || req?._id || req;
        return reqId !== requestUserId;
      });

      const updatedRequestIds = updatedRequests.map(
        (req: any) => req?.id || req?._id || req
      );

      setFormData((prev) => ({
        ...prev,
        connectionsRequests: updatedRequestIds,
      }));

      setUserData((prev: any) => ({
        ...prev,
        connectionsRequests: updatedRequests,
      }));

      enqueueSnackbar("Connection request rejected", {
        variant: "info",
        autoHideDuration: 2000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    } catch (error: any) {
      console.error("Error rejecting connection request:", error);
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

  const handleRemoveConnection = async (connectionUser: any) => {
    try {
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

      const connectionUserId =
        connectionUser?.id || connectionUser?._id || connectionUser;

      await controller.deleteOne(
        `${endpoints.users}/me/${currentUserId}/connections`,
        connectionUserId
      );

      const updatedConnections = connections.filter((conn: any) => {
        const connId = conn?.id || conn?._id || conn;
        return connId !== connectionUserId;
      });

      setFormData((prev) => ({
        ...prev,
        connections: updatedConnections.map(
          (conn: any) => conn?.id || conn?._id || conn
        ),
      }));

      setUserData((prev: any) => ({
        ...prev,
        connections: updatedConnections,
      }));

      enqueueSnackbar("Connection removed successfully", {
        variant: "success",
        autoHideDuration: 2000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    } catch (error: any) {
      console.error("Error removing connection:", error);
      enqueueSnackbar(
        error.response?.data?.message || "Failed to remove connection",
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
        <div className="bg-white dark:bg-[#262626] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "#E6FAF3" }}
            >
              <MessageCircle size={24} style={{ color: "#00B878" }} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">154</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">Total Messages</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#262626] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formData.connections.length}
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">Connections</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#262626] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Heart className="text-purple-600" size={24} />
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
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-[#262626] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center hover:shadow-md transition-shadow cursor-pointer">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
              style={{ background: "#E6FAF3" }}
            >
              <MessageCircle size={24} style={{ color: "#00B878" }} />
            </div>
            <div className="font-medium text-gray-900 dark:text-white mb-1">New Chat</div>
          </div>

          <div className="bg-white dark:bg-[#262626] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="text-blue-600" size={24} />
            </div>
            <div className="font-medium text-gray-900 dark:text-white mb-1">Find Friends</div>
          </div>

          <div className="bg-white dark:bg-[#262626] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Settings className="text-purple-600" size={24} />
            </div>
            <div className="font-medium text-gray-900 dark:text-white mb-1">Preferences</div>
          </div>

          <div className="bg-white dark:bg-[#262626] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Shield className="text-orange-600" size={24} />
            </div>
            <div className="font-medium text-gray-900 dark:text-white mb-1">Privacy</div>
          </div>
        </div>
      </div>

      {/* Connection Requests */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Connection Requests
        </h3>
        <div className="bg-white dark:bg-[#262626] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          {connectionRequests.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-600 dark:text-gray-400">No pending connection requests</p>
            </div>
          ) : (
            connectionRequests.map((request: any, index: number) => {
              const requestId = request?.id || request?._id || request;
              let isUserObject = false;
              let firstName = "Unknown";
              let lastName = "";
              let avatar =
                "https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png";

              if (request && typeof request === "object") {
                isUserObject = true;
                firstName =
                  request.firstName || request.profile?.firstName || "Unknown";
                lastName = request.lastName || request.profile?.lastName || "";
                avatar = request.avatar || request.profile?.avatar || avatar;
              }

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
                      <div className="font-medium text-gray-900 dark:text-white">
                        {isUserObject
                          ? `${firstName} ${lastName}`.trim()
                          : `User ID: ${requestId}`}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Sent you a connection request
                      </div>
                    </div>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        handleAcceptRequest(request);
                      }}
                      className="bg-[#00B878] text-white px-4 py-2 rounded-lg hover:bg-[#00a76d] focus:outline-none transition duration-200"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => {
                        handleRejectRequest(request);
                      }}
                      className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 focus:outline-none transition duration-200"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* My Connections */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          My Connections
        </h3>
        <div className="bg-white dark:bg-[#262626] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          {connections.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-600 dark:text-gray-400">No connections yet</p>
            </div>
          ) : (
            connections.map((connection: any, index: number) => {
              const connectionId =
                connection?.id || connection?._id || connection;
              let isUserObject = false;
              let firstName = "Unknown";
              let lastName = "";
              let avatar =
                "https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png";

              if (connection && typeof connection === "object") {
                isUserObject = true;
                firstName =
                  connection.firstName ||
                  connection.profile?.firstName ||
                  "Unknown";
                lastName =
                  connection.lastName || connection.profile?.lastName || "";
                avatar =
                  connection.avatar || connection.profile?.avatar || avatar;
              }

              return (
                <div
                  key={connectionId || index}
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
                      <div className="font-medium text-gray-900 dark:text-white">
                        {isUserObject
                          ? `${firstName} ${lastName}`.trim()
                          : `User ID: ${connectionId}`}
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400">✓ Connected</div>
                    </div>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        handleRemoveConnection(connection);
                      }}
                      className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 hover:text-red-700 border border-red-200 hover:border-red-300 focus:outline-none transition duration-200"
                    >
                      Remove
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
