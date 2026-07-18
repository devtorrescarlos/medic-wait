import { getDoctorById } from "../../services/doctorsService";
import { useQuery } from "@tanstack/react-query";
import type { DoctorByIdResponse } from "../../types";

export const useGetDoctorById = (id: string) => {
  const { data: doctorData, isLoading, error } = useQuery({
    queryKey: ["doctors", id],
    queryFn: () => getDoctorById(id),
  });

  return { doctorData: doctorData as DoctorByIdResponse, isLoading, error };
};
