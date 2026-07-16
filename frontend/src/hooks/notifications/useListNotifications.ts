import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listNotifications } from "../../services/notificationsService";
import type { NotificationsData } from "../../types";

export const useListNotifications = (page: number, limit: number) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["notifications", page, limit],
    queryFn: () => listNotifications(page, limit),
    placeholderData: keepPreviousData,
  });

  return { data: data as NotificationsData, isLoading, error };
};
