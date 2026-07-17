import { useQuery } from "@tanstack/react-query";
import { getAppointmentById } from "../../services/appointmentsService";
import type { Appointment } from "../../types";

export const useAppointmentById = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["appointment", id],
    queryFn: () => getAppointmentById(id),
    refetchInterval: 30000,
  });

  return {
    data: data as Appointment,
    isLoading,
    error,
  };
};
