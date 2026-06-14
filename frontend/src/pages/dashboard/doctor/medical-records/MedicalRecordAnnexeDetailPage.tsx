import { User } from "lucide-react";
import GoBackButton from "../../../../components/shared/GoBackButton";
import UserInitialts from "../../../../components/shared/UserInitials";
import MedicalRecordAnnexeDetailCard from "../../../../components/dashboard/medical-records/MedicalRecordAnnexeDetailCard";
import { Navigate, useParams } from "react-router-dom";
import { useGetMedicalRecordAnnexById } from "../../../../hooks/medical-records/useGetMedicalRecordAnnexeById";
import LoadingSpinner from "../../../../components/shared/LoadingSpinner";
import ErrorMessage from "../../../../components/shared/ErrorMessage";

export default function MedicalRecordAnnexeDetailPage() {
  const { id } = useParams();

  if (!id) return <Navigate to="/dashboard/doctor/patients" />;

  const { medicalRecordAnnex, isLoading, error } =
    useGetMedicalRecordAnnexById(id);

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <ErrorMessage
        message={error?.message || "Error al cargar la información"}
      />
    );

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Detalle de Anexo</h2>
          <p className="text-gray-500 mt-1">
            Información completa del anexo médico
          </p>
        </div>
        <GoBackButton
          to={`/dashboard/doctor/patients/${medicalRecordAnnex.medicalRecord.patient.id}`}
        />
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <UserInitialts
              name={medicalRecordAnnex.medicalRecord.patient.full_name}
              size="large"
            />
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {medicalRecordAnnex.medicalRecord.patient.full_name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1 text-gray-500">
                <User className="w-4 h-4" />
                <span className="text-sm">
                  {medicalRecordAnnex.medicalRecord.patient.age} años
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MedicalRecordAnnexeDetailCard annexe={medicalRecordAnnex} />
    </div>
  );
}
