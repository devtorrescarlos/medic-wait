import { Link } from "react-router-dom";

type EmptyMedicalRecordsProps = {
  citaId: string;
};

export default function EmptyMedicalRecords({
  citaId,
}: EmptyMedicalRecordsProps) {
  return (
    <div className="p-6 text-center">
      <p className="text-gray-500">
        Aún no tienes historias clínicas, ve a la cita y llena la historia
        médica
      </p>

      <Link
        to={`/dashboard/doctor/appointments/${citaId}`}
        className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
      >
        Ir a la cita
      </Link>
    </div>
  );
}
