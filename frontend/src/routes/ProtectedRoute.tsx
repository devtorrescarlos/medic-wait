import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/auth/useAuth";
import LoadingSpinner from "../components/shared/LoadingSpinner";

export default function ProtectedRoute({
  allowedRoles,
}: {
  allowedRoles: string[];
}) {
  const { user, isLoading, isAuthenticated, role } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!user || !allowedRoles.includes(role)) {
    return (
      <Navigate
        to={
          role === "doctor"
            ? "/dashboard/doctor"
            : role === "patient"
              ? "/dashboard/patient"
              : "/"
        }
        replace
      />
    );
  }

  return <Outlet />;
}
