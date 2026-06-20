import { useState } from "react";
import { CalendarClock, Clock, Mail, Stethoscope, AlertCircle } from "lucide-react";
import GoBackButton from "../../../../components/shared/GoBackButton";
import UserInitialts from "../../../../components/shared/UserInitials";

const MOCK_DOCTOR = {
  full_name: "Juan Pérez García",
  email: "juan.perez@medicwait.com",
  specialty: { name: "Cardiología" },
};

const MOCK_SCHEDULES = [
  {
    day: "Lunes",
    slots: [
      { start: "08:00", end: "12:00" },
      { start: "14:00", end: "17:00" },
    ],
  },
  {
    day: "Martes",
    slots: [{ start: "08:00", end: "12:00" }],
  },
  {
    day: "Miércoles",
    slots: [
      { start: "08:00", end: "12:00" },
      { start: "14:00", end: "17:00" },
    ],
  },
  {
    day: "Jueves",
    slots: [{ start: "14:00", end: "18:00" }],
  },
  {
    day: "Viernes",
    slots: [{ start: "08:00", end: "13:00" }],
  },
];

export default function DoctorDetailPage() {
  const [showPendingAlert] = useState(true);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Detalle del Doctor
          </h2>
          <p className="text-gray-500 mt-1">
            Información y horarios disponibles
          </p>
        </div>
        <GoBackButton to="/dashboard/patient/doctors" />
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <UserInitialts name={MOCK_DOCTOR.full_name} size="large" />
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-800">
                Dr. {MOCK_DOCTOR.full_name}
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 mt-1">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Stethoscope className="w-4 h-4 shrink-0" />
                  <span className="text-sm">
                    {MOCK_DOCTOR.specialty.name}
                  </span>
                </div>
                <span className="hidden sm:block text-gray-300">|</span>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span className="text-sm truncate">
                    {MOCK_DOCTOR.email}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPendingAlert && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-amber-800">
                Tienes una cita pendiente por confirmar
              </p>
              <p className="text-sm text-amber-600">
                El doctor aún no ha confirmado tu cita.
              </p>
            </div>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-amber-700 bg-amber-100 border border-amber-300 rounded-lg hover:bg-amber-200 transition-colors cursor-pointer whitespace-nowrap">
            Ver Cita
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              Horarios Disponibles
            </h3>
          </div>
        </div>
        <div className="p-6 space-y-3">
          {MOCK_SCHEDULES.map((schedule) => (
            <div
              key={schedule.day}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {schedule.day}
                  </p>
                  <p className="text-sm text-gray-500">
                    {schedule.slots
                      .map((s) => `${s.start} - ${s.end}`)
                      .join(" | ")}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full whitespace-nowrap w-fit">
                {schedule.slots.length} horario
                {schedule.slots.length !== 1 ? "s" : ""}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
