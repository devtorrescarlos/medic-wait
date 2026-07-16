import { useParams } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { FileText, ChevronDown } from "lucide-react";
import ErrorMessage from "../../shared/ErrorMessage";
import MedicalRecordChatbot from "./MedicalRecordChatbot";
import { useMedicalRecordsMutations } from "../../../hooks/medical-records/useMedicalRecordsMutations";
import { useGetMedicalRecordById } from "../../../hooks/medical-records/useGetMedicalRecordById";
import type { MedicalRecordAnnexeData } from "../../../types";
import { ANNEXE_TYPES } from "../../../constants";

export default function MedicalRecordAnnexeForm() {
  const { createMedicalRecordAnnexeMutation } = useMedicalRecordsMutations();
  const { id } = useParams();
  const { medicalRecord } = useGetMedicalRecordById(id!);

  const methods = useForm<MedicalRecordAnnexeData>({
    defaultValues: {
      type: "",
      content: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;

  const handleOnSubmit = (data: MedicalRecordAnnexeData) => {
    if (!id) return;

    createMedicalRecordAnnexeMutation.mutate({
      medicalRecordId: id,
      data,
    });

    reset();
  };

  const annexeTypes = ANNEXE_TYPES;

  const context = medicalRecord
    ? {
        patientName: medicalRecord.patient?.full_name,
        patientAge: medicalRecord.patient?.age,
        existingDiagnosis: medicalRecord.initial_diagnosis,
        existingTreatment: medicalRecord.treatment_plan,
      }
    : undefined;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FormProvider {...methods}>
          <form
            className="lg:col-span-2 space-y-5 bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit"
            onSubmit={handleSubmit(handleOnSubmit)}
          >
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tipo de anexo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="type"
                  className="outline-none block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 appearance-none"
                  {...register("type", {
                    required: "El tipo de anexo es requerido",
                  })}
                >
                  <option value="">Selecciona un tipo</option>
                  {annexeTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              {errors.type && <ErrorMessage message={errors.type.message} />}
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contenido
              </label>
              <textarea
                id="content"
                rows={6}
                className="outline-none focus:ring-none block w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-y placeholder:text-gray-400"
                placeholder="Describe el contenido del anexo..."
                {...register("content", {
                  required: "El contenido es requerido",
                })}
              />
              {errors.content && (
                <ErrorMessage message={errors.content.message} />
              )}
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Guardar Anexo
            </button>
          </form>
        </FormProvider>
        <div className="lg:col-span-1">
          <MedicalRecordChatbot
            mode="annexe"
            context={context}
            onInsertContent={(text) => methods.setValue("content", text)}
          />
        </div>
      </div>
    </div>
  );
}
