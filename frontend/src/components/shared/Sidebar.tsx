import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  ChevronsLeft,
  Clock,
  Heart,
  HomeIcon,
  LogOut,
  Stethoscope,
} from "lucide-react";
import { Calendar, House, Clock4, User2, CalendarArrowUp } from "lucide-react";
import { useAuth } from "../../hooks/auth/useAuth";
import LogOutModal from "./LogOutModal";

type SidebarProps = {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Sidebar({
  isSidebarCollapsed,
  setIsSidebarCollapsed,
}: SidebarProps) {
  const { role, logout } = useAuth();
  const pathname = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const ADMIN_LINKS = [
    {
      to: "/dashboard/admin",
      label: "Dashboard",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      to: "/dashboard/admin/users",
      label: "Usuarios",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
    },
    {
      to: "/dashboard/admin/doctors",
      label: "Doctores",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    {
      to: "/dashboard/admin/appointments",
      label: "Citas",
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    },
  ];

  const DOCTOR_LINKS = [
    { to: "/dashboard/doctor", label: "Dashboard", icon: <House /> },
    {
      to: "/dashboard/doctor/schedule",
      label: "Mi Calendario",
      icon: <CalendarArrowUp />,
    },
    { to: "/dashboard/doctor/slots", label: "Slots", icon: <Clock4 /> },
    {
      to: "/dashboard/doctor/appointments",
      label: "Citas",
      icon: <Calendar />,
    },
    { to: "/dashboard/doctor/patients", label: "Pacientes", icon: <User2 /> },
  ];

  const PATIENT_LINKS = [
    {
      to: "/dashboard/patient",
      label: "Home",
      icon: <HomeIcon />,
    },
    {
      to: "/dashboard/patient/my-appointments",
      label: "Mis Citas",
      icon: <Calendar />,
    },
    {
      to: "/dashboard/patient/doctors",
      label: "Doctores",
      icon: <Stethoscope />,
    },
    {
      to: "/dashboard/patient/history",
      label: "Historial",
      icon: <Clock />,
    },
  ];

  const links =
    role === "admin"
      ? ADMIN_LINKS
      : role === "doctor"
        ? DOCTOR_LINKS
        : PATIENT_LINKS;
  return (
    <aside
      className={`
            bg-white border-r border-gray-200 h-screen sticky top-0 shrink-0 transition-all duration-300 ease-in-out
            ${isSidebarCollapsed ? "w-15" : "w-50"}
        `}
    >
      <LogOutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={logout}
      />
      <div
        className={`
                h-16 flex items-center border-b border-gray-200
                ${isSidebarCollapsed ? "justify-center px-2" : "px-4"}
            `}
      >
        <div
          className={`flex items-center gap-3 ${isSidebarCollapsed ? "justify-center" : ""}`}
        >
          <div className="w-8 h-8 bg-linear-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shrink-0">
            <Heart className="text-white" />
          </div>
          {!isSidebarCollapsed && (
            <span className="text-lg font-bold text-gray-800 whitespace-nowrap">
              MedicWait
            </span>
          )}
        </div>
      </div>

      <nav className="p-2 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                            ${isSidebarCollapsed ? "justify-center" : ""}
                            ${
                              pathname.pathname === link.to
                                ? "bg-emerald-500 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
          >
            {link.icon}

            {!isSidebarCollapsed && (
              <span className="whitespace-nowrap">{link.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-2  border-gray-200">
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className={`hover:cursor-pointer
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-all duration-200
                    ${isSidebarCollapsed ? "justify-center" : ""}
                `}
        >
          <LogOut />
          {!isSidebarCollapsed && (
            <span className="whitespace-nowrap">Salir</span>
          )}
        </button>

        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-all duration-200
                        ${isSidebarCollapsed ? "justify-center" : ""}
                    `}
        >
          <ChevronsLeft />
          {!isSidebarCollapsed && (
            <span className="whitespace-nowrap cursor-pointer">Colapsar</span>
          )}
        </button>
      </div>
    </aside>
  );
}
