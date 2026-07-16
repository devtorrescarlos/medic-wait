import { useState } from "react";
import {
  Bot,
  Sparkles,
  Loader2,
  Send,
  FileText,
  Stethoscope,
  Plus,
  ChevronDown,
} from "lucide-react";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { useAIGeneration } from "../../../hooks/medical-records/useAIGeneration";

type MedicalRecordChatbotProps = {
  mode: "create" | "annexe";
  appointmentId?: string;
  context?: {
    patientName?: string;
    patientAge?: string;
    appointmentReason?: string;
    existingDiagnosis?: string;
    existingTreatment?: string;
  };
  onInsertDiagnosis?: (text: string) => void;
  onInsertTreatment?: (text: string) => void;
  onInsertContent?: (text: string) => void;
};

export default function MedicalRecordChatbot({
  mode,
  context,
  onInsertDiagnosis,
  onInsertTreatment,
  onInsertContent,
}: MedicalRecordChatbotProps) {
  const aiMutation = useAIGeneration();
  const [customPrompt, setCustomPrompt] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [annexeContent, setAnnexeContent] = useState("");
  const [diagnosisNotes, setDiagnosisNotes] = useState("");
  const [treatmentNotes, setTreatmentNotes] = useState("");


  const cleanContext = {
    ...(context?.patientName && { patientName: context.patientName }),
    ...(context?.patientAge && { patientAge: context.patientAge }),
    ...(context?.appointmentReason && {
      appointmentReason: context.appointmentReason,
    }),
    ...((context?.existingDiagnosis || diagnosis) && {
      existingDiagnosis: context?.existingDiagnosis || diagnosis,
    }),
  };

  const handleGenerateDiagnosis = () => {
    aiMutation.mutate(
      {
        mode: "initial_diagnosis",
        context: cleanContext,
        customPrompt: diagnosisNotes || undefined,
      },
      {
        onSuccess: (data) => setDiagnosis(data.content),
      },
    );
  };

  const handleGenerateTreatment = () => {
    aiMutation.mutate(
      {
        mode: "treatment_plan",
        context: cleanContext,
        customPrompt: treatmentNotes || undefined,
      },
      {
        onSuccess: (data) => setTreatment(data.content),
      },
    );
  };

  const handleGenerateAnnexe = () => {
    aiMutation.mutate(
      {
        mode: "annexe",
        context: cleanContext,
      },
      {
        onSuccess: (data) => setAnnexeContent(data.content),
      },
    );
  };

  const handleCustomGenerate = () => {
    if (!customPrompt.trim()) return;
    aiMutation.mutate(
      {
        mode: "custom",
        context: cleanContext,
        customPrompt: customPrompt,
      },
      {
        onSuccess: (data) => {
          if (mode === "create") {
            setDiagnosis((prev) => prev || data.content);
          } else {
            setAnnexeContent((prev) => prev || data.content);
          }
        },
      },
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <Bot className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">Asistente IA</h3>
          <p className="text-sm text-gray-500">Ayuda para la historia médica</p>
        </div>
      </div>

      <div className="space-y-4">
        {mode === "create" && (
          <>
            <Disclosure as="div" className="space-y-2">
              <DisclosureButton className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  Notas para diagnóstico
                </div>
                <ChevronDown className="w-4 h-4 transition-transform ui-open:rotate-180" />
              </DisclosureButton>

              <DisclosurePanel>
                <textarea
                  value={diagnosisNotes}
                  onChange={(e) => setDiagnosisNotes(e.target.value)}
                  placeholder="Describe hallazgos, síntomas adicionales o cualquier observación para el diagnóstico..."
                  rows={3}
                  className="w-full outline-none px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none placeholder:text-gray-400"
                />
              </DisclosurePanel>

              <button
                type="button"
                onClick={handleGenerateDiagnosis}
                disabled={aiMutation.isPending}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {aiMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                Generar diagnóstico inicial
              </button>
            </Disclosure>

            {diagnosis && (
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {diagnosis}
                </p>
                {onInsertDiagnosis && (
                  <button
                    type="button"
                    onClick={() => onInsertDiagnosis(diagnosis)}
                    className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Insertar diagnóstico
                  </button>
                )}
              </div>
            )}

            <Disclosure as="div" className="space-y-2">
              <DisclosureButton className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Notas para tratamiento
                </div>
                <ChevronDown className="w-4 h-4 transition-transform ui-open:rotate-180" />
              </DisclosureButton>

              <DisclosurePanel>
                <textarea
                  value={treatmentNotes}
                  onChange={(e) => setTreatmentNotes(e.target.value)}
                  placeholder="Describe medicamentos, dosis, recomendaciones adicionales para el plan de tratamiento..."
                  rows={3}
                  className="w-full outline-none px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none placeholder:text-gray-400"
                />
              </DisclosurePanel>

              <button
                type="button"
                onClick={handleGenerateTreatment}
                disabled={aiMutation.isPending}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {aiMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                Generar plan de tratamiento
              </button>
            </Disclosure>

            {treatment && (
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {treatment}
                </p>
                {onInsertTreatment && (
                  <button
                    type="button"
                    onClick={() => onInsertTreatment(treatment)}
                    className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Insertar tratamiento
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {mode === "annexe" && (
          <>
            <button
              type="button"
              onClick={handleGenerateAnnexe}
              disabled={aiMutation.isPending}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {aiMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Generar contenido de anexo
            </button>

            {annexeContent && (
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {annexeContent}
                </p>
                {onInsertContent && (
                  <button
                    type="button"
                    onClick={() => onInsertContent(annexeContent)}
                    className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Insertar contenido
                  </button>
                )}
              </div>
            )}
          </>
        )}

        <div className="border-t border-gray-100 pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Consulta personalizada
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleCustomGenerate();
                }
              }}
              placeholder="Escribe tu consulta..."
              className="flex-1 outline-none px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
            <button
              type="button"
              onClick={handleCustomGenerate}
              disabled={aiMutation.isPending || !customPrompt.trim()}
              className="flex items-center justify-center px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {aiMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
