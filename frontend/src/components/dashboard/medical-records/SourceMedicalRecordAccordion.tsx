import { ChevronDown, Eye, FileText } from "lucide-react";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import type { MedicalRecord } from "../../../types";
import { firstCharacters } from "../../../utils/firstCharacters";
import { Link } from "react-router-dom";

type SourceMedicalRecordAccordionProps = {
  medicalRecord: MedicalRecord;
  detailRoute?: string;
};

export default function SourceMedicalRecordAccordion({
  medicalRecord,
  detailRoute,
}: SourceMedicalRecordAccordionProps) {
  return (
    <Disclosure>
      <DisclosureButton className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="font-semibold text-gray-800">
            Historia Médica Origen
          </span>
        </div>
        <ChevronDown className="w-5 h-5 text-gray-400 ui-open:rotate-0 ui-closed:-rotate-90 transition-transform" />
      </DisclosureButton>

      <DisclosurePanel className="px-5 py-4 border-t border-gray-200 space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                Diagnóstico Inicial
              </p>
              <p className="text-sm text-gray-700">
                {medicalRecord.initial_diagnosis}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                Plan de Tratamiento
              </p>
              <p className="text-sm text-gray-700">
                {firstCharacters(medicalRecord.treatment_plan, 50)}...
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            to={detailRoute ?? `/dashboard/doctor/medical-records/${medicalRecord.id}`}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            Ver historia completa
          </Link>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
