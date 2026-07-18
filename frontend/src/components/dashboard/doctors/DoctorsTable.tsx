import { useGetSpecialties } from "../../../hooks/auth/useGetSpecialties";
import TableFilters from "../../shared/TableFilters";
import type { DoctorsData } from "../../../types";
import DoctorRow from "./DoctorRow";
import DoctorCard from "./DoctorCard";
import Pagination from "../../shared/Pagination";
import { getSpecialtyConfig } from "../../../constants";

type DoctorsTableProps = {
  doctorsData: DoctorsData;
  page: number;
  inputName: string;
  inputEmail: string;
  inputSpecialty: string;
  handlePageChange: (page: number) => void;
  handleCleanFilters: () => void;
  handleNameFilter: (name: string) => void;
  handleEmailFilter: (email: string) => void;
  handleSpecialtyFilter: (specialty: string) => void;
};

export default function DoctorsTable({
  doctorsData,
  page,
  inputName,
  inputEmail,
  inputSpecialty,
  handlePageChange,
  handleCleanFilters,
  handleNameFilter,
  handleEmailFilter,
  handleSpecialtyFilter,
}: DoctorsTableProps) {
  const { specialties, isLoading, error } = useGetSpecialties();

  const filters = [
    {
      label: "Especialidad",
      type: "select" as const,
      value: inputSpecialty,
      onChange: handleSpecialtyFilter,
      options: [
        { value: "", label: "Todas las especialidades" },
        ...specialties.map((s) => ({ value: s.id, label: getSpecialtyConfig(s.name).label })),
      ],
    },
    {
      label: "Nombre",
      type: "text" as const,
      placeholder: "Buscar por nombre...",
      value: inputName,
      onChange: handleNameFilter,
    },
    {
      label: "Correo",
      type: "text" as const,
      placeholder: "Buscar por correo...",
      value: inputEmail,
      onChange: handleEmailFilter,
    },
  ];

  return (
    <div className="space-y-4">
      {isLoading ? (
        <p>Cargando especialidades...</p>
      ) : error ? (
        <p>Error al cargar especialidades</p>
      ) : (
        <TableFilters
          filters={filters}
          onClear={handleCleanFilters}
          showClearButton
        />
      )}

      <div className="hidden md:block bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Doctor
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Correo electrónico
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Especialidad
                </th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {doctorsData.doctors.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No se encontraron doctores que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
          doctorsData.doctors.map((doctor) => (
                  <DoctorRow key={doctor.id} doctor={doctor} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {doctorsData.doctors.length === 0 ? (
          <p className="text-center text-gray-500 py-12">
            No se encontraron doctores que coincidan con la búsqueda.
          </p>
        ) : (
                doctorsData.doctors.map((doctor) => (
                  <DoctorRow key={doctor.id} doctor={doctor} />
                ))
        )}
      </div>

      <Pagination
        page={page}
        totalPages={doctorsData.totalPages}
        handlePageChange={handlePageChange}
        label="doctores"
        totalItems={doctorsData.totalItems}
      />
    </div>
  );
}
