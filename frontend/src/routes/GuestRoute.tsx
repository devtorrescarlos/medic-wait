import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/auth/useAuth";
import LoadingSpinner from "../components/shared/LoadingSpinner";

export default function GuestRoute() {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    if (role === "doctor") return <Navigate to="/dashboard/doctor" replace />;
    if (role === "patient") return <Navigate to="/dashboard/patient" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
