import { useMemo } from "react";
import { useGetSpecialties } from "../../../hooks/auth/useGetSpecialties";
import TableFilters from "../../shared/TableFilters";
import type { DoctorsData } from "../../../types";
import DoctorRow from "./DoctorRow";
import DoctorCard from "./DoctorCard";

type DoctorsTableProps = {
  data: DoctorsData;
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
  data,
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

  const filteredDoctors = useMemo(() => {
    return data.doctors.filter((doctor) => {
      const matchesSpecialty =
        !inputSpecialty || doctor.specialty_id === inputSpecialty;
      const matchesName =
        !inputName ||
        doctor.full_name?.toLowerCase().includes(inputName.toLowerCase());
      const matchesEmail =
        !inputEmail ||
        doctor.email.toLowerCase().includes(inputEmail.toLowerCase());
      return matchesSpecialty && matchesName && matchesEmail;
    });
  }, [inputSpecialty, inputName, inputEmail]);

  const filters = [
    {
      label: "Especialidad",
      type: "select" as const,
      value: inputSpecialty,
      onChange: handleSpecialtyFilter,
      options: [
        { value: "", label: "Todas las especialidades" },
        ...specialties.map((s) => ({ value: s.id, label: s.name })),
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
              {filteredDoctors.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No se encontraron doctores que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((doctor) => (
                  <DoctorRow key={doctor.id} doctor={doctor} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {filteredDoctors.length === 0 ? (
          <p className="text-center text-gray-500 py-12">
            No se encontraron doctores que coincidan con la búsqueda.
          </p>
        ) : (
          filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          Total: {filteredDoctors.length} doctor(es)
        </p>
        <div className="flex items-center gap-1.5">
          <button
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
            className="px-3 py-1.5 text-sm text-gray-400 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <button
            disabled={page === data.totalPages}
            onClick={() => handlePageChange(page + 1)}
            className="px-3 py-1.5 text-sm text-gray-400 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
