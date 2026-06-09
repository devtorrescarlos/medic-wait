import { Eye } from "lucide-react";
import type { MedicalRecordAnnexe } from "../../../types";
import { firstCharacters } from "../../../utils/firstCharacters";
import { Link } from "react-router-dom";

export default function AnexxedMedicalRecordItem({
  annexe,
}: {
  annexe: MedicalRecordAnnexe;
}) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
            Tipo
          </p>
          <p className="text-sm font-medium text-gray-700">
            {annexe.type === "lab_result"
              ? "Resultado de Laboratorio"
              : annexe.type === "evolution"
                ? "Evolución"
                : "Corrección"}
          </p>
        </div>
        <Link
          to={`/dashboard/doctor/medical-records/annexe/${annexe.id}`}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          Ver
        </Link>
      </div>
      <div className="mt-3">
        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
          Contenido
        </p>
        <p className="text-sm text-gray-700 line-clamp-2">
          {firstCharacters(annexe.content, 50)}...
        </p>
      </div>
    </div>
  );
}
