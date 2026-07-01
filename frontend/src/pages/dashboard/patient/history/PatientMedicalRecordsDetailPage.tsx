import { Calendar, Mail, Stethoscope, ClipboardList } from "lucide-react";
import GoBackButton from "../../../../components/shared/GoBackButton";
import UserInitials from "../../../../components/shared/UserInitials";
import SourceMedicalRecordAccordion from "../../../../components/dashboard/medical-records/SourceMedicalRecordAccordion";
import AnexxedMedicalRecordsAccordion from "../../../../components/dashboard/medical-records/AnexxedMedicalRecordsAccordion";
import { useGetMyDoctorById } from "../../../../hooks/medical-records/useGetMyDoctorById";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../../../../components/shared/LoadingSpinner";
import ErrorMessage from "../../../../components/shared/ErrorMessage";

export default function PatientMedicalRecordsDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useGetMyDoctorById(id as string);

  if (isLoading) return <LoadingSpinner />;

  if (error) return <ErrorMessage />;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Historial Médico</h2>
          <p className="text-gray-500 mt-1">
            Registros médicos con Dr. {data.myDoctor.full_name}
          </p>
        </div>
        <GoBackButton to="/dashboard/patient/history" />
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <UserInitials name={data.myDoctor.full_name} size="large" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-800">
                  Dr. {data.myDoctor.full_name}
                </h3>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Stethoscope className="w-4 h-4" />
                  <span className="text-sm font-medium text-gray-500">
                    {data.myDoctor.specialty.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="text-sm">{data.myDoctor.email}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full shrink-0">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">
                Citas: {data.appointmentsCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {data.medicalRecords.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden p-12">
          <div className="flex flex-col items-center gap-3 text-center">
            <ClipboardList className="w-12 h-12 text-gray-300" />
            <p className="text-gray-500 font-medium">
              No hay historias médicas registradas
            </p>
            <p className="text-sm text-gray-400">
              Aún no se ha creado ninguna historia clínica por este doctor
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {data.medicalRecords.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
            >
              <SourceMedicalRecordAccordion
                medicalRecord={record}
                detailRoute={`/dashboard/patient/history/records/${record.id}`}
              />
              <AnexxedMedicalRecordsAccordion
                annexes={record.annexes}
                detailRoutePrefix={`/dashboard/patient/history/annexe/`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
