import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";

const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:8080/ws";

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      return;
    }

    const ws = new WebSocket(`${wsUrl}?token=${token}`);

    ws.onopen = () => {
      console.log("Connected");
      setConnectionError(null);
      setSocket(ws);
    };

    ws.onclose = (event) => {
      console.log("WebSocket disconnected:", event.code, event.reason);
      setSocket(null);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnectionError("Failed to connect to game server");
    };

    return () => {
      ws.close();
    };
  }, [token, isAuthenticated]);

  return { socket, connectionError };
};
