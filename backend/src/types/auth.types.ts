export type RegisterData = {
  email: string;
  password: string;
  full_name: string;
  age: number;
  role?: "admin" | "doctor" | "patient";
  specialty_id?: string;
};

export type RegisterWithRole = RegisterData & {
  requesterRole: string;
};

export type LoginData = {
  email: string;
  password: string;
};
