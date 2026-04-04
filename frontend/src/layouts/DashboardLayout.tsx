import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Header from "../components/dashboard/Header";
import Sidebar from "../components/dashboard/Sidebar";
import { useUser } from "../hooks/auth/useUser";
import LoadingSpinner from "../components/shared/LoadingSpinner";

export default function DashboardLayout() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const { user, isLoading, isError } = useUser();

    if (isLoading) {
        return (
            <LoadingSpinner />
        );
    }

    if (isError) {
        return <Navigate to="/auth/login" replace />;
    }

    if (user) return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar
                user={user}
                isSidebarCollapsed={isSidebarCollapsed}
                setIsSidebarCollapsed={setIsSidebarCollapsed}
            />

            <div className="flex-1 flex flex-col transition-all duration-300">
                <Header
                    user={user}
                />

                <main className="flex-1 p-4 lg:p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
