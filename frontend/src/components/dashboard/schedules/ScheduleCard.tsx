import { Link } from "react-router-dom";
import { Switch } from "@headlessui/react";
import type { ScheduleData } from "../../../types/index";
import { Clock, Pencil } from "lucide-react";
import { format, parse } from "date-fns";
import { formatDay } from "../../../utils/datesAndTimeUtilities";
import { useSchedulesMutations } from "../../../hooks/schedules/useSchedules";

interface ScheduleCardProps {
  schedule: ScheduleData;
}

const formatTime = (time: string) => {
  const parsed = parse(time, "HH:mm:ss", new Date());
  return format(parsed, "hh:mm a");
};

export default function ScheduleCard({ schedule }: ScheduleCardProps) {
  const { toggleScheduleMutation } = useSchedulesMutations();

  return (
    <div className="bg-white rounded-lg shadow-md mb-4 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Switch
          checked={schedule.is_active}
          onChange={() => toggleScheduleMutation.mutate(schedule.id)}
          disabled={toggleScheduleMutation.isPending}
          className={`${
            schedule.is_active ? "bg-emerald-600" : "bg-gray-200"
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2`}
        >
          <span
            className={`${
              schedule.is_active ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
        <h3 className="text-xl font-semibold">
          {formatDay(schedule.day_of_week)}
        </h3>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-gray-600 font-bold text-sm">Inicio</p>
        <p className="flex items-center gap-10 p-2 w-fit border border-gray-400 rounded-lg">
          {formatTime(schedule.start_time)}
          <Clock className="text-gray-500 size-5" />
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-gray-600 font-bold text-sm">Fin</p>
        <p className="flex items-center gap-10 p-2 w-fit border border-gray-400 rounded-lg">
          {formatTime(schedule.end_time)}
          <Clock className="text-gray-500 size-5" />
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-2">
        <p className="text-gray-600 font-bold text-sm">Acciones</p>
        <div className="flex items-center gap-2">
          <Link
            to={`/dashboard/doctor/schedule/edit/${schedule.id}`}
            className="p-1.5 cursor-pointer flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg transition-colors"
          >
            <Pencil size={18} />
            Editar
          </Link>
        </div>
      </div>
    </div>
  );
}
