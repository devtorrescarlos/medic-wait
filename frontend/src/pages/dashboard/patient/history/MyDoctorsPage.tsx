import { Stethoscope } from "lucide-react";
import GoBackButton from "../../../../components/shared/GoBackButton";
import { useGetMyDoctors } from "../../../../hooks/medical-records/useGetMyDoctors";
import { useDoctorFilters } from "../../../../hooks/doctors/useDoctorFilters";
import LoadingSpinner from "../../../../components/shared/LoadingSpinner";
import MyDoctorsTable from "../../../../components/dashboard/medical-records/MyDoctorsTable";
import ErrorMessage from "../../../../components/shared/ErrorMessage";

export default function MyDoctorsPage() {
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
  const { myDoctorsData, isLoading, error } = useGetMyDoctors(
    page,
    limit,
    name,
    email,
    specialty,
  );

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Stethoscope className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Mis Doctores</h2>
            <p className="text-gray-500 mt-1">
              Doctores con los que has tenido consultas
            </p>
          </div>
        </div>
        <GoBackButton to="/dashboard/patient" />
      </div>

      {isLoading && myDoctorsData === undefined ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error.message} />
      ) : (
        <>
          <MyDoctorsTable
            myDoctorsData={myDoctorsData}
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
        </>
      )}
    </div>
  );
}
