import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Header from "../components/dashboard/Header";
import Sidebar from "../components/dashboard/Sidebar";
import { useAuth } from "../hooks/auth/useAuth";
import LoadingSpinner from "../components/shared/LoadingSpinner";

export default function DashboardLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />

      <div className="flex-1 flex flex-col transition-all duration-300">
        <Header />

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
