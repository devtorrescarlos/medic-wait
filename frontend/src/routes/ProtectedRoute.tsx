import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/auth/useAuth";

export default function ProtectedRoute({ allowedRoles }: { allowedRoles: string[] }) {
    const { user, isLoading, isAuthenticated, role } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    if (!user || !allowedRoles.includes(role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
