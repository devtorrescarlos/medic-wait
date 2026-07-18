import { useQuery } from "@tanstack/react-query";
import { getSpecialties as fetchSpecialties } from "../../services/authService";
import type { Specialty } from "../../types";

export const useGetSpecialties = () => {
  const { data: specialties, isLoading, error } = useQuery({
    queryKey: ["specialties"],
    queryFn: fetchSpecialties,
  });

  return {
    specialties: (specialties as Specialty[]) ?? [],
    isLoading,
    error,
  };
};
