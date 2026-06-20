import { getDoctors } from "../../services/slotsAndSchedulesService";
import { useQuery } from "@tanstack/react-query";
import type { DoctorsData } from "../../types";

export const useGetDoctors = (
  page: number,
  limit: number,
  name?: string,
  email?: string,
  specialty?: string,
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["doctors", page, limit, name, email, specialty],
    queryFn: () => getDoctors(page, limit, name, email, specialty),
  });

  return { data: data as DoctorsData, isLoading, error };
};
