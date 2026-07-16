import { useQuery } from "@tanstack/react-query";
import { getAppointments } from "../../services/appointmentsService";
import { getMyDoctors } from "../../services/medicalRecordsService";
import { getUnreadCount } from "../../services/notificationsService";
import type { Appointment, Doctor } from "../../types";

export const usePatientDashboard = () => {
  const { data: appointmentsData, isLoading: appointmentsLoading } = useQuery({
    queryKey: ["dashboard", "patient", "appointments"],
    queryFn: () => getAppointments(1, 50),
    refetchInterval: 30000,
  });

  const { data: pendingData, isLoading: pendingLoading } = useQuery({
    queryKey: ["dashboard", "patient", "pending"],
    queryFn: () => getAppointments(1, 1, undefined, undefined, "pending"),
    refetchInterval: 30000,
  });

  const { data: doctorsData, isLoading: doctorsLoading } = useQuery({
    queryKey: ["dashboard", "patient", "doctors"],
    queryFn: () => getMyDoctors(1, 5),
    refetchInterval: 30000,
  });

  const { data: unreadData, isLoading: unreadLoading } = useQuery({
    queryKey: ["dashboard", "patient", "unread"],
    queryFn: () => getUnreadCount(),
    refetchInterval: 30000,
  });

  const allAppointments: Appointment[] = appointmentsData?.appointments ?? [];
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  const upcomingAppointments = allAppointments
    .filter((a) => a.status !== "cancelled")
    .filter((a) => a.slot.date >= todayStr)
    .sort((a, b) => {
      const dateCmp = a.slot.date.localeCompare(b.slot.date);
      if (dateCmp !== 0) return dateCmp;
      return a.slot.start_time.localeCompare(b.slot.start_time);
    });

  const pendingAppointments = allAppointments.filter((a) => a.status === "pending");

  const uniqueDoctorsCount = new Set(allAppointments.map((a) => a.doctor_id)).size;
  const totalPending = pendingData?.totalItems ?? 0;
  const unreadCount = unreadData?.count ?? 0;
  const nextAppointment = upcomingAppointments[0] ?? null;
  const recentDoctors: Doctor[] = doctorsData?.doctors ?? [];

  return {
    upcomingAppointments,
    pendingAppointments,
    allAppointments,
    totalPending,
    uniqueDoctorsCount,
    nextAppointment,
    recentDoctors,
    unreadCount,
    isLoading: appointmentsLoading || pendingLoading || doctorsLoading || unreadLoading,
  } as const;
};
