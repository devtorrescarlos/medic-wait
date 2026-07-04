import { ChevronDown, FileText } from "lucide-react";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import AnexxedMedicalRecordItem from "./AnexxedMedicalRecordItem";
import type { MedicalRecordAnnexe } from "../../../types";

type AnexxedMedicalRecordsAccordionProps = {
  annexes: MedicalRecordAnnexe[];
  detailRoutePrefix?: string;
};

export default function AnexxedMedicalRecordsAccordion({
  annexes,
  detailRoutePrefix,
}: AnexxedMedicalRecordsAccordionProps) {
  if (!annexes || annexes.length === 0) {
    return null;
  }

  return (
    <Disclosure>
      <DisclosureButton className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="font-semibold text-gray-800">
            Historias Médicas Anexas
          </span>
          <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
            {annexes.length}
          </span>
        </div>
        <ChevronDown className="w-5 h-5 text-gray-400 ui-open:rotate-0 ui-closed:-rotate-90 transition-transform" />
      </DisclosureButton>

      <DisclosurePanel className="px-5 py-4 border-t border-gray-200 space-y-3">
        {annexes.map((annexe) => (
          <AnexxedMedicalRecordItem
            key={annexe.id}
            annexe={annexe}
            detailRoute={detailRoutePrefix ? `${detailRoutePrefix}${annexe.id}` : undefined}
          />
        ))}
      </DisclosurePanel>
    </Disclosure>
  );
}
