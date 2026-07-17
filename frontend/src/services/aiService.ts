import api from "../api/axios";

export const generateWithAI = async (input: {
  mode: string;
  context: Record<string, string>;
  customPrompt?: string;
}) => {
  const response = await api.post("/medical-records/ai/generate", input);
  return response.data;
};
