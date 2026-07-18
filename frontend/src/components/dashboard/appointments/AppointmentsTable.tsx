import TableFilters from "../../shared/TableFilters";
import type { AppointmentsData } from "../../../types";
import AppointmentsCard from "./AppointmentsCard";
import Pagination from "../../shared/Pagination";
import { APPOINTMENT_STATUS_FILTER } from "../../../constants";

type AppointmentsTableProps = {
  appointmentsData: AppointmentsData;
  page: number;
  dateFilter: string;
  patientInput: string;
  statusFilter: string;
  handleDateFilterChange: (value: string) => void;
  setPatientInput: (value: string) => void;
  handleStatusFilterChange: (value: string) => void;
  handleCleanFilters: () => void;
  handlePageChange: (newPage: number) => void;
};

export default function AppointmentsTable({
  appointmentsData,
  page,
  dateFilter,
  patientInput,
  statusFilter,
  handleDateFilterChange,
  setPatientInput,
  handleStatusFilterChange,
  handleCleanFilters,
  handlePageChange,
}: AppointmentsTableProps) {
  const filters = [
    {
      label: "Fecha",
      type: "date" as const,
      value: dateFilter,
      onChange: handleDateFilterChange,
    },
    {
      label: "Paciente",
      type: "text" as const,
      placeholder: "Buscar por nombre o apellido",
      value: patientInput,
      onChange: setPatientInput,
    },
    {
      label: "Estado",
      type: "select" as const,
      value: statusFilter,
      onChange: handleStatusFilterChange,
      options: APPOINTMENT_STATUS_FILTER,
    },
  ];

  return (
    <div className="space-y-4">
      <TableFilters
        filters={filters}
        onClear={handleCleanFilters}
        showClearButton={true}
      />

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {appointmentsData.appointments.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            No se encontraron registros.
          </p>
        ) : (
          appointmentsData.appointments.map((appointment) => (
            <AppointmentsCard key={appointment.id} appointment={appointment} />
          ))
        )}
      </div>

      <Pagination
        page={page}
        totalPages={appointmentsData.totalPages}
        handlePageChange={handlePageChange}
        label="citas"
        totalItems={appointmentsData.totalItems}
      />
    </div>
  );
}
