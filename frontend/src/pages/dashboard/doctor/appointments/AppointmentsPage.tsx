import { useAppointments } from "../../../../hooks/appointments/useAppointments";
import AppointmentsTable from "../../../../components/dashboard/appointments/AppointmentsTable";
import LoadingSpinner from "../../../../components/shared/LoadingSpinner";
import { useAppointmentsFilters } from "../../../../hooks/appointments/useAppointmentsFilters";
import ErrorMessage from "../../../../components/shared/ErrorMessage";

export default function AppointmentsPage() {
  const { page, setPage, dateFilter, patientInput, statusFilter, limit } =
    useAppointmentsFilters();
  const { data, isLoading, error } = useAppointments(
    page,
    limit,
    dateFilter,
    patientInput,
    statusFilter,
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Citas</h2>
        <p className="text-gray-500 mt-1">
          Administra las citas de tus pacientes
        </p>
      </div>

      <AppointmentsTable data={data} page={page} setPage={setPage} />
    </div>
  );
}
