import TableFilters from "../../shared/TableFilters";
import type { AppointmentsData } from "../../../types";
import PatientAppointmentsCard from "./PatientAppointmentsCard";

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
      options: [
        { value: "", label: "Todos los estados" },
        { value: "pending", label: "Pendiente" },
        { value: "confirmed", label: "Confirmada" },
        { value: "cancelled", label: "Cancelada" },
        { value: "completed", label: "Completada" },
      ],
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

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {`Total: ${data.totalItems} cita(s)`}
          <span className="ml-2">
            Página {data.currentPage} de {data.totalPages || 1}
          </span>
        </p>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
            className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <button
            disabled={page >= data.totalPages}
            onClick={() => handlePageChange(page + 1)}
            className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
