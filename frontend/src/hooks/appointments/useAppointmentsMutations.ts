import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  cancelAppointmentById,
  confirmAppointmentById,
  completeAppointmentById,
  createAppointment,
} from "../../services/appointmentsService";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";

export const useAppointmentsMutations = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const completeAppointment = useMutation({
    mutationFn: (id: string) => completeAppointmentById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Cita completada");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Error al completar la cita",
        );
      }
    },
  });

  const cancelAppointment = useMutation({
    mutationFn: ({
      id,
      cancellation_reason,
    }: {
      id: string;
      cancellation_reason: string;
    }) => cancelAppointmentById(id, cancellation_reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Cita cancelada");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Error al cancelar la cita",
        );
      }
    },
  });

  const confirmAppointment = useMutation({
    mutationFn: (id: string) => confirmAppointmentById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Cita confirmada");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Error al confirmar la cita",
        );
      }
    },
  });

  const bookAppointment = useMutation({
    mutationFn: ({
      doctorId,
      slotId,
      reason,
    }: {
      doctorId: string;
      slotId: string;
      reason: string;
    }) => createAppointment(doctorId, slotId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      toast.success("Cita creada");
      navigate("/dashboard/patient/my-appointments");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Error al crear la cita");
      }
    },
  });

  return {
    completeAppointment,
    cancelAppointment,
    confirmAppointment,
    bookAppointment,
  };
};
