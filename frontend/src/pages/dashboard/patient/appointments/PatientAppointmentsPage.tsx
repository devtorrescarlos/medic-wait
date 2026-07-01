import { usePatientAppointments } from "../../../../hooks/appointments/usePatientAppointments";
import PatientAppointmentsTable from "../../../../components/dashboard/appointments/PatientAppointmentsTable";
import LoadingSpinner from "../../../../components/shared/LoadingSpinner";
import { useAppointmentsFilters } from "../../../../hooks/appointments/useAppointmentsFilters";
import ErrorMessage from "../../../../components/shared/ErrorMessage";

export default function PatientAppointmentsPage() {
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
  const { data, isLoading, error } = usePatientAppointments(
    page,
    limit,
    patientFilter || undefined,
    dateFilter || undefined,
    statusFilter || undefined,
  );

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Mis Citas</h2>
        <p className="text-gray-500 mt-1">Visualiza tus citas agendadas</p>
      </div>

      {isLoading && data === undefined ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error.message} />
      ) : (
        <PatientAppointmentsTable
          data={data}
          page={page}
          dateFilter={dateFilter}
          handleDateFilterChange={handleDateFilter}
          doctorInput={patientInput}
          setDoctorInput={setPatientInput}
          statusFilter={statusFilter}
          handleStatusFilterChange={handleStatusFilter}
          handleCleanFilters={handleCleanFilters}
          handlePageChange={handlePageChange}
        />
      )}
    </div>
  );
}
