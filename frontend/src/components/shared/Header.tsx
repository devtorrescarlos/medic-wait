import { useAuth } from "../../hooks/auth/useAuth";
import UserInitialts from "./UserInitials";
import NotificationsBell from "./NotificationsBell";
import { ROLES } from "../../constants";

export default function Header() {
  const { user, role } = useAuth();
  const roleLabel = ROLES[role.toUpperCase() as keyof typeof ROLES];

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
        <NotificationsBell />
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <UserInitialts name={user?.full_name || ""} />
            <div className="hidden md:flex flex-col">
              <span className="text-sm font-medium text-gray-800">
                {user?.full_name || "Usuario"}
              </span>
              <span className="text-xs text-gray-500">
                {roleLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
