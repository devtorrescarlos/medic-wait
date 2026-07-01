import { getMyDoctors } from "../../services/medicalRecordsService";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { MyDoctorsResponse } from "../../types";

export const useGetMyDoctors = (
  page: number,
  limit: number,
  name?: string,
  email?: string,
  specialty?: string,
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["myDoctors", page, limit, name, email, specialty],
    queryFn: () => getMyDoctors(page, limit, name, email, specialty),
    placeholderData: keepPreviousData,
  });
  return { data: data as MyDoctorsResponse, isLoading, error };
};
