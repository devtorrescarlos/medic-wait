import { useMemo } from "react";
import { Eye } from "lucide-react";
import TableFilters from "../../shared/TableFilters";
import type { PatientResponse } from "../../../types";
import { usePatientsFilters } from "../../../hooks/medical-records/usePatientsFilters";
import UserInitialts from "../../shared/UserInitialts";
import { Link } from "react-router-dom";

type PatientsTableProps = {
  data: PatientResponse;
  page: number;
  setPage: (page: number) => void;
};

export default function PatientsTable({
  data,
  page,
  setPage,
}: PatientsTableProps) {
  const {
    nameFilter,
    emailFilter,
    nameInput,
    emailInput,
    setNameInput,
    setEmailInput,
    handleCleanFilters,
  } = usePatientsFilters();

  const filteredPatients = useMemo(() => {
    return data.patients.filter((patient) => {
      const nameMatch =
        !nameFilter ||
        patient.full_name.toLowerCase().includes(nameFilter.toLowerCase());
      const emailMatch =
        !emailFilter ||
        patient.email.toLowerCase().includes(emailFilter.toLowerCase());
      return nameMatch && emailMatch;
    });
  }, [data.patients, nameFilter, emailFilter]);

  const filters = [
    {
      label: "Paciente",
      type: "text" as const,
      placeholder: "Buscar por nombre...",
      value: nameInput,
      onChange: setNameInput,
    },
    {
      label: "Correo",
      type: "text" as const,
      placeholder: "Buscar por correo...",
      value: emailInput,
      onChange: setEmailInput,
    },
  ];

  return (
    <div className="space-y-4">
      <TableFilters
        filters={filters}
        onClear={handleCleanFilters}
        showClearButton
      />

      <div className="hidden md:block bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Paciente
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Correo electrónico
                </th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPatients.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No se encontraron pacientes que coincidan con la búsqueda.
                  </td>
                </tr>
              )}

              {filteredPatients.map((patient) => {
                return (
                  <tr
                    key={patient.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <UserInitialts name={patient.full_name} size="large" />
                        <span className="text-sm font-medium text-gray-800">
                          {patient.full_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {patient.email}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        <Link
                          to={`/dashboard/doctor/patients/${patient.id}`}
                          className="px-3 py-1.5 text-sm flex items-center gap-2 font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                          Ver detalles
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          Total: {filteredPatients.length} paciente(s)
          <span className="ml-2">
            Página {page} de {data.totalPages}
          </span>
        </p>
        <div className="flex items-center gap-1.5">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1.5 text-sm text-gray-400 border border-gray-200 rounded-lg cursor-pointer"
          >
            Anterior
          </button>
          <button
            disabled={page === data.totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
