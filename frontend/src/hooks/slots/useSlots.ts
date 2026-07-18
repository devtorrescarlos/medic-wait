import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getSlots } from "../../services/slotsAndSchedulesService";
import type { SlotsData } from "../../types";

export const useSlots = (
  page: number,
  limit: number,
  day?: string,
  date?: string,
  status?: string,
) => {
  const { data: slotsData, isLoading, error } = useQuery({
    queryKey: ["slots", page, limit, day, date, status],
    queryFn: () => getSlots(page, limit, day, date, status),
    placeholderData: keepPreviousData,
  });

  return {
    slotsData: slotsData as SlotsData,
    isLoading,
    error,
  };
};
