import { useQuery } from "@tanstack/react-query";
import { getSpecialties as fetchSpecialties } from "../../services/authService";
import type { Specialty } from "../../types";

export const useGetSpecialties = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["specialties"],
    queryFn: fetchSpecialties,
  });

  return {
    specialties: (data as Specialty[]) ?? [],
    isLoading,
    error,
  };
};
