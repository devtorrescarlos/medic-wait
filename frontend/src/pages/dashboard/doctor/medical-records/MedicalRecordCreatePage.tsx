import { Navigate, useParams } from "react-router-dom";
import GoBackButton from "../../../../components/shared/GoBackButton";
import MedicalRecordForm from "../../../../components/dashboard/medical-records/MedicalRecordForm";
import MedicalRecordChatbot from "../../../../components/dashboard/medical-records/MedicalRecordChatbot";

export default function MedicalRecordCreatePage() {
  const { id } = useParams();

  if (!id) {
    return <Navigate to="/dashboard/doctor/appointments" />;
  }

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
            <MedicalRecordForm />
          </div>
        </div>

        <div className="lg:col-span-1">
          <MedicalRecordChatbot />
        </div>
      </div>
    </div>
  );
}
