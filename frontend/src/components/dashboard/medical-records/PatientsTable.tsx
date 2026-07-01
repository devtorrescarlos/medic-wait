import { Eye } from "lucide-react";
import TableFilters from "../../shared/TableFilters";
import type { PatientResponse } from "../../../types";
import UserInitialts from "../../shared/UserInitials";
import { Link } from "react-router-dom";
import Pagination from "../../shared/Pagination";

type PatientsTableProps = {
  data: PatientResponse;
  page: number;
  nameInput: string;
  emailInput: string;
  setNameInput: (value: string) => void;
  setEmailInput: (value: string) => void;
  handleCleanFilters: () => void;
  handlePageChange: (newPage: number) => void;
};

export default function PatientsTable({
  data,
  page,
  nameInput,
  emailInput,
  setNameInput,
  setEmailInput,
  handleCleanFilters,
  handlePageChange,
}: PatientsTableProps) {
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
              {data.patients.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No se encontraron pacientes que coincidan con la búsqueda.
                  </td>
                </tr>
              )}

              {data.patients.map((patient) => {
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

      <Pagination
        page={page}
        totalPages={data.totalPages}
        handlePageChange={handlePageChange}
        label="pacientes"
        totalItems={data.totalItems}
      />
    </div>
  );
}
