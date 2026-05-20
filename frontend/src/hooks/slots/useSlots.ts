import { useQuery } from "@tanstack/react-query"
import { getSlots } from "../../services/slotsAndSchedulesService"
import type { SlotsData } from "../../types"

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
