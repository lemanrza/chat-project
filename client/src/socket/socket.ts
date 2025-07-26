import { io } from "socket.io-client";

const createSocket = () => {
  const token = localStorage.getItem("token");

  return io(import.meta.env.VITE_SERVER_URL || "http://localhost:8080", {
    withCredentials: true,
    autoConnect: false,
    auth: {
      token: token,
    },
  });
};

const socket = createSocket();

export const reconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }

  const token = localStorage.getItem("token");
  socket.auth = { token };
  socket.connect();
};

export default socket;
