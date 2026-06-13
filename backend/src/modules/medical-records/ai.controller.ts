import type { Request, Response } from "express";
import type { AIGenerateInput } from "../../types/ai.types";
import * as aiService from "./ai.service";

export const generateWithAI = async (req: Request, res: Response) => {
  try {
    const input = req.body as AIGenerateInput;
    const content = await aiService.generateWithAI(input);
    res.status(200).json({ content });
  } catch (error: any) {
    if (error.response?.status === 429) {
      return res.status(429).json({
        message:
          "Límite de solicitudes alcanzado. Intenta de nuevo en unos segundos.",
      });
    }
    res.status(500).json({ message: "Error al generar contenido con IA" });
  }
};
