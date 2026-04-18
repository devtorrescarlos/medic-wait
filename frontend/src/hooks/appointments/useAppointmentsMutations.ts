import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { cancelAppointmentById, confirmAppointmentById, completeAppointmentById } from "../../services/appointmentsService";

export const useAppointmentsMutations = () => {
    const queryClient = useQueryClient();

    const completeAppointment = useMutation({
        mutationFn: (id: string) => completeAppointmentById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            toast.success("Cita completada");
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Error al completar la cita";
            toast.error(message);
        }
    });

    const cancelAppointment = useMutation({
        mutationFn: ({ id, cancellation_reason }: { id: string, cancellation_reason: string }) => cancelAppointmentById(id, cancellation_reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            toast.success("Cita cancelada");
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Error al cancelar la cita";
            toast.error(message);
        }
    });

    const confirmAppointment = useMutation({
        mutationFn: (id: string) => confirmAppointmentById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            toast.success("Cita confirmada");
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Error al confirmar la cita";
            toast.error(message);
        }
    });

    return {
        completeAppointment,
        cancelAppointment,
        confirmAppointment
    }
}