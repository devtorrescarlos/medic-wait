import { Mail } from "lucide-react";
import UserInitialts from "../../../components/shared/UserInitialts";
import type { PatientByIdResponse } from "../../../types";
import { formatDate, formatTime } from "../../../utils/formatDayAndDates";

export default function PatientInfoCard({
  data,
}: {
  data: PatientByIdResponse;
}) {
  return (
    <div className="flex items-center gap-4">
      <UserInitialts name={data.patient.full_name} />
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-800">
          {data.patient.full_name}
        </h3>
        <div className="flex items-center gap-2 mt-1.5 text-gray-500">
          <Mail className="w-4 h-4" />
          <span className="text-sm">{data.patient.email}</span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="mt-1.5 text-gray-500 text-sm">
            Edad: {data.patient.age} años
          </span>

          {data.lastAppointment ? (
            <span className="mt-1.5 text-gray-500 text-sm">
              Ultima cita: {formatDate(data.lastAppointment.slot?.date)} -{" "}
              {formatTime(data.lastAppointment.slot?.start_time)} -{" "}
              {formatTime(data.lastAppointment.slot?.end_time)}
            </span>
          ) : (
            <span className="mt-1.5 text-gray-500 text-sm">No tiene citas</span>
          )}
        </div>
      </div>
    </div>
  );
}
