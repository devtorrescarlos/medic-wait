import { useParams } from "react-router-dom";
import { useGetPatientById } from "../../../../hooks/medical-records/useGetPatientById";
import LoadingSpinner from "../../../../components/shared/LoadingSpinner";
import ErrorMessage from "../../../../components/shared/ErrorMessage";
import GoBackButton from "../../../../components/shared/GoBackButton";
import { CalendarCheck } from "lucide-react";
import PatientInfoCard from "../../../../components/dashboard/medical-records/PatientInfoCard";
import MedicalRecordsSection from "../../../../components/dashboard/medical-records/MedicalRecordsSection";

export default function PatientsDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useGetPatientById(id!);

  if (isLoading) return <LoadingSpinner />;

  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Detalles del paciente
        </h1>
        <GoBackButton to="/dashboard/doctor/patients" />
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <PatientInfoCard data={data} />
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full shrink-0">
              <CalendarCheck className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">
                Citas completadas: {data.appointmentsCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <MedicalRecordsSection
          medicalRecords={data.medicalRecords}
          citaId={data.lastAppointment?.id!}
        />
      </div>
    </div>
  );
}
