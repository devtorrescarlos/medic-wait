import { useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { AuthContext } from "./AuthContext";
import { getUser } from "../services/authService";
import { decodeJWT } from "../utils/jwt";
import api from "../api/axios";
import { getAccessToken, setAccessToken } from "../api/tokenStore";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(getAccessToken());
  const [role, setRole] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);
  const queryClient = useQueryClient();
  const refreshPromiseRef = useRef<Promise<string | null> | null>(null);

  const logout = useCallback(async () => {
    try {
      if (getAccessToken()) {
        await api.post("/auth/logout");
      }
    } catch {
      // silently fail — token may already be invalid
    }
    localStorage.removeItem("refreshToken");
    setAccessToken(null);
    setToken(null);
    setRole(null);
    queryClient.clear();
  }, [queryClient]);

  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    const storedRefresh = localStorage.getItem("refreshToken");
    if (!storedRefresh) {
      logout();
      return null;
    }

    // deduplicate concurrent refresh calls
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    const promise = (async () => {
      try {
        const { data } = await api.post("/auth/refresh", {
          refreshToken: storedRefresh,
        });
        setAccessToken(data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        setToken(data.accessToken);
        const decoded = decodeJWT(data.accessToken);
        setRole(decoded?.role ?? null);
        return data.accessToken as string;
      } catch {
        logout();
        return null;
      } finally {
        refreshPromiseRef.current = null;
      }
    })();

    refreshPromiseRef.current = promise;
    return promise;
  }, [logout]);

  // on mount: attempt to restore session from refreshToken
  useEffect(() => {
    const storedRefresh = localStorage.getItem("refreshToken");
    if (!storedRefresh) {
      setInitializing(false);
      return;
    }

    refreshAccessToken().finally(() => setInitializing(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    enabled: !!token,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const login = (accessToken: string, refreshToken: string) => {
    setAccessToken(accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setToken(accessToken);
    const decoded = decodeJWT(accessToken);
    setRole(decoded?.role ?? null);
  };

  const isLoading = initializing || ( !!token && userLoading );

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        isAuthenticated: !!token,
        login,
        logout,
        role: role ?? "",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
