import { Calendar, Clock, User, Mail, FileText, XCircle, CheckCircle } from "lucide-react";
import type { Appointment } from "../../../types";
import { getInitials } from "../../../utils/getInitials";
import { formatDate, formatTime } from "../../../utils/formatDayAndDates";
import { statusConfig } from "../../../constants";

interface AppointmentDetailCardProps {
    appointment: Appointment;
    handleCancelModal: () => void;
    handleCompleteModal: () => void;
}

export default function AppointmentDetailCard({ appointment, handleCancelModal, handleCompleteModal }: AppointmentDetailCardProps) {



    const status = statusConfig[appointment.status as keyof typeof statusConfig] || statusConfig.pending;
    const StatusIcon = status.icon;

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">Información de la Cita</h3>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bg} border ${status.border}`}>
                        <StatusIcon className={`w-4 h-4 ${status.text}`} />
                        <span className={`text-sm font-medium ${status.text}`}>{status.label}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                            <span className="text-emerald-700 font-semibold text-lg">
                                {getInitials(appointment.patient.full_name)}
                            </span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                                <User className="w-4 h-4" />
                                <span className="text-xs uppercase tracking-wide">Paciente</span>
                            </div>
                            <p className="font-semibold text-gray-800">{appointment.patient.full_name}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                            <Mail className="w-6 h-6 text-gray-500" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                                <Mail className="w-4 h-4" />
                                <span className="text-xs uppercase tracking-wide">Correo</span>
                            </div>
                            <p className="font-medium text-gray-700">{appointment.patient.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                                <Calendar className="w-4 h-4" />
                                <span className="text-xs uppercase tracking-wide">Fecha</span>
                            </div>
                            <p className="font-medium text-gray-700">{appointment.slot.date}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                            <Clock className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                                <Clock className="w-4 h-4" />
                                <span className="text-xs uppercase tracking-wide">Horario</span>
                            </div>
                            <p className="font-medium text-gray-700">
                                {formatTime(appointment.slot.start_time)} - {formatTime(appointment.slot.end_time)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-xs text-emerald-600 uppercase tracking-wide font-medium mb-1">Motivo de visita</p>
                            <p className="text-gray-700">{appointment.reason}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="text-sm text-gray-500">
                        <p>Creada el: {formatDate(appointment.created_at)}</p>
                        <p>ID: {appointment.id}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            disabled={appointment.status === "cancelled" || appointment.status === "completed"}
                            className="disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 px-4 py-2.5 hover:cursor-pointer text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
                            onClick={handleCancelModal}
                        >
                            <XCircle className="w-4 h-4" />
                            Cancelar Cita
                        </button>

                        <button
                            disabled={appointment.status === "cancelled" || appointment.status === "completed"}
                            onClick={handleCompleteModal}
                            className="disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 px-4 py-2.5 hover:cursor-pointer text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Completar Cita
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
