import { getMedicalRecordAnnexeById } from "../../services/medicalRecordsService";
import { useQuery } from "@tanstack/react-query";
import type { MedicalRecordAnnexe } from "../../types";

export const useGetMedicalRecordAnnexById = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["medical-record-annexe", id],
    queryFn: () => getMedicalRecordAnnexeById(id),
  });

  return { medicalRecordAnnex: data as MedicalRecordAnnexe, isLoading, error };
};
