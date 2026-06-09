import { useQuery } from "@tanstack/react-query";
import { getPatients } from "../../services/medicalRecordsService";

const useGetPatients = (
  page: number,
  limit: number,
  name: string,
  email: string,
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["patients", page, limit, name, email],
    queryFn: () => getPatients(page, limit, name, email),
  });
  return { data, isLoading, error };
};

export default useGetPatients;
