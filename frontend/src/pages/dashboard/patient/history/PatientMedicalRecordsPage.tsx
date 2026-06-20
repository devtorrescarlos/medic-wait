import { useState } from "react";
import {
  ClipboardList,
  Calendar,
  Stethoscope,
  ChevronDown,
  ChevronRight,
  FileText,
  Activity,
  Clock,
} from "lucide-react";
import GoBackButton from "../../../../components/shared/GoBackButton";
import TableFilters from "../../../../components/shared/TableFilters";

const MOCK_RECORDS = [
  {
    id: "1",
    doctor: { full_name: "María López García", specialty: "Cardiología" },
    appointment_date: "2026-06-15T10:00:00",
    created_at: "2026-06-15T12:30:00",
    initial_diagnosis:
      "Paciente presenta hipertensión arterial grado 1 (140/90 mmHg) en controles repetidos. Sin antecedentes familiares de enfermedad cardiovascular. IMC 27.5 (sobrepeso). Se solicita perfil lipídico completo y ECG de reposo.",
    treatment_plan:
      "1. Enalapril 5mg cada 24 horas.\n2. Dieta hiposódica (máximo 2g de sodio/día).\n3. Actividad física aeróbica 30 min/día, 5 veces por semana.\n4. Control en 1 mes con resultados de laboratorio.\n5. Registro diario de presión arterial.",
    annexes: [
      { id: "a1", type: "lab_result", content: "Perfil lipídico: Colesterol total 220 mg/dL, LDL 150 mg/dL, HDL 35 mg/dL, Triglicéridos 180 mg/dL." },
      { id: "a2", type: "evolution", content: "Paciente reporta adherencia al tratamiento. PA en registro domiciliario: 135/85 mmHg en promedio. Refiere molestia leve al inicio del tratamiento que cedió a los 3 días." },
    ],
  },
  {
    id: "2",
    doctor: { full_name: "Juan Pérez García", specialty: "Cardiología" },
    appointment_date: "2026-05-02T09:00:00",
    created_at: "2026-05-02T11:00:00",
    initial_diagnosis:
      "Control de rutina. Paciente asintomático. PA 125/80 mmHg. Frecuencia cardíaca 72 lpm. ECG sin alteraciones. Se revisan resultados de laboratorio dentro de parámetros normales.",
    treatment_plan:
      "1. Continuar con tratamiento actual.\n2. Mantener dieta y ejercicio.\n3. Próximo control en 3 meses.\n4. Repetir perfil lipídico en 6 meses.",
    annexes: [],
  },
  {
    id: "3",
    doctor: { full_name: "Carlos Mendoza Ruiz", specialty: "Medicina General" },
    appointment_date: "2026-03-20T14:30:00",
    created_at: "2026-03-20T16:00:00",
    initial_diagnosis:
      "Infección de vías respiratorias altas. Paciente refiere odinofagia, tos seca y congestión nasal de 3 días de evolución. Afebril. Faringe eritematosa sin exudados. Auscultación pulmonar normal.",
    treatment_plan:
      "1. Ibuprofeno 400mg cada 8 horas por 5 días.\n2. Loratadina 10mg cada 24 horas.\n3. Nebulizaciones con solución salina cada 12 horas.\n4. Reposo por 48 horas.\n5. Acudir a control si persisten síntomas después de 5 días.",
    annexes: [
      { id: "a3", type: "lab_result", content: "Biometría hemática: Leucocitos 8,500/mm³ (normal). Neutrófilos 60%. Linfocitos 35%. PCR 6 mg/L (levemente elevado)." },
    ],
  },
];

const MOCK_TOTAL = 12;
const MOCK_TOTAL_PAGES = 4;

