import { useState, type ReactNode } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { AuthContext } from "./AuthContext";
import { getUser, getRole } from "../services/authService";



export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
    const queryClient = useQueryClient();

    const { data: user, isLoading } = useQuery({
        queryKey: ["user"],
        queryFn: getUser,
        enabled: !!token,
        retry: 1,
        refetchOnWindowFocus: false,
    })

    const { data: userRole } = useQuery({
        queryKey: ["role"],
        queryFn: getRole,
        enabled: !!token,
        retry: 1,
        refetchOnWindowFocus: false,
    })

    const login = (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    }

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        queryClient.clear();
    }

    return (
        <AuthContext.Provider
            value={{
                user: user ?? null,
                isLoading,
                isAuthenticated: !!token,
                login,
                logout,
                role: userRole?.name ?? null
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
