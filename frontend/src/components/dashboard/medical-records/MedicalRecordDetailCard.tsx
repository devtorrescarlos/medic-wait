import { Calendar } from "lucide-react";
import type { MedicalRecord } from "../../../types";
import { formatDate } from "../../../utils/formatDayAndDates";

type MedicalRecordDetailCardProps = {
  medicalRecord: MedicalRecord;
};

export default function MedicalRecordDetailCard({
  medicalRecord,
}: MedicalRecordDetailCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800">Historia Médica</h3>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
            Diagnóstico Inicial
          </p>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {medicalRecord.initial_diagnosis}
          </p>
        </div>
        <div className="border-t border-gray-100 pt-5">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
            Plan de Tratamiento
          </p>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {medicalRecord.treatment_plan}
          </p>
        </div>
        <div className="border-t border-gray-100 pt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1.5">
                Fecha de creación
              </p>
              <div className="flex items-center gap-1.5 text-sm text-gray-700">
                <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                {formatDate(medicalRecord.created_at)}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1.5">
                Última actualización
              </p>
              <div className="flex items-center gap-1.5 text-sm text-gray-700">
                <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                {formatDate(medicalRecord.updated_at)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
