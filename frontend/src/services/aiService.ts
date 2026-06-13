import api from "../api/axios";

export const generateWithAI = async (input: {
  mode: string;
  context: Record<string, string>;
  customPrompt?: string;
}) => {
  const url = `${import.meta.env.VITE_API_URL}/medical-records/ai/generate`;
  const response = await api.post(url, input);
  return response.data;
};
