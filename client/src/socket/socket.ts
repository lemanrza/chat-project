import { io } from "socket.io-client";

const token = localStorage.getItem("token");

const socket = io(import.meta.env.VITE_SERVER_URL || "http://localhost:8080", {
  withCredentials: true,
  auth: {
    token: token,
  },
});

export default socket;
