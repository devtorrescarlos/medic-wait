import { useState } from "react";
import { ChevronDown, CalendarDays } from "lucide-react";
import type { AvailableSlots } from "../../../types";
import DoctorAccordionItem from "./DoctorAccordionItem";

type DoctorAccordionProps = {
  availableSlots: AvailableSlots[];
  doctorId: string;
};

export default function DoctorAccordion({ availableSlots, doctorId }: DoctorAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-2">
      {availableSlots.map((schedule, index) => (
        <div
          key={schedule.date}
          className="border border-gray-100 rounded-lg overflow-hidden"
        >
          <button
            onClick={() => toggle(index)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <CalendarDays className="w-5 h-5 text-emerald-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-800">{schedule.dayName}</p>
                <p className="text-sm text-gray-500">{schedule.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                {schedule.slots.length} disponibles
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform ${openIndex === index ? "rotate-0" : "-rotate-90"}`}
              />
            </div>
          </button>
          {openIndex === index && (
            <div className="px-4 py-3 border-t border-gray-100 space-y-2">
              {schedule.slots.map((slot) => (
                <DoctorAccordionItem key={slot.id} slot={slot} doctorId={doctorId} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
