import { useQuery } from "@tanstack/react-query";
import { getUnreadCount } from "../../services/notificationsService";

export const useGetUnreadCount = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["unread-count"],
    queryFn: () => getUnreadCount(),
  });

  return { unreadCount: data?.count ?? 0, isLoading };
};
