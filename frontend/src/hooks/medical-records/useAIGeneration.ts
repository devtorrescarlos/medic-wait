import { generateWithAI } from "../../services/aiService";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useAIGeneration = () => {
  return useMutation({
    mutationFn: generateWithAI,
    onError: (error: any) => {
      if (error.response.status === 429) {
        toast.error(
          "Límite de solicitudes alcanzado. Intenta de nuevo en unos segundos.",
        );
      } else {
        toast.error("Error al generar contenido con IA");
      }
    },
  });
};
