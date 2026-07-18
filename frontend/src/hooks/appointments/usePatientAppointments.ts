import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAppointments } from "../../services/appointmentsService";
import type { AppointmentsData } from "../../types";

export const usePatientAppointments = (
  page: number,
  limit: number,
  doctor?: string,
  date?: string,
  status?: string,
) => {
  const { data: appointmentsData, isLoading, error } = useQuery({
    queryKey: ["patientAppointments", page, limit, doctor, date, status],
    queryFn: () =>
      getAppointments(page, limit, undefined, date, status, doctor),
    placeholderData: keepPreviousData,
  });

  return {
    appointmentsData: appointmentsData as AppointmentsData,
    isLoading,
    error,
  };
};
