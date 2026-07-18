import { Stethoscope } from "lucide-react";
import DoctorsTable from "../../../../components/dashboard/doctors/DoctorsTable";
import { useGetDoctors } from "../../../../hooks/doctors/useGetDoctors";
import { useDoctorFilters } from "../../../../hooks/doctors/useDoctorFilters";
import LoadingSpinner from "../../../../components/shared/LoadingSpinner";
import ErrorMessage from "../../../../components/shared/ErrorMessage";

export default function DoctorsPage() {
  const {
    inputName,
    inputEmail,
    inputSpecialty,
    name,
    email,
    specialty,
    page,
    limit,
    handleCleanFilters,
    handlePageChange,
    handleNameFilter,
    handleEmailFilter,
    handleSpecialtyFilter,
  } = useDoctorFilters();
  const { doctorsData, isLoading, error } = useGetDoctors(
    page,
    limit,
    name,
    email,
    specialty,
  );

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <Stethoscope className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Doctores Disponibles
          </h2>
          <p className="text-gray-500 mt-1">
            Selecciona un doctor para agendar una cita
          </p>
        </div>
      </div>

      {isLoading && doctorsData === undefined ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error.message} />
      ) : (
        <DoctorsTable
          doctorsData={doctorsData}
          page={page}
          inputName={inputName}
          inputEmail={inputEmail}
          inputSpecialty={inputSpecialty}
          handlePageChange={handlePageChange}
          handleCleanFilters={handleCleanFilters}
          handleNameFilter={handleNameFilter}
          handleEmailFilter={handleEmailFilter}
          handleSpecialtyFilter={handleSpecialtyFilter}
        />
      )}
    </div>
  );
}
