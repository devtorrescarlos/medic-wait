import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  ClipboardCheck,
} from "lucide-react";

export const ROLES = {
  DOCTOR: "Doctor",
  PATIENT: "Paciente",
  ADMIN: "Administrador",
} as const;

export const daysOfWeek = [
  { value: "monday", label: "Lunes" },
  { value: "tuesday", label: "Martes" },
  { value: "wednesday", label: "Miércoles" },
  { value: "thursday", label: "Jueves" },
  { value: "friday", label: "Viernes" },
  { value: "saturday", label: "Sábado" },
  { value: "sunday", label: "Domingo" },
];

export const APPOINTMENT_STATUS_FILTER = [
  { value: "", label: "Todos los estados" },
  { value: "pending", label: "Pendiente" },
  { value: "confirmed", label: "Confirmada" },
  { value: "cancelled", label: "Cancelada" },
  { value: "completed", label: "Completada" },
];

export const SLOT_STATUS_FILTER = [
  { value: "", label: "Todos los estados" },
  { value: "available", label: "Disponible" },
  { value: "booked", label: "Ocupado" },
];

export const ANNEXE_TYPES = [
  { value: "evolution", label: "Evolución" },
  { value: "lab_result", label: "Resultado de Laboratorio" },
  { value: "correction", label: "Corrección" },
];

export const statusConfig = {
  pending: {
    label: "Pendiente",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
    icon: AlertCircle,
  },
  confirmed: {
    label: "Confirmada",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelada",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    icon: XCircle,
  },
  completed: {
    label: "Completada",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    icon: CheckCircle,
  },
};

export const NOTIFICATION_ICON: Record<
  string,
  { icon: typeof Calendar; color: string; bg: string }
> = {
  appointment_created: {
    icon: Calendar,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  appointment_confirmed: {
    icon: CheckCircle,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
  appointment_cancelled: {
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-100",
  },
  appointment_completed: {
    icon: ClipboardCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
};
