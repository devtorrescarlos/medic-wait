import { useForm } from "react-hook-form";
import { Stethoscope, User, Calendar, Clock, FileText } from "lucide-react";
import type { DoctorByIdResponse } from "../../../types/index";
import { formatTime } from "../../../utils/formatDayAndDates";
import { Navigate } from "react-router-dom";
import ErrorMessage from "../../shared/ErrorMessage";
import { useAppointmentsMutations } from "../../../hooks/appointments/useAppointmentsMutations";

interface AppointmentBookingFormProps {
  data: DoctorByIdResponse;
  slotId: string;
}

export default function AppointmentBookingForm({
  data,
  slotId,
}: AppointmentBookingFormProps) {
  const currentSchedule = data.availableSlots.find((schedule) =>
    schedule.slots.some((slot) => slot.id === slotId),
  );

  const currentSlot = currentSchedule?.slots.find((slot) => slot.id === slotId);

  const { bookAppointment } = useAppointmentsMutations();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ reason: string }>();

  if (!currentSlot || !currentSchedule)
    return <Navigate to="/dashboard/patient/doctors" />;

  const handleOnSubmit = ({ reason }: { reason: string }) => {
    bookAppointment.mutate({
      doctorId: data.doctor.id,
      slotId: currentSlot.id,
      reason,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Resumen de la Cita
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <User className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wide font-semibold text-gray-500">
                Doctor
              </span>
              <p className="font-semibold text-gray-700">
                Dr. {data.doctor.full_name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Stethoscope className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wide font-semibold text-gray-500">
                Especialidad
              </span>
              <p className="font-semibold text-gray-700">
                {data.doctor.specialty.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wide font-semibold text-gray-500">
                Fecha
              </span>
              <p className="font-semibold text-gray-700">
                {currentSchedule.date}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wide font-semibold text-gray-500">
                Horario
              </span>
              <p className="font-semibold text-gray-700">
                {formatTime(currentSlot.start_time)} —{" "}
                {formatTime(currentSlot.end_time)}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <label
            htmlFor="reason"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Motivo de consulta
          </label>
          <textarea
            id="reason"
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none transition-colors text-gray-700 placeholder-gray-400"
            placeholder="Describe el motivo de tu consulta. Ej: Consulta de rutina, revisión de chequeo, etc."
            {...register("reason", {
              required: "El motivo de consulta es requerido",
              maxLength: {
                value: 50,
                message:
                  "El motivo de consulta no puede exceder los 50 caracteres",
              },
            })}
          />
          {errors.reason && (
            <ErrorMessage message={errors.reason.message as string} />
          )}

          <button
            type="submit"
            className="mt-2 w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            Reservar Cita
          </button>
        </form>
      </div>
    </div>
  );
}
