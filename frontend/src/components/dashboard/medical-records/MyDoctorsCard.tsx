import { Eye, Mail, Stethoscope } from "lucide-react";
import UserInitialts from "../../shared/UserInitials";
import type { Doctor } from "../../../types";

export default function MyDoctorsCard({ doctor }: { doctor: Doctor }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <UserInitialts name={doctor.full_name} size="medium" />
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-800 truncate">
              Dr. {doctor.full_name}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              <Stethoscope className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="text-sm text-gray-500 truncate">
                {doctor.specialty.name}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
          <Mail className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="truncate">{doctor.email}</span>
        </div>
      </div>
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <button className="w-full px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer flex items-center justify-center gap-2">
          <Eye className="w-4 h-4" />
          Ver historias médicas
        </button>
      </div>
    </div>
  );
}
