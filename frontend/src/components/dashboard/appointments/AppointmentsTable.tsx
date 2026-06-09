import { useMemo } from "react";
import { useAppointmentsFilters } from "../../../hooks/appointments/useAppointmentsFilters";
import TableFilters from "../../shared/TableFilters";
import type { AppointmentsData } from "../../../types";
import AppointmentsCard from "./AppointmentsCard";

type AppointmentsTableProps = {
  data: AppointmentsData;
  page: number;
  setPage: (page: number) => void;
};

export default function AppointmentsTable({
  data,
  page,
  setPage,
}: AppointmentsTableProps) {
  const {
    dateFilter,
    patientInput,
    statusFilter,
    handleDateFilter,
    setPatientInput,
    handleStatusFilter,
    handleCleanFilters,
  } = useAppointmentsFilters();

  const filters = [
    {
      label: "Fecha",
      type: "date" as const,
      value: dateFilter,
      onChange: handleDateFilter,
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
      onChange: handleStatusFilter,
      options: [
        { value: "", label: "Todos los estados" },
        { value: "pending", label: "Pendiente" },
        { value: "confirmed", label: "Confirmada" },
        { value: "cancelled", label: "Cancelada" },
        { value: "completed", label: "Completada" },
      ],
    },
  ];

  const filteredAppointments = useMemo(() => {
    return data.appointments.filter((appointment) => {
      if (dateFilter && appointment.slot.date !== dateFilter) return false;
      if (
        patientInput &&
        !appointment.patient.full_name
          .toLowerCase()
          .includes(patientInput.toLowerCase())
      )
        return false;
      if (statusFilter && appointment.status !== statusFilter) return false;
      return true;
    });
  }, [data.appointments, dateFilter, patientInput, statusFilter]);

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
          filteredAppointments.map((appointment) => (
            <AppointmentsCard key={appointment.id} appointment={appointment} />
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
            onClick={() => setPage(page - 1)}
            className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <button
            disabled={page >= data.totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
