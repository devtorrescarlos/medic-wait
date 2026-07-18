import { Navigate, useParams } from "react-router-dom";
import GoBackButton from "../../../../components/shared/GoBackButton";
import { useGetDoctorById } from "../../../../hooks/doctors/useGetDoctorById";
import AppointmentBookingForm from "../../../../components/dashboard/appointments/AppointmentBookingForm";
import LoadingSpinner from "../../../../components/shared/LoadingSpinner";

export default function AppointmentBookingPage() {
  const { doctorId, slotId } = useParams();

  if (!doctorId || !slotId) return <Navigate to="/dashboard/patient/doctors" />;

  const { doctorData, isLoading, error } = useGetDoctorById(doctorId);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reserva de Cita</h2>
          <p className="text-gray-500 mt-1">
            Completa los datos para reservar tu cita
          </p>
        </div>
        <GoBackButton to={`/dashboard/patient/doctors/${doctorId}`} />
      </div>
      <div className="max-w-3xl mx-auto mt-2 p-6">
        {isLoading && doctorData === undefined ? (
          <LoadingSpinner />
        ) : error ? (
          <Navigate to="/dashboard/patient/doctors" />
        ) : (
          doctorData && <AppointmentBookingForm doctorData={doctorData} slotId={slotId} />
        )}
      </div>
    </div>
  );
}
