import { Calendar, Clock, Eye, FileText } from "lucide-react";
import type { Appointment } from "../../../types";
import { getInitials } from "../../../utils/getInitials";
import { formatTime } from "../../../utils/formatDayAndDates";
import { statusConfig } from "../../../constants";

export default function AppointmentsCard({ appointment }: { appointment: Appointment }) {

    const status = statusConfig[appointment.status as keyof typeof statusConfig] || statusConfig.pending;
    const StatusIcon = status.icon;

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                            <span className="text-emerald-700 font-semibold text-lg">
                                {getInitials(appointment.patient.full_name)}
                            </span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">{appointment.patient.full_name}</h3>
                            <p className="text-sm text-gray-500">{appointment.patient.email}</p>
                        </div>
                    </div>

                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bg} border ${status.border}`}>
                        <StatusIcon className={`w-4 h-4 ${status.text}`} />
                        <span className={`text-sm font-medium ${status.text}`}>{status.label}</span>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{appointment.slot.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                            {formatTime(appointment.slot.start_time)} - {formatTime(appointment.slot.end_time)}
                        </span>
                    </div>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Motivo de visita</p>
                            <p className="text-sm text-gray-700">{appointment.reason}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
                <a
                    href={`/dashboard/doctor/appointments/${appointment.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm border bg-blue-100  border-blue-200 text-blue-600 hover:text-blue-700 hover:bg-blue-200 rounded-lg transition-colors"
                >
                    <Eye className="w-4 h-4" />
                    Ver detalles
                </a>
            </div>
        </div>
    );
}
