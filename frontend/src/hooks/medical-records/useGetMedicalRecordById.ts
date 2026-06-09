import { useQuery } from "@tanstack/react-query";
import { getMedicalRecordById } from "../../services/medicalRecordsService";
import type { MedicalRecord } from "../../types";

export const useGetMedicalRecordById = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["medicalRecord"],
    queryFn: () => getMedicalRecordById(id),
  });

  return {
    medicalRecord: data as MedicalRecord,
    isLoading,
    error,
  };
};
