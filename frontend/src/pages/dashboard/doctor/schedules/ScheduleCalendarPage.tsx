import { Link } from "react-router-dom";
import LoadingSpinner from "../../../../components/shared/LoadingSpinner";
import { useSchedule } from "../../../../hooks/schedules/useSchedules";
import { Plus } from "lucide-react";
import ScheduleCard from "../../../../components/dashboard/schedules/ScheduleCard";
import ErrorMessage from "../../../../components/shared/ErrorMessage";

export default function ScheduleCalendarPage() {
  const { schedules, isLoading, error } = useSchedule();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Error al cargar los horarios..." />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Configuración de Horarios Semanales
          </h2>
          <p className="text-gray-600">
            Defina los días y las horas de atención general para la generación
            automática de slots.
          </p>
        </div>

        <Link
          to="/dashboard/doctor/schedule/register"
          className="bg-emerald-500 hover:bg-emerald-600 flex items-center gap-2 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          <Plus /> Nuevo Horario
        </Link>
      </div>

      {schedules.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Aún no hay horarios registrados</p>
        </div>
      ) : (
        <div>
          {schedules.map((schedule) => (
            <ScheduleCard key={schedule.id} schedule={schedule} />
          ))}
        </div>
      )}
    </div>
  );
}
