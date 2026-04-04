import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getSlots, deleteSlotById, updateSlotById } from "../../services/slotsAndSchedulesService"
import { toast } from "react-toastify";
import type { SlotsData, Slot } from "../../types"
import { isAxiosError } from "axios"
import { useNavigate } from "react-router-dom"

export const useSlots = (page: number, limit: number, day?: string, date?: string) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["slots", page, limit, day, date],
        queryFn: () => getSlots(page, limit, day, date)
    })

    return {
        data: data as SlotsData,
        isLoading,
        error
    }

}

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
                console.log(error.response.data)
            }
        },
    })

    return {
        deleteSlotMutation,
        updateSlotMutation
    }
}