export default function PatientMedicalRecordsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("");
  const [page, setPage] = useState(1);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleCleanFilters = () => {
    setDateFilter("");
    setDoctorFilter("");
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const filtersConfig = [
    {
      label: "Fecha",
      type: "date" as const,
      value: dateFilter,
      onChange: setDateFilter,
    },
    {
      label: "Doctor",
      type: "text" as const,
      placeholder: "Buscar por nombre del doctor",
      value: doctorFilter,
      onChange: setDoctorFilter,
    },
  ];

  const getAnnexeTypeLabel = (type: string) => {
    switch (type) {
      case "lab_result":
        return "Resultado de Laboratorio";
      case "evolution":
        return "Evolución";
      case "correction":
        return "Corrección";
      default:
        return type;
    }
  };

  const getAnnexeTypeIcon = (type: string) => {
    switch (type) {
      case "lab_result":
        return "🔬";
      case "evolution":
        return "📋";
      case "correction":
        return "✏️";
      default:
        return "📄";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Mi Historial Clínico
          </h2>
          <p className="text-gray-500 mt-1">
            Consulta tus historias médicas y anexos
          </p>
        </div>
        <GoBackButton to="/dashboard/patient" />
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <ClipboardList className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">
              {MOCK_RECORDS.length}
            </p>
            <p className="text-sm text-gray-500">Historias Clínicas</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800">
              {formatDate(MOCK_RECORDS[0].appointment_date)}
            </p>
            <p className="text-sm text-gray-500">Última consulta</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
            <Stethoscope className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">
              {new Set(MOCK_RECORDS.map((r) => r.doctor.full_name)).size}
            </p>
            <p className="text-sm text-gray-500">Doctores</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <TableFilters
        filters={filtersConfig}
        onClear={handleCleanFilters}
        showClearButton={true}
      />

      {/* Medical records timeline */}
      <div className="space-y-4">
        {MOCK_RECORDS.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              No tienes historias clínicas aún
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Las historias clínicas aparecerán aquí después de tus consultas
            </p>
          </div>
        ) : (
          MOCK_RECORDS.map((record) => {
            const isExpanded = expandedId === record.id;

            return (
              <div
                key={record.id}
                className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
              >
                {/* Card header: clickable to expand */}
                <button
                  onClick={() => toggleExpand(record.id)}
                  className="w-full flex items-start sm:items-center justify-between p-5 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    {/* Date badge */}
                    <div className="hidden sm:flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-emerald-50 border border-emerald-100 shrink-0">
                      <span className="text-xs font-bold text-emerald-600 uppercase">
                        {new Date(record.appointment_date)
                          .toLocaleDateString("es-ES", { month: "short" })
                          .replace(".", "")}
                      </span>
                      <span className="text-xl font-bold text-emerald-700">
                        {new Date(record.appointment_date).getDate()}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-gray-400 shrink-0 sm:hidden" />
                        <span className="text-sm text-gray-500 sm:hidden">
                          {formatDate(record.appointment_date)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-800 text-left">
                        Dr. {record.doctor.full_name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Stethoscope className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="text-sm text-gray-500">
                          {record.doctor.specialty}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    {record.annexes.length > 0 && (
                      <span className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
                        <FileText className="w-3.5 h-3.5" />
                        {record.annexes.length} anexo
                        {record.annexes.length !== 1 ? "s" : ""}
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-gray-100">
                    {/* Mobile date */}
                    <div className="sm:hidden px-5 pt-4 flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {formatDate(record.appointment_date)}
                    </div>

                    {/* Diagnosis & Treatment */}
                    <div className="p-5 space-y-5">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-4 h-4 text-emerald-600" />
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                            Diagnóstico Inicial
                          </p>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {record.initial_diagnosis}
                        </p>
                      </div>

                      <div className="border-t border-gray-100 pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-emerald-600" />
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                            Plan de Tratamiento
                          </p>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                          {record.treatment_plan}
                        </p>
                      </div>

                      {/* Annexes */}
                      {record.annexes.length > 0 && (
                        <div className="border-t border-gray-100 pt-4">
                          <div className="flex items-center gap-2 mb-3">
                            <FileText className="w-4 h-4 text-amber-600" />
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                              Anexos ({record.annexes.length})
                            </p>
                          </div>
                          <div className="space-y-2">
                            {record.annexes.map((annexe) => (
                              <div
                                key={annexe.id}
                                className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm">
                                      {getAnnexeTypeIcon(annexe.type)}
                                    </span>
                                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                      {getAnnexeTypeLabel(annexe.type)}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  {annexe.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Created date */}
                      <div className="border-t border-gray-100 pt-4 flex items-center gap-1.5 text-xs text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        Registrado el {formatDate(record.created_at)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          Total: {MOCK_TOTAL} historias clínicas
          <span className="ml-2">
            Página {page} de {MOCK_TOTAL_PAGES}
          </span>
        </p>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
            className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Anterior
          </button>
          <button
            disabled={page >= MOCK_TOTAL_PAGES}
            onClick={() => handlePageChange(page + 1)}
            className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
