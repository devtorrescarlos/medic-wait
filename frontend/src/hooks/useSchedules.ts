import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { deleteScheduleById, generateScheduleAndSlots, getAllSchedules, toggleSchedule, updateSchedule } from "../services/slotsAndSchedulesService"
import type { ScheduleData, ScheduleFormData } from "../types"
import { toast } from "react-toastify"
import { isAxiosError } from "axios"

export const useSchedulesMutations = () => {

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const generateScheduleAndSlotsMutation = useMutation({
        mutationFn: (data: ScheduleFormData) => generateScheduleAndSlots(data),
        onError: (error) => {
            if (isAxiosError(error) && error.response) {
                toast.error(error.response.data.message);
            }
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
            queryClient.invalidateQueries({ queryKey: ["slots"] });
            toast.success(data.message);
        }
    })

    const updateScheduleMutation = useMutation({
        mutationFn: ({ id, scheduleData }: { id: string, scheduleData: ScheduleFormData }) => updateSchedule(id, scheduleData),
        onError: (error) => {
            if (isAxiosError(error) && error.response) {
                toast.error(error.response.data.message);
            }
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
            queryClient.invalidateQueries({ queryKey: ["slots"] });
            toast.success(data.message);
            navigate("/dashboard/doctor/schedule");
        }
    })

    const deleteScheduleMutation = useMutation({
        mutationFn: (id: string) => deleteScheduleById(id),
        onError: (error) => {
            if (isAxiosError(error) && error.response) {
                toast.error(error.response.data.message);
            }
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
            queryClient.invalidateQueries({ queryKey: ["slots"] });
            toast.success(data.message);
        }
    })

    const toggleScheduleMutation = useMutation({
        mutationFn: (id: string) => toggleSchedule(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["schedules"] });
            await queryClient.cancelQueries({ queryKey: ["slots"] });

            const previousSchedules = queryClient.getQueryData(["schedules"]);

            queryClient.setQueryData(["schedules"], (old: ScheduleData[] | undefined) =>
                old?.map(schedule =>
                    schedule.id === id
                        ? { ...schedule, is_active: !schedule.is_active }
                        : schedule
                )
            );

            return { previousSchedules };
        },
        onError: (_err, _id, context) => {
            if (context?.previousSchedules) {
                queryClient.setQueryData(["schedules"], context.previousSchedules);
            }
            if (isAxiosError(_err) && _err.response) {
                toast.error(_err.response.data.message);
            }
        },
        onSuccess: (data) => {
            toast.success(data.message);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
        }
    })

    return {
        generateScheduleAndSlotsMutation,
        updateScheduleMutation,
        toggleScheduleMutation,
        deleteScheduleMutation
    }
}

export const useSchedule = () => {


    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["schedules"],
        queryFn: getAllSchedules,
        retry: 1,
        refetchOnWindowFocus: false

    })

    return {
        schedules: data as ScheduleData[],
        isLoading,
        error,
        refetch
    }
}