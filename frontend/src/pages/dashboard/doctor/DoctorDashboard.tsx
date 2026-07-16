import { Calendar, Clock, Users, Bell, Plus, CalendarRange, List, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/auth/useAuth";
import { useDoctorDashboard } from "../../../hooks/dashboard/useDoctorDashboard";
import StatCard from "../../../components/dashboard/StatCard";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import { formatTime } from "../../../utils/datesAndTimeUtilities";
import { statusConfig } from "../../../constants";

export default function DoctorDashboardPage() {
  const { user } = useAuth();
  const {
    todayAppointments,
    totalToday,
    pendingToday,
    uniquePatientsToday,
    nextAppointment,
    totalPending,
    unreadCount,
    isLoading,
  } = useDoctorDashboard();

  if (isLoading) return <LoadingSpinner />;

  const quickActions = [
    { label: "Nuevo horario", to: "/dashboard/doctor/schedule/register", icon: Plus, color: "text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100" },
    { label: "Ver calendario", to: "/dashboard/doctor/schedule", icon: CalendarRange, color: "text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100" },
    { label: "Ver citas", to: "/dashboard/doctor/appointments", icon: List, color: "text-purple-600 bg-purple-50 border-purple-200 hover:bg-purple-100" },
    { label: "Pacientes", to: "/dashboard/doctor/patients", icon: Users, color: "text-orange-600 bg-orange-50 border-orange-200 hover:bg-orange-100" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Bienvenido, Dr. {user?.full_name}
        </h2>
        <p className="text-gray-500 mt-1">Resumen de tu jornada</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Citas hoy"
          value={totalToday}
          icon={Calendar}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Pendientes"
          value={totalPending}
          icon={AlertCircle}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
        />
        <StatCard
          title="Pacientes hoy"
          value={uniquePatientsToday}
          icon={Users}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="No leídas"
          value={unreadCount}
          icon={Bell}
          iconBg="bg-red-100"
          iconColor="text-red-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">Citas de hoy</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {todayAppointments.length === 0
                    ? "No tienes citas programadas para hoy"
                    : `${todayAppointments.length} cita${todayAppointments.length !== 1 ? "s" : ""} programada${todayAppointments.length !== 1 ? "s" : ""}${pendingToday > 0 ? ` — ${pendingToday} pendiente${pendingToday !== 1 ? "s" : ""}` : ""}`
                  }
                </p>
              </div>
              {nextAppointment && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-700">
                    Próxima: {formatTime(nextAppointment.slot.start_time)}
                  </span>
                </div>
              )}
            </div>

            {todayAppointments.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No hay citas para hoy</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {todayAppointments
                  .sort((a, b) => a.slot.start_time.localeCompare(b.slot.start_time))
                  .map((appointment) => {
                    const status = statusConfig[appointment.status as keyof typeof statusConfig] || statusConfig.pending;
                    const StatusIcon = status.icon;
                    return (
                      <Link
                        key={appointment.id}
                        to={`/dashboard/doctor/appointments/${appointment.id}`}
                        className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex flex-col items-center min-w-[72px]">
                          <span className="text-sm font-semibold text-gray-800">
                            {formatTime(appointment.slot.start_time)}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatTime(appointment.slot.end_time)}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate group-hover:text-emerald-600 transition-colors">
                            {appointment.patient.full_name}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {appointment.reason}
                          </p>
                        </div>

                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${status.bg} border ${status.border} shrink-0`}>
                          <StatusIcon className={`w-3.5 h-3.5 ${status.text}`} />
                          <span className={`text-xs font-medium ${status.text}`}>{status.label}</span>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            )}

            {todayAppointments.length > 0 && (
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                <Link
                  to="/dashboard/doctor/appointments"
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Ver todas las citas →
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Acceso rápido</h3>
            </div>
            <div className="p-4 space-y-3">
              {quickActions.map((action) => (
                <Link
                  key={action.to}
                  to={action.to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${action.color} transition-colors`}
                >
                  <action.icon className="w-5 h-5 shrink-0" />
                  <span className="text-sm font-medium">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {nextAppointment && (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Próxima cita</h3>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{nextAppointment.patient.full_name}</p>
                    <p className="text-xs text-gray-500">{formatTime(nextAppointment.slot.start_time)} - {formatTime(nextAppointment.slot.end_time)}</p>
                  </div>
                </div>
                <Link
                  to={`/dashboard/doctor/appointments/${nextAppointment.id}`}
                  className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Ver detalle
                </Link>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Notificaciones</h3>
              {unreadCount > 0 && (
                <span className="text-xs font-medium text-white bg-red-500 px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="p-8 text-center text-gray-400">
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Revisa tus notificaciones en el icono de campana</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
