import { useQuery } from "@tanstack/react-query";
import { getUnreadCount } from "../../services/notificationsService";

export const useGetUnreadCount = () => {
  const { data: countResponse, isLoading } = useQuery({
    queryKey: ["unread-count"],
    queryFn: () => getUnreadCount(),
  });

  return { unreadCount: countResponse?.count ?? 0, isLoading };
};
