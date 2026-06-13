import openrouterClient from "../../config/openrouter";
import type { AIGenerateInput } from "../../types/ai.types";

type BuiltPrompts = { system: string; user: string };

export const buildPrompt = (input: AIGenerateInput): BuiltPrompts => {
  const { mode, context, customPrompt } = input;

  switch (mode) {
    case "initial_diagnosis": {
      return {
        system:
          "Eres un médico redactando una historia clínica en español. Redacta el diagnóstico inicial comenzando con el nombre y edad del paciente. Incluye los datos del paciente en el texto del diagnóstico. Sé profesional y detallado.",
        user: `Paciente: ${context.patientName ?? "N/A"}, ${context.patientAge ?? "N/A"} años. Motivo de consulta: ${context.appointmentReason ?? "N/A"}.${customPrompt ? `\nNotas del médico: ${customPrompt}` : ""}\nRedacta un diagnóstico inicial profesional y detallado.`,
      };
    }

    case "treatment_plan": {
      return {
        system:
          "Eres un médico redactando un plan de tratamiento en español. Genera solo el plan, sin introducciones.",
        user: `Diagnóstico: ${context.existingDiagnosis ?? "N/A"}.${customPrompt ? `\nNotas del médico: ${customPrompt}` : ""}\nRedacta un plan de tratamiento detallado.`,
      };
    }

    case "annexe": {
      const annexePrompts: Record<string, string> = {
        evolution:
          "Redacta una nota de evolución para el paciente. Incluye evolución del cuadro, signos vitales, hallazgos al examen físico y plan.",
        lab_result:
          "Redacta un informe de resultado de laboratorio. Incluye los hallazgos e interpretación clínica.",
        correction:
          "Redacta una nota de corrección para la historia clínica. Incluye la aclaración correspondiente.",
      };

      return {
        system:
          "Eres un médico redactando un anexo de historia clínica en español.",
        user:
          annexePrompts[context.annexeType ?? "evolution"] ??
          annexePrompts.evolution,
      };
    }

    case "custom": {
      return {
        system:
          "Eres un asistente médico que ayuda a redactar documentos clínicos en español.",
        user: customPrompt ?? "",
      };
    }
  }
};

export const generateWithAI = async (
  input: AIGenerateInput,
): Promise<string> => {
  const { system, user } = buildPrompt(input);

  const response = await openrouterClient.post("/chat/completions", {
    model: process.env.OPENROUTER_MODEL ?? "openrouter/free",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  return response.data.choices[0].message.content;
};
