import { useAppointments } from "../../../../hooks/appointments/useAppointments";
import AppointmentsTable from "../../../../components/dashboard/appointments/AppointmentsTable";
import LoadingSpinner from "../../../../components/shared/LoadingSpinner";
import { useAppointmentsFilters } from "../../../../hooks/appointments/useAppointmentsFilters";
import ErrorMessage from "../../../../components/shared/ErrorMessage";

export default function AppointmentsPage() {
  const {
    page,
    limit,
    patientFilter,
    patientInput,
    setPatientInput,
    dateFilter,
    statusFilter,
    handleDateFilter,
    handleStatusFilter,
    handleCleanFilters,
    handlePageChange,
  } = useAppointmentsFilters();
  const { data, isLoading, error } = useAppointments(
    page,
    limit,
    patientFilter || undefined,
    dateFilter || undefined,
    statusFilter || undefined,
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

      <AppointmentsTable
        data={data}
        page={page}
        dateFilter={dateFilter}
        handleDateFilterChange={handleDateFilter}
        patientInput={patientInput}
        setPatientInput={setPatientInput}
        statusFilter={statusFilter}
        handleStatusFilterChange={handleStatusFilter}
        handleCleanFilters={handleCleanFilters}
        handlePageChange={handlePageChange}
      />
    </div>
  );
}
