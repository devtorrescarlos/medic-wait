import { useQuery } from "@tanstack/react-query";
import { getAppointmentById } from "../../services/appointmentsService";
import type { Appointment } from "../../types";

export const useAppointmentById = (id: string) => {
  const { data: appointment, isLoading, error } = useQuery({
    queryKey: ["appointment", id],
    queryFn: () => getAppointmentById(id),
    refetchInterval: 30000,
  });

  return {
    appointment: appointment as Appointment,
    isLoading,
    error,
  };
};
