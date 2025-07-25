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
        {!collapsed && <span className="font-medium text-sm">{label}</span>}
      </button>
    );
  };
  const handleLogout = async () => {
    try {
      const userId = getUserIdFromToken(); // JWT token-dən userId-ni çıxar

      if (userId) {
        // İstifadəçini offline et
        await controller.update(`${endpoints.users}/me`, userId, {
          isOnline: false,
        });
      }

      // Tokeni təmizlə
      localStorage.removeItem("token");

      // Uğurlu çıxış bildirişi
      enqueueSnackbar("Logged out successfully", {
        variant: "success",
        autoHideDuration: 2000,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });

      // Login səhifəsinə yönləndir
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Logout failed:", error);
      enqueueSnackbar("Something went wrong during logout.", {
        variant: "error",
        autoHideDuration: 2000,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    }
  };


  return (
    <div
      className={`${sidebarCollapsed ? "w-16" : "w-64"
        } transition-all duration-300 flex-shrink-0 flex flex-col bg-gray-50 dark:bg-neutral-900 border-r border-gray-300 dark:border-neutral-700`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-300 dark:border-neutral-700">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">
                <span className="text-gray-800 dark:text-white">
                  {t("sidebar_title_main")}
                </span>
                <span className="text-green-500">
                  {t("sidebar_title_accent")}
                </span>
              </h2>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          <SidebarItem
            icon={<Users className="w-5 h-5" />}
            label={t("sidebar_feed")}
            to="/app/feed"
            active={location.pathname === "/app/feed"}
            collapsed={sidebarCollapsed}
          />
          <SidebarItem
            icon={<MessageCircle className="w-5 h-5" />}
            label={t("sidebar_chat")}
            to="/app/chat"
            active={location.pathname === "/app/chat"}
            collapsed={sidebarCollapsed}
          />
          <SidebarItem
            icon={<User className="w-5 h-5" />}
            label={t("sidebar_profile")}
            to="/app/profile"
            active={location.pathname === "/app/profile"}
            collapsed={sidebarCollapsed}
          />
        </nav>
      </div>

      {/* Bottom Section - Settings and Logout */}
      <div className="p-4 border-t border-gray-300 dark:border-neutral-700">
        <div className="space-y-2">
          <SidebarItem
            icon={<Settings className="w-5 h-5" />}
            label={t("sidebar_settings")}
            active={false}
            collapsed={sidebarCollapsed}
            className="cursor-pointer"
            onClick={() => {
              navigate("/app/profile");
            }}
          />
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition-colors cursor-pointer ${sidebarCollapsed ? "justify-center" : ""
              }`}
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && (
              <div className="font-medium text-sm">{t("sidebar_logout")}</div>
            )}
          </button>
        </div>
      </div>
    </div>

  );
};

export default Sidebar;
