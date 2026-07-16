import TableFilters from "../../shared/TableFilters";
import type { AppointmentsData } from "../../../types";
import PatientAppointmentsCard from "./PatientAppointmentsCard";
import Pagination from "../../shared/Pagination";
import { APPOINTMENT_STATUS_FILTER } from "../../../constants";

type PatientAppointmentsTableProps = {
  data: AppointmentsData;
  page: number;
  dateFilter: string;
  doctorInput: string;
  statusFilter: string;
  handleDateFilterChange: (value: string) => void;
  setDoctorInput: (value: string) => void;
  handleStatusFilterChange: (value: string) => void;
  handleCleanFilters: () => void;
  handlePageChange: (newPage: number) => void;
};

export default function PatientAppointmentsTable({
  data,
  page,
  dateFilter,
  doctorInput,
  statusFilter,
  handleDateFilterChange,
  setDoctorInput,
  handleStatusFilterChange,
  handleCleanFilters,
  handlePageChange,
}: PatientAppointmentsTableProps) {
  const filters = [
    {
      label: "Fecha",
      type: "date" as const,
      value: dateFilter,
      onChange: handleDateFilterChange,
    },
    {
      label: "Doctor",
      type: "text" as const,
      placeholder: "Buscar por nombre del doctor",
      value: doctorInput,
      onChange: setDoctorInput,
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
        {data.appointments.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            No se encontraron registros.
          </p>
        ) : (
          data.appointments.map((appointment) => (
            <PatientAppointmentsCard
              key={appointment.id}
              appointment={appointment}
            />
          ))
        )}
      </div>

      <Pagination
        page={page}
        totalPages={data.totalPages}
        handlePageChange={handlePageChange}
        label="citas"
        totalItems={data.totalItems}
      />
    </div>
  );
}
