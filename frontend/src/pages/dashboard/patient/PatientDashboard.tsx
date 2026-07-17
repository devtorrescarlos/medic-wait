import { Calendar, Users, Bell, Stethoscope, Plus, List, FileText, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/auth/useAuth";
import { usePatientDashboard } from "../../../hooks/dashboard/usePatientDashboard";
import StatCard from "../../../components/dashboard/StatCard";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";
import { formatTime, formatDate } from "../../../utils/datesAndTimeUtilities";
import { statusConfig, getSpecialtyConfig } from "../../../constants";
import UserInitials from "../../../components/shared/UserInitials";

export default function PatientDashboard() {
  const { user } = useAuth();
  const {
    upcomingAppointments,
    totalPending,
    uniqueDoctorsCount,
    nextAppointment,
    recentDoctors,
    unreadCount,
    isLoading,
  } = usePatientDashboard();

  if (isLoading) return <LoadingSpinner />;

  const quickActions = [
    { label: "Buscar doctores", to: "/dashboard/patient/doctors", icon: Stethoscope, color: "text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100" },
    { label: "Mis citas", to: "/dashboard/patient/my-appointments", icon: List, color: "text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100" },
    { label: "Mi historial", to: "/dashboard/patient/history", icon: FileText, color: "text-purple-600 bg-purple-50 border-purple-200 hover:bg-purple-100" },
    { label: "Agendar cita", to: "/dashboard/patient/doctors", icon: Plus, color: "text-orange-600 bg-orange-50 border-orange-200 hover:bg-orange-100" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Bienvenido, {user?.full_name}
        </h2>
        <p className="text-gray-500 mt-1">Resumen de tus citas y actividad</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Próximas citas"
          value={upcomingAppointments.length}
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
          title="Doctores visitados"
          value={uniqueDoctorsCount}
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
                <h3 className="font-semibold text-gray-800">Mis próximas citas</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {upcomingAppointments.length === 0
                    ? "No tienes citas programadas"
                    : `${upcomingAppointments.length} cita${upcomingAppointments.length !== 1 ? "s" : ""} programada${upcomingAppointments.length !== 1 ? "s" : ""}`
                  }
                </p>
              </div>
              {nextAppointment && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-700">
                    {formatDate(nextAppointment.slot.date)}
                  </span>
                </div>
              )}
            </div>

            {upcomingAppointments.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No tienes citas próximas</p>
                <Link
                  to="/dashboard/patient/doctors"
                  className="inline-block mt-3 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Agendar una cita
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {upcomingAppointments.map((appointment) => {
                  const status = statusConfig[appointment.status as keyof typeof statusConfig] || statusConfig.pending;
                  const StatusIcon = status.icon;
                  return (
                    <Link
                      key={appointment.id}
                      to={`/dashboard/patient/my-appointments/${appointment.id}`}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="hidden sm:flex flex-col items-center min-w-[80px]">
                        <span className="text-xs font-semibold text-gray-800">
                          {formatDate(appointment.slot.date)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatTime(appointment.slot.start_time)}
                        </span>
                      </div>

                      <div className="sm:hidden flex flex-col items-center min-w-[72px]">
                        <span className="text-sm font-semibold text-gray-800">
                          {formatTime(appointment.slot.start_time)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDate(appointment.slot.date)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <UserInitials name={appointment.doctor.full_name} size="small" />
                        <div>
                          <p className="text-sm font-medium text-gray-800 truncate group-hover:text-emerald-600 transition-colors">
                            Dr. {appointment.doctor.full_name}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {appointment.reason}
                          </p>
                        </div>
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

            {upcomingAppointments.length > 0 && (
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                <Link
                  to="/dashboard/patient/my-appointments"
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Ver todas mis citas →
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
                  <UserInitials name={nextAppointment.doctor.full_name} size="medium" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Dr. {nextAppointment.doctor.full_name}</p>
                    <p className="text-xs text-gray-500">{formatDate(nextAppointment.slot.date)} — {formatTime(nextAppointment.slot.start_time)}</p>
                  </div>
                </div>
                <Link
                  to={`/dashboard/patient/my-appointments/${nextAppointment.id}`}
                  className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Ver detalle
                </Link>
              </div>
            </div>
          )}

          {recentDoctors.length > 0 && (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Últimos doctores</h3>
                <Link
                  to="/dashboard/patient/history"
                  className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Ver todos
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {recentDoctors.slice(0, 4).map((doctor) => (
                  <Link
                    key={doctor.id}
                    to={`/dashboard/patient/history/${doctor.id}`}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors group"
                  >
                    <UserInitials name={doctor.full_name} size="small" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate group-hover:text-emerald-600 transition-colors">
                        Dr. {doctor.full_name}
                      </p>
                      <p className="text-xs text-gray-500">{getSpecialtyConfig(doctor.specialty?.name ?? "").label}</p>
                    </div>
                    {(() => {
                      const { icon: SpecialtyIcon } = getSpecialtyConfig(doctor.specialty?.name ?? "");
                      return <SpecialtyIcon className="w-4 h-4 text-gray-300 group-hover:text-emerald-400 transition-colors shrink-0" />;
                    })()}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
