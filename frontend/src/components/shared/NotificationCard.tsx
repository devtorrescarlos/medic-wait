import { useNavigate } from "react-router-dom";
import { Bell, Trash2 } from "lucide-react";
import type { Notification } from "../../types";
import { timeAgo } from "../../utils/datesAndTimeUtilities";
import { useNotificationsMutations } from "../../hooks/notifications/useNotificationsMutations";
import { useAuth } from "../../hooks/auth/useAuth";
import { NOTIFICATION_ICON } from "../../constants";

export default function NotificationCard({
  notification,
}: {
  notification: Notification;
}) {
  const navigate = useNavigate();
  const { role } = useAuth();
  const { markAsRead, deleteNotification } = useNotificationsMutations();
  const config = NOTIFICATION_ICON[notification.type];
  const Icon = config?.icon || Bell;

  const handleCardClick = () => {
    if (
      !notification.reference_id ||
      notification.reference_type !== "appointment"
    )
      return;
    const basePath =
      role === "doctor"
        ? "/dashboard/doctor/appointments"
        : "/dashboard/patient/my-appointments";
    navigate(`${basePath}/${notification.reference_id}`);
  };

  const handleMarkAsRead = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    markAsRead.mutate(id);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteNotification.mutate(id);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
        !notification.is_read ? "bg-blue-50/40" : ""
      }`}
    >
      <div
        className={`shrink-0 mt-0.5 w-8 h-8 rounded-full flex items-center justify-center ${config?.bg || "bg-gray-100"}`}
      >
        <Icon size={16} className={config?.color || "text-gray-500"} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-sm truncate ${!notification.is_read ? "font-semibold text-gray-900" : "text-gray-800"}`}
          >
            {notification.title}
          </p>

          {!notification.is_read && (
            <span className="shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
          )}
        </div>

        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
          {notification.message}
        </p>

        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-gray-400">
            {timeAgo(notification.created_at)}
          </p>

          <div className="flex items-center gap-1">
            {!notification.is_read && (
              <button
                onClick={(e) => handleMarkAsRead(e, notification.id)}
                className="text-[11px] font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
              >
                Marcar leído
              </button>
            )}
            <button
              onClick={(e) => handleDelete(e, notification.id)}
              className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
