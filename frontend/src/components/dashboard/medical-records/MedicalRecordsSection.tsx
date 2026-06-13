import { ClipboardList, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import SourceMedicalRecordAccordion from "./SourceMedicalRecordAccordion";
import AnexxedMedicalRecordsAccordion from "./AnexxedMedicalRecordsAccordion";
import type { MedicalRecord } from "../../../types";
import EmptyMedicalRecords from "./EmptyMedicalRecords";

type MedicalRecordsSectionProps = {
  medicalRecords: MedicalRecord[];
  citaId: string;
};

export default function MedicalRecordsSection({
  medicalRecords,
  citaId,
}: MedicalRecordsSectionProps) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            Historias Médicas
          </h3>
        </div>

        {medicalRecords.length > 0 && (
          <Link
            to={`/dashboard/doctor/medical-records/annexe/create/${medicalRecords?.[0].id}`}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nuevo Anexo
          </Link>
        )}
      </div>

      {medicalRecords.length === 0 ? (
        <EmptyMedicalRecords citaId={citaId} />
      ) : (
        <>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <SourceMedicalRecordAccordion medicalRecord={medicalRecords?.[0]} />
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden mt-4">
            <AnexxedMedicalRecordsAccordion
              annexes={medicalRecords?.[0].annexes}
            />
          </div>
        </>
      )}
    </div>
  );
}
