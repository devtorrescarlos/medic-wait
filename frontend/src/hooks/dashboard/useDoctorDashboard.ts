import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { getAppointments } from "../../services/appointmentsService";
import { getUnreadCount } from "../../services/notificationsService";
import type { Appointment } from "../../types";

const today = format(new Date(), "yyyy-MM-dd");

export const useDoctorDashboard = () => {
  const { data: todayData, isLoading: todayLoading } = useQuery({
    queryKey: ["dashboard", "doctor", "today", today],
    queryFn: () => getAppointments(1, 50, undefined, today),
    refetchInterval: 30000,
  });

  const { data: pendingData, isLoading: pendingLoading } = useQuery({
    queryKey: ["dashboard", "doctor", "pending"],
    queryFn: () => getAppointments(1, 1, undefined, undefined, "pending"),
    refetchInterval: 30000,
  });

  const { data: unreadData, isLoading: unreadLoading } = useQuery({
    queryKey: ["dashboard", "doctor", "unread"],
    queryFn: () => getUnreadCount(),
    refetchInterval: 30000,
  });

  const todayAppointments: Appointment[] = todayData?.appointments ?? [];
  const totalToday = todayAppointments.length;
  const pendingToday = todayAppointments.filter((a) => a.status === "pending").length;
  const uniquePatientsToday = new Set(todayAppointments.map((a) => a.patient_id)).size;

  const nextAppointment = todayAppointments
    .filter((a) => a.status !== "cancelled")
    .sort((a, b) => a.slot.start_time.localeCompare(b.slot.start_time))[0] ?? null;

  const totalPending = pendingData?.totalItems ?? 0;
  const unreadCount = unreadData?.count ?? 0;

  return {
    todayAppointments,
    totalToday,
    pendingToday,
    uniquePatientsToday,
    nextAppointment,
    totalPending,
    unreadCount,
    isLoading: todayLoading || pendingLoading || unreadLoading,
  } as const;
};
