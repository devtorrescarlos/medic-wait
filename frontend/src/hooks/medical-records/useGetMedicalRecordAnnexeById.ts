import { getMedicalRecordAnnexeById } from "../../services/medicalRecordsService";
import { useQuery } from "@tanstack/react-query";
import type { MedicalRecordAnnexe } from "../../types";

export const useGetMedicalRecordAnnexById = (id: string) => {
  const { data: medicalRecordAnnex, isLoading, error } = useQuery({
    queryKey: ["medical-record-annexe", id],
    queryFn: () => getMedicalRecordAnnexeById(id),
  });

  return { medicalRecordAnnex: medicalRecordAnnex as MedicalRecordAnnexe, isLoading, error };
};
