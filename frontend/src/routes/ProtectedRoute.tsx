import { Navigate, Outlet } from "react-router-dom";
import { getRoleFromToken } from "../utils/jwt";

export default function ProtectedRoute({ allowedRoles }: { allowedRoles: string[] }) {
    const token = localStorage.getItem("token");
    const role = getRoleFromToken();

    if (!token) {
        return <Navigate to="/auth/login" replace />;
    }

    if (!allowedRoles.includes(role as string)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
