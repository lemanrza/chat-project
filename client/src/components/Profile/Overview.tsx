import { Heart, MessageCircle, Settings, Shield, Users } from "lucide-react";
import { useState, useEffect } from "react";
import controller from "@/services/commonRequest";
import endpoints from "@/services/api";
import { enqueueSnackbar } from "notistack";
import type { ConnectionRequest } from "@/types/profileType";

interface OverviewProps {
  formData: {
    connections: string[];
    connectionsRequests: string[];
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  userData: any;
}

const Overview = ({ formData, setFormData, userData }: OverviewProps) => {
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  // Fetch details for users in connectionsRequests
  useEffect(() => {
    const fetchConnectionRequests = async () => {
      if (!formData.connectionsRequests.length) {
        setConnectionRequests([]);
        return;
      }

      setIsLoadingRequests(true);
      try {
        const requests = await Promise.all(
          formData.connectionsRequests.map(async (userId: string) => {
            const response = await controller.getOne(`${endpoints.users}/me`, userId);
            const user = response.data;
            return {
              id: user.id,
              firstName: user.profile?.firstName || "Unknown",
              lastName: user.profile?.lastName || "",
              avatar: user.profile?.avatar || "https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png",
            };
          })
        );
        setConnectionRequests(requests);
      } catch (error) {
        console.error("Error fetching connection requests:", error);
        enqueueSnackbar("Failed to load connection requests", {
          variant: "error",
          autoHideDuration: 2000,
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
        });
      } finally {
        setIsLoadingRequests(false);
      }
    };

    fetchConnectionRequests();
  }, [formData.connectionsRequests]);

  // Handle accepting a connection request
  const handleAcceptRequest = async (requestUserId: string) => {
    try {
      // Update current user's connections and connectionsRequests
      const updatedConnections = [...formData.connections, requestUserId];
      const updatedRequests = formData.connectionsRequests.filter((id: string) => id !== requestUserId);

      // Update current user's data in the backend
      await controller.update(`${endpoints.users}/${userData.id}`, "", {
        connections: updatedConnections,
        connectionsRequests: updatedRequests,
      });

      // Update the requesting user's connections to include current user
      const requestingUserResponse = await controller.getOne(`${endpoints.users}/${requestUserId}`);
      const requestingUser = requestingUserResponse.data;
      await controller.update(`${endpoints.users}/${requestUserId}`, "", {
        connections: [...(requestingUser.connections || []), userData.id],
      });

      // Update local state
      setFormData((prev: any) => ({
        ...prev,
        connections: updatedConnections,
        connectionsRequests: updatedRequests,
      }));

      enqueueSnackbar("Connection request accepted!", {
        variant: "success",
        autoHideDuration: 2000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    } catch (error) {
      console.error("Error accepting connection request:", error);
      enqueueSnackbar("Failed to accept connection request", {
        variant: "error",
        autoHideDuration: 2000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    }
  };

  // Handle rejecting a connection request
  const handleRejectRequest = async (requestUserId: string) => {
    try {
      // Remove the request from connectionsRequests
      const updatedRequests = formData.connectionsRequests.filter((id: string) => id !== requestUserId);

      // Update current user's data in the backend
      await controller.update(`${endpoints.users}/${userData.id}`, "", {
        connectionsRequests: updatedRequests,
      });

      // Update local state
      setFormData((prev: any) => ({
        ...prev,
        connectionsRequests: updatedRequests,
      }));

      enqueueSnackbar("Connection request rejected", {
        variant: "info",
        autoHideDuration: 2000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    } catch (error) {
      console.error("Error rejecting connection request:", error);
      enqueueSnackbar("Failed to reject connection request", {
        variant: "error",
        autoHideDuration: 2000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    }
  };

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#E6FAF3" }}>
              <MessageCircle size={24} style={{ color: "#00B878" }} />
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
              <div className="text-2xl font-bold text-gray-900">{formData.connections.length}</div>
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
      <div className="col-span-9">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: "#E6FAF3" }}>
              <MessageCircle size={24} style={{ color: "#00B878" }} />
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

      {/* Connection Requests */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Connection Requests</h3>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          {isLoadingRequests ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00B878] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading connection requests...</p>
            </div>
          ) : connectionRequests.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-600">No pending connection requests</p>
            </div>
          ) : (
            connectionRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={request.avatar}
                      alt={`${request.firstName} ${request.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {request.firstName} {request.lastName}
                    </div>
                    <div className="text-sm text-gray-500">Sent you a connection request</div>
                  </div>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleAcceptRequest(request.id)}
                    className="bg-[#00B878] text-white px-4 py-2 rounded-lg hover:bg-[#00a76d] focus:outline-none transition duration-200"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRejectRequest(request.id)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 focus:outline-none transition duration-200"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Overview;