import { useState, type ReactNode } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { AuthContext } from "./AuthContext";
import { getUser } from "../services/authService";
import { decodeJWT } from "../utils/jwt";



export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
    const [role, setRole] = useState<string | null>(() => {
        const token = localStorage.getItem("token");
        if (!token) return null;
        const decoded = decodeJWT(token);
        return decoded?.role ?? null;
    });
    const queryClient = useQueryClient();

    const { data: user, isLoading } = useQuery({
        queryKey: ["user"],
        queryFn: getUser,
        enabled: !!token,
        retry: 1,
        refetchOnWindowFocus: false,
    })

    const login = (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        const decoded = decodeJWT(newToken);
        setRole(decoded?.role ?? null);
    }

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setRole(null);
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
                role: role! ?? null
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
