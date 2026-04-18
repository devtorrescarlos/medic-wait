
import { useAppointments } from "../../../../hooks/appointments/useAppointments";
import AppointmentsTable from "../../../../components/dashboard/appointments/AppointmentsTable";
import LoadingSpinner from "../../../../components/shared/LoadingSpinner";


export default function AppointmentsPage() {

    const { data, isLoading, error } = useAppointments(1, 10);

    if (isLoading) return <LoadingSpinner />
    if (error) return <p>Error al cargar las citas</p>



    return (
        <div className="p-4 lg:p-6 space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Gestión de Citas</h2>
                <p className="text-gray-500 mt-1">Administra las citas de tus pacientes</p>
            </div>

            <AppointmentsTable data={data} />
        </div>
    );
}
