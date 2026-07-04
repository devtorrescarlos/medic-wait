import { Bell } from "lucide-react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useAuth } from "../../hooks/auth/useAuth";
import UserInitialts from "./UserInitials";

export default function Header() {
  const { user, role } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-800">
          {role === "admin" && "Panel de Administración"}
          {role === "doctor" && "Panel de Doctor"}
          {role === "patient" && "Mis Citas"}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <Popover className="relative">
          <PopoverButton className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            <Bell size={24} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </PopoverButton>
          <PopoverPanel className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
            <div className="p-4 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-800">Notificaciones</p>
            </div>
            <div className="p-6 text-center text-sm text-gray-500">
              No tienes notificaciones pendientes
            </div>
          </PopoverPanel>
        </Popover>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <UserInitialts name={user?.full_name || ""} />
            <div className="hidden md:flex flex-col">
              <span className="text-sm font-medium text-gray-800">
                {user?.full_name || "Usuario"}
              </span>
              <span className="text-xs text-gray-500">
                {role.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
