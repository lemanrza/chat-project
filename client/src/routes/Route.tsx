import { type RouteObject } from "react-router-dom";
import Home from "../pages/Client/Home";
import NotFound from "../pages/Client/NotFound";
import ClientLayout from "../layout/ClientLayout";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import Feed from "../pages/Client/Feed";
import Chat from "../pages/Client/Chat";
import Profile from "../pages/Client/Profile";
import AuthLayout from "../layout/AuthLayout";




const ROUTES: RouteObject[] = [
    // client layout
    {
        element: <ClientLayout />,
        path: "/",
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "feed",
                element: <Feed />,
            },
            {
                path: "chat",
                element: <Chat />,
            },
            {
                path: "profile",
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
                path: "forgot-password",
                element: <ForgotPassword />,
            },
            {
                path: "reset-password/:token",
                element: <ResetPassword />,
            },

        ],
    },
    {
        path: "*",
        element: <NotFound />,
    },
];

export default ROUTES;
