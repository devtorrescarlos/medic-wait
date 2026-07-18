import { getDoctors } from "../../services/doctorsService";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { DoctorsData } from "../../types";

export const useGetDoctors = (
  page: number,
  limit: number,
  name?: string,
  email?: string,
  specialty?: string,
) => {
  const { data: doctorsData, isLoading, error } = useQuery({
    queryKey: ["doctors", page, limit, name, email, specialty],
    queryFn: () => getDoctors(page, limit, name, email, specialty),
    placeholderData: keepPreviousData,
  });

  return { doctorsData: doctorsData as DoctorsData, isLoading, error };
};
