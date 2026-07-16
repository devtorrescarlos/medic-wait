import { Paperclip, User } from "lucide-react";
import GoBackButton from "../../../../components/shared/GoBackButton";
import UserInitials from "../../../../components/shared/UserInitials";
import MedicalRecordDetailCard from "../../../../components/dashboard/medical-records/MedicalRecordDetailCard";
import { Navigate, useParams } from "react-router-dom";
import { useGetMedicalRecordById } from "../../../../hooks/medical-records/useGetMedicalRecordById";
import LoadingSpinner from "../../../../components/shared/LoadingSpinner";
import ErrorMessage from "../../../../components/shared/ErrorMessage";
import { formatDate } from "../../../../utils/datesAndTimeUtilities";

const TYPE_CONFIG: Record<string, { label: string; styles: string }> = {
  lab_result: {
    label: "Resultado de Laboratorio",
    styles: "bg-blue-50 text-blue-700 border-blue-200",
  },
  evolution: {
    label: "Evolución",
    styles: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  correction: {
    label: "Corrección",
    styles: "bg-amber-50 text-amber-700 border-amber-200",
  },
};

export default function MedicalRecordDetailPage() {
  const { id } = useParams();

  if (!id) return <Navigate to="/dashboard/patient/history" />;

  const { medicalRecord, isLoading, error } = useGetMedicalRecordById(id);

  if (isLoading) return <LoadingSpinner />;

  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Detalle de Historia Médica
          </h2>
          <p className="text-gray-500 mt-1">
            Información completa de la historia clínica
          </p>
        </div>
        <GoBackButton
          to={`/dashboard/patient/history/${medicalRecord.doctor_id}`}
        />
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <UserInitials name={medicalRecord.patient.full_name} size="large" />
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {medicalRecord.patient.full_name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1 text-gray-500">
                <User className="w-4 h-4" />
                <span className="text-sm">
                  {medicalRecord.patient.age} años
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MedicalRecordDetailCard medicalRecord={medicalRecord} />

      {medicalRecord.annexes.length > 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Paperclip className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-semibold text-gray-800">Anexos</h3>
              <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
                {medicalRecord.annexes.length}
              </span>
            </div>
          </div>
          <div className="p-6 space-y-6">
            {medicalRecord.annexes.map((annexe) => {
              const config = TYPE_CONFIG[annexe.type] ?? {
                label: annexe.type,
                styles: "bg-gray-50 text-gray-700 border-gray-200",
              };

              return (
                <div
                  key={annexe.id}
                  className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full border w-fit ${config.styles}`}
                    >
                      {config.label}
                    </span>
                    <span className="text-sm text-gray-400">
                      {formatDate(annexe.created_at)}
                    </span>
                  </div>
                  <p className="break-all text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {annexe.content}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
