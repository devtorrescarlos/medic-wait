import { getDoctorById } from "../../services/doctorsService";
import { useQuery } from "@tanstack/react-query";
import type { DoctorByIdResponse } from "../../types";

export const useGetDoctorById = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["doctors", id],
    queryFn: () => getDoctorById(id),
  });

  return { data: data as DoctorByIdResponse, isLoading, error };
};
