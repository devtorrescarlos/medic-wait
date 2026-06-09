import { Bot } from "lucide-react";

export default function MedicalRecordChatbot() {
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
      <div className="border-t border-gray-100 pt-4">
        <p className="text-gray-400 text-sm text-center py-8">
          El asistente IA te ayudará a redactar la historia médica de forma
          rápida y precisa.
        </p>
      </div>
    </div>
  );
}
