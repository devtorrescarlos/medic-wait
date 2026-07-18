import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import {
  markAsReadById,
  deleteNotificationById,
  markAllAsRead,
} from "../../services/notificationsService";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";

export const useNotificationsMutations = () => {
  const queryClient = useQueryClient();

  const markAsRead = useMutation({
    mutationFn: (id: string) => markAsReadById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Error al completar la cita",
        );
      }
    },
  });

  const deleteNotification = useMutation({
    mutationFn: (id: string) => deleteNotificationById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Error al eliminar la notificación",
        );
      }
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Error al marcar todas las notificaciones como leídas",
        );
      }
    },
  });

  return {
    markAsRead,
    deleteNotification,
    markAllAsRead: markAllAsReadMutation,
  };
};
