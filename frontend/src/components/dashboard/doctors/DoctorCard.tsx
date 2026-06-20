import { Eye, Mail, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import type { Doctor } from "../../../types";
import UserInitialts from "../../shared/UserInitials";

type DoctorCardProps = {
  doctor: Doctor;
};

export default function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <UserInitialts name={doctor?.full_name || ""} size="large" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 truncate">
              Dr. {doctor.full_name}
            </h3>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>{doctor.specialty?.name}</span>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
          <Mail className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="truncate">{doctor.email}</span>
        </div>
      </div>
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
        <Link
          to={`/dashboard/patient/doctors/${doctor.id}`}
          className="px-3 py-1.5 text-sm flex items-center gap-2 font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
        >
          <Eye className="w-4 h-4" />
          Ver perfil
        </Link>
      </div>
    </div>
  );
}
