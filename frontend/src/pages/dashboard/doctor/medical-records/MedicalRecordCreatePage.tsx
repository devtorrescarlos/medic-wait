import { Navigate, useParams } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import GoBackButton from "../../../../components/shared/GoBackButton";
import MedicalRecordForm from "../../../../components/dashboard/medical-records/MedicalRecordForm";
import MedicalRecordChatbot from "../../../../components/dashboard/medical-records/MedicalRecordChatbot";
import { useAppointmentById } from "../../../../hooks/appointments/useAppointmentById";
import type { MedicalRecordFormData } from "../../../../types";
import LoadingSpinner from "../../../../components/shared/LoadingSpinner";

export default function MedicalRecordCreatePage() {
  const { id } = useParams();
  const { data: appointment, isLoading } = useAppointmentById(id!);
  const methods = useForm<MedicalRecordFormData>({
    defaultValues: {
      initial_diagnosis: "",
      treatment_plan: "",
    },
  });

  if (!id) {
    return <Navigate to="/dashboard/doctor/appointments" />;
  }

  if (isLoading) return <LoadingSpinner />;

  const context = appointment
    ? {
        patientName: appointment.patient?.full_name,
        patientAge: appointment.patient?.age,
        appointmentReason: appointment.reason,
      }
    : undefined;

  console.log(appointment);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Crear historia médica
        </h1>
        <p className="text-gray-600">
          Completa el formulario para registrar la historia médica del paciente
        </p>
      </div>

      <div className="w-fit">
        <GoBackButton to="/dashboard/doctor/appointments" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden p-6">
            <FormProvider {...methods}>
              <MedicalRecordForm />
            </FormProvider>
          </div>
        </div>

        <div className="lg:col-span-1">
          <MedicalRecordChatbot
            mode="create"
            context={context}
            onInsertDiagnosis={(text) =>
              methods.setValue("initial_diagnosis", text)
            }
            onInsertTreatment={(text) =>
              methods.setValue("treatment_plan", text)
            }
          />
        </div>
      </div>
    </div>
  );
}
