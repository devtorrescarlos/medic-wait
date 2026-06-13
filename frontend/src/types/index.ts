export type RegisterForm = {
  full_name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  specialty?: string;
  role?: string;
  age: string;
};

export type LoginForm = {
  email: string;
  password: string;
};

export type User = {
  email: string;
  id: string;
  full_name: string;
  age: string;
  specialty_id?: string;
  is_approved_by_admin: boolean;
};

export type Slot = {
  id: string;
  start_time: string;
  end_time: string;
  date: string;
  is_available: boolean;
  is_active: boolean;
  schedule: ScheduleData;
  created_at: string;
  updated_at: string;
};

export type SlotsData = {
  slots: Slot[];
  day_of_week: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

export type ScheduleData = {
  id: string;
  doctor_id?: string;
  updatedAt?: string;
  createdAt?: string;
  start_time: string;
  end_time: string;
  day_of_week: string;
  is_active: boolean;
};

export type ScheduleFormData = {
  id?: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  slot_duration?: number;
  is_active?: boolean;
};

export type Role = {
  id: string;
  name: string;
};

export type Appointment = {
  id: string;
  reason: string;
  status: string;
  doctor_id: string;
  patient_id: string;
  cancellation_reason: string;
  slot_id: string;
  created_at: string;
  updated_at: string;
  slot: Slot;
  doctor: Pick<User, "full_name" | "id">;
  patient: Pick<User, "full_name" | "id" | "email" | "age">;
};

export type AppointmentsData = {
  appointments: Appointment[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

export type Patient = {
  id: string;
  email: string;
  full_name: string;
  age: string;
};

export type PatientResponse = {
  totalPatients: number;
  patients: Patient[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

export type MedicalRecordAnnexe = {
  id: string;
  type: string;
  medical_record_id?: string;
  doctor_id?: string;
  content: string;
  medicalRecord: Pick<MedicalRecord, "patient_id" | "patient">;
  created_at: string;
};

export type MedicalRecord = {
  id: string;
  appointment_id: string;
  patient: Pick<User, "id" | "full_name" | "email" | "age">;
  patient_id: string;
  doctor_id: string;
  initial_diagnosis: string;
  treatment_plan: string;
  created_at: string;
  updated_at: string;
  annexes: MedicalRecordAnnexe[];
};

export type PatientByIdResponse = {
  patient: Patient;
  medicalRecords: MedicalRecord[];
  lastAppointment: Appointment | null;
  appointmentsCount: number;
};

export type MedicalRecordFormData = {
  id?: string;
  appointment_id: string;
  patient_id: string;
  doctor_id: string;
  initial_diagnosis: string;
  treatment_plan: string;
};

export type MedicalRecordAnnexeData = {
  id?: string;
  type: string;
  content: string;
};

export type AIGenerateInput = {
  mode: "initial_diagnosis" | "treatment_plan" | "annexe" | "custom";
  context: {
    patientName?: string;
    patientAge?: string;
    appointmentReason?: string;
    annexeType?: string;
    existingDiagnosis?: string;
    existingTreatment?: string;
  };
  customPrompt?: string;
};
