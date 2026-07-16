import { Clock } from "lucide-react";
import { formatTime } from "../../../utils/datesAndTimeUtilities";
import { Link } from "react-router-dom";

type SlotData = {
  id: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
  schedule: { day_of_week: string };
};

type DoctorAccordionItemProps = {
  slot: SlotData;
  doctorId: string;
};

export default function DoctorAccordionItem({
  slot,
  doctorId,
}: DoctorAccordionItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-sm font-semibold text-gray-700">
            {formatTime(slot.start_time)}
          </span>
        </div>
        <span className="text-gray-300">—</span>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-sm font-semibold text-gray-700">
            {formatTime(slot.end_time)}
          </span>
        </div>
      </div>
      <Link
        to={`/dashboard/patient/appointment/${doctorId}/${slot.id}`}
        className="px-4 py-1.5 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors cursor-pointer shadow-sm"
      >
        Agendar cita
      </Link>
    </div>
  );
}
