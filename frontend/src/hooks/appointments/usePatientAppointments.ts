import { useQuery } from "@tanstack/react-query";
import { getAppointments } from "../../services/appointmentsService";
import type { AppointmentsData } from "../../types";

export const usePatientAppointments = (
  page: number,
  limit: number,
  doctor?: string,
  date?: string,
  status?: string,
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["patientAppointments", page, limit, doctor, date, status],
    queryFn: () => getAppointments(page, limit, undefined, date, status, doctor),
    refetchInterval: 3000,
  });

  return {
    data: data as AppointmentsData,
    isLoading,
    error,
  };
};
