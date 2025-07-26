import endpoints from "@/services/api";
import controller from "@/services/commonRequest";
import { getUserIdFromToken } from "@/utils/auth";
import { LogOut, MessageCircle, Settings, User, Users, X } from "lucide-react";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    active: boolean;
    collapsed: boolean;
    className?: string;
    onClick?: () => void;
  }
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { t } = useTranslation();
  const SidebarItem: React.FC<SidebarItemProps & { to?: string }> = ({
    icon,
    label,
    active,
    collapsed,
    to,
    className = "",
    onClick,
  }) => {
    const handleClick = () => {
      if (onClick) {
        onClick();
      } else if (to) {
        navigate(to);
      }
    };

    return (
      <button
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${collapsed ? "justify-center" : ""
          } ${className}`}
        style={{
          backgroundColor: active ? "#00B878" : "transparent",
          color: active ? "#FFFFFF" : "#374151",
        }}
        onClick={handleClick}
        onMouseEnter={(e) => {
          if (!active) {
            e.currentTarget.style.backgroundColor = "#E5E7EB";
          }
        }}
        onMouseLeave={(e) => {
          if (!active) {
            e.currentTarget.style.backgroundColor = "transparent";
          }
        }}
      >
        {icon}
        {!collapsed && <span className="font-medium dark:text-white text-sm">{label}</span>}
      </button>
    );
  };
  const handleLogout = async () => {
    const userId = getUserIdFromToken();
    if (userId) {
      await controller.update(`${endpoints.users}/me`, userId, {
        isOnline: false,
      });
    }

    localStorage.removeItem("token");
    enqueueSnackbar("Logged out successfully", {
      variant: "success",
      autoHideDuration: 2000,
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right",
      },
    });
    window.location.href = "/auth/login";
  };

  return (
    <div
      className={`${sidebarCollapsed ? "w-16" : "w-64"
        } transition-all duration-300 bg-white border-r border-gray-300 flex-shrink-0  flex flex-col dark:bg-[#262626] dark:border-gray-700`} // Add dark background and border

    >
      {/* Sidebar Header */}
      <div className="p-4 border-b dark:border-gray-700" style={{ borderBottomColor: "#D1D5DB" }}>
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold dark:text-white">
                <span className="text-[#374151] dark:text-white">
                  {t("sidebar_title_main")}
                </span>
                <span className="text-[#22C55E]">
                  {t("sidebar_title_accent")}
                </span>
              </h2>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg transition-colors text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <X className="w-5 h-5 dark:text-white" />
          </button>

        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          <SidebarItem
            icon={<Users className="w-5 h-5 dark:text-white" />}
            label={t("sidebar_feed")}
            to="/app/feed"
            active={location.pathname === "/app/feed"}
            collapsed={sidebarCollapsed}
          />
          <SidebarItem
            icon={<MessageCircle className="w-5 h-5 dark:text-white" />}
            label={t("sidebar_chat")}
            to="/app/chat"
            active={location.pathname === "/app/chat"}
            collapsed={sidebarCollapsed}
          />
          <SidebarItem
            icon={<User className="w-5 h-5 dark:text-white" />}
            label={t("sidebar_profile")}
            to="/app/profile"
            active={location.pathname === "/app/profile"}
            collapsed={sidebarCollapsed}
          />
        </nav>
      </div>

      {/* Bottom Section - Settings and Logout */}
      <div className="p-4 border-t dark:border-gray-700" style={{ borderTopColor: "#D1D5DB" }}>
        <div className="space-y-2 ">
          <SidebarItem
            icon={<Settings className="w-5 h-5 dark:text-white" />}
            label={t("sidebar_settings")}
            active={false}
            collapsed={sidebarCollapsed}
            className="cursor-pointer"
            onClick={() => {
              navigate("/app/profile");
            }}
          />
          <button
            onClick={() => {
              handleLogout();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${sidebarCollapsed ? "justify-center" : ""
              }`}
            style={{ color: "#EF4444" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#FEE2E2";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <LogOut className="w-5 h-5 text-red-400" />
            {!sidebarCollapsed && (
              <div className="font-medium text-sm dark:text-white">{t("sidebar_logout")}</div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
