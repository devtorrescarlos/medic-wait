import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import {
  markAsReadById,
  deleteNotificationById,
  markAllAsRead,
} from "../../services/notificationsService";
import { toast } from "react-toastify";

export const useNotificationsMutations = () => {
  const queryClient = useQueryClient();

  const markAsRead = useMutation({
    mutationFn: (id: string) => markAsReadById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Error al completar la cita";
      toast.error(message);
    },
  });

  const deleteNotification = useMutation({
    mutationFn: (id: string) => deleteNotificationById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Error al eliminar la notificación";
      toast.error(message);
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        "Error al marcar todas las notificaciones como leídas";
      toast.error(message);
    },
  });

  return {
    markAsRead,
    deleteNotification,
    markAllAsRead: markAllAsReadMutation,
  };
};
