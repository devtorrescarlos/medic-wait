import { Calendar } from "lucide-react";
import type { MedicalRecordAnnexe } from "../../../types";

type MedicalRecordAnnexeDetailCardProps = {
  annexe: MedicalRecordAnnexe;
};

const TYPE_CONFIG = {
  lab_result: {
    label: "Resultado de Laboratorio",
    styles: "bg-blue-50 text-blue-700 border-blue-200",
  },
  evolution: {
    label: "Evolución",
    styles: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  correction: {
    label: "Corrección",
    styles: "bg-amber-50 text-amber-700 border-amber-200",
  },
} as const;

export default function MedicalRecordAnnexeDetailCard({
  annexe,
}: MedicalRecordAnnexeDetailCardProps) {
  const config = TYPE_CONFIG[annexe.type as keyof typeof TYPE_CONFIG] ?? {
    label: annexe.type,
    styles: "bg-gray-50 text-gray-700 border-gray-200",
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-gray-800">
            Anexo Médico
          </h3>
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full border w-fit ${config.styles}`}
          >
            {config.label}
          </span>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
            Contenido
          </p>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {annexe.content}
          </p>
        </div>
        <div className="border-t border-gray-100 pt-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1.5">
            Fecha de creación
          </p>
          <div className="flex items-center gap-1.5 text-sm text-gray-700">
            <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
            {annexe.created_at}
          </div>
        </div>
      </div>
    </div>
  );
}
