import { useParams } from "react-router-dom";
import { Stethoscope, FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import type { MedicalRecordFormData } from "../../../types";
import ErrorMessage from "../../shared/ErrorMessage";
import { useMedicalRecordsMutations } from "../../../hooks/medical-records/useMedicalRecordsMutations";

export default function MedicalRecordForm() {
  const initialValues = {
    initial_diagnosis: "",
    treatment_plan: "",
  };

  const { createMedicalRecordMutation } = useMedicalRecordsMutations();
  const { id: appointmentId } = useParams();

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<MedicalRecordFormData>({
    defaultValues: initialValues,
  });

  const handleOnSubmit = (data: MedicalRecordFormData) => {
    if (!appointmentId) return;

    createMedicalRecordMutation.mutate({
      appointmentId: appointmentId as string,
      data,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="initial_diagnosis"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Diagnóstico inicial
        </label>
        <div className="relative">
          <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none">
            <Stethoscope className="h-5 w-5 text-gray-400" />
          </div>
          <textarea
            id="initial_diagnosis"
            rows={6}
            placeholder="Describe el diagnóstico inicial del paciente..."
            className="block w-full outline-none pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder:text-gray-400 resize-none"
            {...register("initial_diagnosis", {
              required: "El diagnóstico es requerido",
              minLength: {
                value: 50,
                message: "El diagnóstico debe tener al menos 50 caracteres",
              },
            })}
          />
          {errors.initial_diagnosis && (
            <ErrorMessage
              message={errors.initial_diagnosis.message as string}
            />
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="treatment_plan"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Plan de tratamiento
        </label>
        <div className="relative">
          <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none">
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <textarea
            id="treatment_plan"
            rows={8}
            placeholder="Describe el plan de tratamiento a seguir..."
            className="block w-full outline-none pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder:text-gray-400 resize-none"
            {...register("treatment_plan", {
              required: "El plan de tratamiento es requerido",
              minLength: {
                value: 50,
                message:
                  "El plan de tratamiento debe tener al menos 50 caracteres",
              },
            })}
          />
          {errors.treatment_plan && (
            <ErrorMessage message={errors.treatment_plan.message as string} />
          )}
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 cursor-pointer"
        >
          Guardar historia médica
        </button>
      </div>
    </form>
  );
}
