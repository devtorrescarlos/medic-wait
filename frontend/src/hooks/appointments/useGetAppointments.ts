import { useQuery } from "@tanstack/react-query";
import { getAppointments } from "../../services/appointmentsService";
import type { AppointmentsData } from "../../types";

export const useAppointments = (
  page: number,
  limit: number,
  patient?: string,
  date?: string,
  status?: string,
) => {
  const { data: appointmentsData, isLoading, error } = useQuery({
    queryKey: ["appointments", page, limit, patient, date, status],
    queryFn: () => getAppointments(page, limit, patient, date, status),
    refetchInterval: 30000,
  });

  return {
    appointmentsData: appointmentsData as AppointmentsData,
    isLoading,
    error,
  };
};
