import { type ReactNode, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useNotificationsWebSocket from "../hooks/notifications/useNotificationsWebSocket";
import { NotificationContext } from "./NotificationContext";

const TOAST_MAP: Record<string, "info" | "success" | "warning"> = {
  created: "info",
  confirmed: "success",
  cancelled: "warning",
  completed: "success",
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { lastMessage, isConnected } = useNotificationsWebSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!lastMessage || lastMessage.type !== "appointment_update") return;

    const action = lastMessage.action || "";

    toast(lastMessage.title || "", {
      type: TOAST_MAP[action] || "info",
      autoClose: 5000,
    });

    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    queryClient.invalidateQueries({ queryKey: ["appointments"] });
  }, [lastMessage, queryClient]);

  return (
    <NotificationContext.Provider value={{ lastMessage, isConnected }}>
      {children}
    </NotificationContext.Provider>
  );
};
