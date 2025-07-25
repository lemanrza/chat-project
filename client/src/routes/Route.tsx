import { type RouteObject } from "react-router-dom";
import NotFound from "../pages/Client/NotFound";
import ClientLayout from "../layout/ClientLayout";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import Feed from "../pages/Client/Feed";
import Profile from "../pages/Client/Profile";
import AuthLayout from "../layout/AuthLayout";
import Welcome from "@/pages/Client/Welcome";
import AuthCallback from "@/pages/Auth/AuthCallback";
import EmailVerify from "@/pages/Auth/EmailVerify";
import Chat from "@/pages/Client/Chat";

const ROUTES: RouteObject[] = [
  // client layout
  {
    path: "/",
    element: <Welcome />,
  },
  {
    element: <ClientLayout />,
    children: [
      {
        path: "app/chat",
        element: <Chat />,
      },
      {
        path: "app/feed",
        element: <Feed />,
      },
      {
        path: "app/profile",
        element: <Profile />,
      },
    ],
  },
  // auth layout
  {
    element: <AuthLayout />,
    path: "/auth/",
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "email-verified",
        element: <EmailVerify />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password/:token",
        element: <ResetPassword />,
      },
      {
        path: "success/:token",
        element: <AuthCallback />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default ROUTES;
