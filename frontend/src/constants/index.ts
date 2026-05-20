import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

export const daysOfWeek = [
    { value: "monday", label: "Lunes" },
    { value: "tuesday", label: "Martes" },
    { value: "wednesday", label: "Miércoles" },
    { value: "thursday", label: "Jueves" },
    { value: "friday", label: "Viernes" },
    { value: "saturday", label: "Sábado" },
    { value: "sunday", label: "Domingo" },
];

export const statusConfig = {
    pending: { label: "Pendiente", bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", icon: AlertCircle },
    confirmed: { label: "Confirmada", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: CheckCircle },
    cancelled: { label: "Cancelada", bg: "bg-red-50", text: "text-red-700", border: "border-red-200", icon: XCircle },
    completed: { label: "Completada", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: CheckCircle },
};