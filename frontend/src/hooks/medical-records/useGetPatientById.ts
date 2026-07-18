import { useQuery } from "@tanstack/react-query";
import { getPatientById } from "../../services/medicalRecordsService";
import type { PatientByIdResponse } from "../../types";

export const useGetPatientById = (id: string) => {
  const { data: patientData, isLoading, error } = useQuery({
    queryKey: ["patient", id],
    queryFn: () => getPatientById(id),
  });
  return {
    patientData: patientData as PatientByIdResponse,
    isLoading,
    error,
  };
};
