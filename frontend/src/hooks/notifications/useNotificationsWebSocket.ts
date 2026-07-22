import useWebSocket, { ReadyState } from "react-use-websocket";

const SOCKET_URL = import.meta.env.VITE_API_URL
  .replace(/^https:\/\//, "wss://")
  .replace(/^http:\/\//, "ws://")
  .replace(/\/api$/, "/ws");

export default function useNotificationsWebSocket() {
  const token = localStorage.getItem("token");

  const { lastMessage, readyState } = useWebSocket(
    token ? `${SOCKET_URL}?token=${token}` : null,
    {
      share: true,
      shouldReconnect: () => !!localStorage.getItem("token"),
      reconnectAttempts: 5,
      reconnectInterval: 1000,
    },
  );

  return {
    lastMessage: lastMessage ? JSON.parse(lastMessage.data) : null,
    isConnected: readyState === ReadyState.OPEN,
  };
}
