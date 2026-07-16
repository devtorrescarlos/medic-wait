import { createContext } from "react";

export interface WebSocketMessage {
  type: string;
  action?: string;
  appointmentId?: string;
  notificationId?: string;
  title?: string;
  message?: string;
}

export type NotificationContextType = {
  lastMessage: WebSocketMessage | null;
  isConnected: boolean;
};

export const NotificationContext =
  createContext<NotificationContextType | null>(null);
