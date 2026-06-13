export type AIGenerateInput = {
  mode: "initial_diagnosis" | "treatment_plan" | "annexe" | "custom";
  context: {
    patientName?: string;
    patientAge?: string;
    appointmentReason?: string;
    annexeType?: "evolution" | "lab_result" | "correction";
    existingDiagnosis?: string;
    existingTreatment?: string;
  };
  customPrompt?: string;
};
