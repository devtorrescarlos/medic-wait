import { Eye, Mail, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import type { Doctor } from "../../../types";
import UserInitialts from "../../shared/UserInitials";

export default function DoctorRow({ doctor }: { doctor: Doctor }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <UserInitialts name={doctor?.full_name || ""} size="large" />
          <span className="text-sm font-medium text-gray-800">
            Dr. {doctor.full_name}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="w-4 h-4 text-gray-400 shrink-0" />
          {doctor.email}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Stethoscope className="w-4 h-4 text-gray-400 shrink-0" />
          {doctor.specialty?.name}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-center">
          <Link
            to={`/dashboard/patient/doctors/${doctor.id}`}
            className="px-3 py-1.5 text-sm flex items-center gap-2 font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            Ver perfil
          </Link>
        </div>
      </td>
    </tr>
  );
}
