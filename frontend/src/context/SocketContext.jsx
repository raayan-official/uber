import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_BASE_URL || "https://uber-3m2i.onrender.com";
export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(BASE_URL, {
      reconnectionAttempts: 5, // Retry 5 times before failing
      transports: ["websocket"], // Ensure WebSocket transport
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {});

    newSocket.on("disconnect", () => {});

    newSocket.on("connect_error", (err) => {
      console.error("⚠️ Socket connection error:", err.message);
    });

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
