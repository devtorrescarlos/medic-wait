import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../services/authService";
import type { User } from "../../types";

export const useUser = () => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryFn: getUser,
        queryKey: ['user'],
        retry: 1,
        refetchOnWindowFocus: false
    });

    return { user: data as User | undefined, isLoading, isError, refetch };
};
