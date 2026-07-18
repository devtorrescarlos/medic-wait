import { useQuery } from "@tanstack/react-query";
import { getMedicalRecordById } from "../../services/medicalRecordsService";
import type { MedicalRecord } from "../../types";

export const useGetMedicalRecordById = (id: string) => {
  const { data: medicalRecord, isLoading, error } = useQuery({
    queryKey: ["medicalRecord", id],
    queryFn: () => getMedicalRecordById(id),
  });

  return {
    medicalRecord: medicalRecord as MedicalRecord,
    isLoading,
    error,
  };
};
