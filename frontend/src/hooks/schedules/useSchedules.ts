import { useQuery } from "@tanstack/react-query";
import { getAllSchedules } from "../../services/slotsAndSchedulesService";
import type { ScheduleData } from "../../types";

export const useSchedule = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["schedules"],
    queryFn: getAllSchedules,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return {
    schedules: data as ScheduleData[],
    isLoading,
    error,
    refetch,
  };
};
