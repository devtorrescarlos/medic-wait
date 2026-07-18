import { Mail } from "lucide-react";
import UserInitialts from "../../shared/UserInitials";
import type { PatientByIdResponse } from "../../../types";
import { formatDate, formatTime } from "../../../utils/datesAndTimeUtilities";

export default function PatientInfoCard({
  patientData,
}: {
  patientData: PatientByIdResponse;
}) {
  return (
    <div className="flex items-center gap-4">
      <UserInitialts name={patientData.patient.full_name} />
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-800">
          {patientData.patient.full_name}
        </h3>
        <div className="flex items-center gap-2 mt-1.5 text-gray-500">
          <Mail className="w-4 h-4" />
          <span className="text-sm">{patientData.patient.email}</span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="mt-1.5 text-gray-500 text-sm">
            Edad: {patientData.patient.age} años
          </span>

          {patientData.lastAppointment && patientData.lastAppointment.slot ? (
            <span className="mt-1.5 text-gray-500 text-sm">
              Ultima cita: {formatDate(patientData.lastAppointment.slot.date)} -{" "}
              {formatTime(patientData.lastAppointment.slot.start_time)} -{" "}
              {formatTime(patientData.lastAppointment.slot.end_time)}
            </span>
          ) : (
            <span className="mt-1.5 text-gray-500 text-sm">No tiene citas</span>
          )}
        </div>
      </div>
    </div>
  );
}
