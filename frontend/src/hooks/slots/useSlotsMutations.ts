import { isAxiosError } from "axios"
import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteSlotById, updateSlotById } from "../../services/slotsAndSchedulesService"
import { toast } from "react-toastify"
import type { Slot } from "../../types"

export const useSlotsMutations = () => {

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const deleteSlotMutation = useMutation({
        mutationFn: (id: string) => deleteSlotById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["slots"] })
            toast.success("Horario eliminado correctamente")
        },
        onError: (error: any) => {
            if (isAxiosError(error) && error.response) {
                toast.error(error.response.data.message);
            }
        },
    })

    const updateSlotMutation = useMutation({
        mutationFn: ({ id, slotData }: { id: string, slotData: Slot }) => updateSlotById(id, slotData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["slots"] })
            toast.success("Horario actualizado correctamente")
            navigate("/dashboard/doctor/slots")
        },
        onError: (error: any) => {
            if (isAxiosError(error) && error.response) {
                toast.error(error.response.data.message);
            }
        },
    })

    return {
        deleteSlotMutation,
        updateSlotMutation
    }
}