import { useQuery } from "@tanstack/react-query";
import { getPatientById } from "../../services/medicalRecordsService";
import type { PatientByIdResponse } from "../../types";

export const useGetPatientById = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["patient", id],
    queryFn: () => getPatientById(id),
  });
  return {
    data: data as PatientByIdResponse,
    isLoading,
    error,
  };
};
