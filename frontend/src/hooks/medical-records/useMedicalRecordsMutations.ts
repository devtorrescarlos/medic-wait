import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import {
  createMedicalRecord,
  createMedicalRecordAnnexe,
} from "../../services/medicalRecordsService";
import { toast } from "react-toastify";
import type {
  MedicalRecordAnnexeData,
  MedicalRecordFormData,
} from "../../types";

export const useMedicalRecordsMutations = () => {
  const navigate = useNavigate();

  const createMedicalRecordMutation = useMutation({
    mutationFn: ({
      appointmentId,
      data,
    }: {
      appointmentId: string;
      data: MedicalRecordFormData;
    }) => createMedicalRecord(appointmentId, data),
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data.message || "Error al crear el registro médico",
        );
      }
    },
    onSuccess: () => {
      toast.success("Registro médico creado exitosamente");
    },
  });

  const createMedicalRecordAnnexeMutation = useMutation({
    mutationFn: ({
      medicalRecordId,
      data,
    }: {
      medicalRecordId: string;
      data: MedicalRecordAnnexeData;
    }) => createMedicalRecordAnnexe(medicalRecordId, data),
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message || "Error al crear el anexo");
      }
    },
    onSuccess: () => {
      toast.success("Anexo del registro médico creado exitosamente.");
      navigate(`/dashboard/doctor/patients`);
    },
  });

  return {
    createMedicalRecordMutation,
    createMedicalRecordAnnexeMutation,
  };
};
