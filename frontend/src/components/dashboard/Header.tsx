import { Bell } from "lucide-react";
import { useAuth } from "../../hooks/auth/useAuth";

export default function Header() {
    const { user, role } = useAuth();

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

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
                <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <Bell size={24} />
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-linear-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            {user?.fullName ? getInitials(user.fullName) : "U"}
                        </div>
                        <div className="hidden md:flex flex-col">
                            <span className="text-sm font-medium text-gray-800">
                                {user?.fullName || "Usuario"}
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
