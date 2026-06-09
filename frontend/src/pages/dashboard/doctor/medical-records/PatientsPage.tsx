import useGetPatients from "../../../../hooks/medical-records/useGetPatients";
import { Users } from "lucide-react";
import PatientsTable from "../../../../components/dashboard/medical-records/PatientsTable";
import LoadingSpinner from "../../../../components/shared/LoadingSpinner";
import ErrorMessage from "../../../../components/shared/ErrorMessage";
import { usePatientsFilters } from "../../../../hooks/medical-records/usePatientsFilters";

export default function PatientsPage() {
  const { nameFilter, emailFilter, limit, page, setPage } =
    usePatientsFilters();

  const { data, isLoading, error } = useGetPatients(
    page,
    limit,
    nameFilter,
    emailFilter,
  );

  if (isLoading) return <LoadingSpinner />;

  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <Users className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Mis Pacientes</h2>
          <p className="text-gray-500 mt-1">
            Lista de pacientes registrados en tu consulta
          </p>
        </div>
      </div>

      <PatientsTable data={data} page={page} setPage={setPage} />
    </div>
  );
}
