import { useState } from "react";
import { Bell } from "lucide-react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useListNotifications } from "../../hooks/notifications/useListNotifications";
import { useGetUnreadCount } from "../../hooks/notifications/useGetUnreadCount";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import NotificationCard from "./NotificationCard";
import { useNotificationsMutations } from "../../hooks/notifications/useNotificationsMutations";

export default function NotificationsBell() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { unreadCount, isLoading: isCountLoading } = useGetUnreadCount();
  const { notificationsData, isLoading, error } = useListNotifications(page, limit);
  const { markAllAsRead } = useNotificationsMutations();

  if (error) return <ErrorMessage message={error.message} />;

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  return (
    <Popover className="relative">
      <PopoverButton className="relative outline-gray-200 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
        <Bell size={24} />
        {!isCountLoading && unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </PopoverButton>
      <PopoverPanel className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-800">Notificaciones</p>
          <button
            onClick={handleMarkAllAsRead}
            disabled={markAllAsRead.isPending}
            className="text-[11px] font-medium text-gray-400 hover:text-gray-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Marcar todo como leído
          </button>
        </div>

        {isLoading && !notificationsData ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : notificationsData && notificationsData.notifications.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500">
            No tienes notificaciones pendientes
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
              {notificationsData.notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </div>

            <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 bg-gray-50/50">
              <button
                disabled={!notificationsData || page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="text-xs text-gray-500 font-medium hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                ← Anterior
              </button>
              <span className="text-xs text-gray-400">
                {notificationsData?.currentPage || 1} de {notificationsData?.totalPages || 1}
              </span>
              <button
                disabled={!notificationsData || page >= (notificationsData?.totalPages || 1)}
                onClick={() => setPage((p) => p + 1)}
                className="text-xs text-gray-500 font-medium hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Siguiente →
              </button>
            </div>
          </>
        )}
      </PopoverPanel>
    </Popover>
  );
}
