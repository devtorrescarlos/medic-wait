import { useQuery } from "@tanstack/react-query";
import { getMyDoctorById } from "../../services/medicalRecordsService";
import type { MyDoctorByIdResponse } from "../../types";

export const useGetMyDoctorById = (doctorId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-doctor-by-id", doctorId],
    queryFn: () => getMyDoctorById(doctorId),
  });

  return {
    data: data as MyDoctorByIdResponse,
    isLoading,
    error,
  };
};
