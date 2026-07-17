import { Eye, Mail, Stethoscope } from "lucide-react";
import TableFilters from "../../shared/TableFilters";
import UserInitialts from "../../shared/UserInitials";
import type { Doctor, MyDoctorsResponse, Specialty } from "../../../types";
import MyDoctorsCard from "./MyDoctorsCard";
import { useGetSpecialties } from "../../../hooks/auth/useGetSpecialties";
import Pagination from "../../shared/Pagination";
import { Link } from "react-router-dom";
import { getSpecialtyConfig } from "../../../constants";

type MyDoctorsTableProps = {
  data: MyDoctorsResponse;
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

export default function MyDoctorsTable({
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
}: MyDoctorsTableProps) {
  const { specialties, isLoading, error } = useGetSpecialties();

  const filters = [
    {
      label: "Nombre",
      type: "text" as const,
      placeholder: "Buscar por nombre...",
      value: inputName,
      onChange: handleNameFilter,
    },
    {
      label: "Especialidad",
      type: "select" as const,
      value: inputSpecialty,
      onChange: handleSpecialtyFilter,
      options: [
        { value: "", label: "Todas las especialidades" },
        ...specialties.map((specialty: Specialty) => ({
          value: specialty.name,
          label: getSpecialtyConfig(specialty.name).label,
        })),
      ],
    },
    {
      label: "Email",
      type: "text" as const,
      placeholder: "Buscar por email...",
      value: inputEmail,
      onChange: handleEmailFilter,
    },
  ];

  return (
    <div className="space-y-4">
      {isLoading ? (
        <p className="text-sm text-gray-500">Cargando especialidades...</p>
      ) : error ? (
        <p className="text-sm text-red-500">Error al cargar especialidades</p>
      ) : (
        <TableFilters
          filters={filters}
          onClear={handleCleanFilters}
          showClearButton={true}
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
                  Especialidad
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
              {data.doctors.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No se encontraron doctores que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                data.doctors.map((doctor: Doctor) => (
                  <tr
                    key={doctor.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <UserInitialts name={doctor.full_name} size="large" />
                        <span className="text-sm font-medium text-gray-800">
                          Dr. {doctor.full_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {(() => {
                          const { icon: SpecialtyIcon, label: specialtyLabel } = getSpecialtyConfig(doctor.specialty.name);
                          return (
                            <>
                              <SpecialtyIcon className="w-4 h-4 text-gray-400 shrink-0" />
                              <span className="text-sm text-gray-600">
                                {specialtyLabel}
                              </span>
                            </>
                          );
                        })()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="text-sm text-gray-600">
                          {doctor.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        <Link
                          to={`/dashboard/patient/history/${doctor.id}`}
                          className="px-3 py-1.5 text-sm flex items-center gap-2 font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                          Ver historias médicas
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {data.doctors.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              No se encontraron doctores
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Intenta ajustar los filtros de búsqueda
            </p>
          </div>
        ) : (
          data.doctors.map((doctor: Doctor) => (
            <MyDoctorsCard key={doctor.id} doctor={doctor} />
          ))
        )}
      </div>

      <Pagination
        page={page}
        totalPages={data.totalPages}
        handlePageChange={handlePageChange}
        label="doctores"
        totalItems={data.totalItems}
      />
    </div>
  );
}
