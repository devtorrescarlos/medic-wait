import { DoctorSpecialty, UserRole } from "../models/User";

export type RegisterData = {
    email: string,
    password: string,
    fullName: string,
    is_active?: boolean,
    token?: string,
    role?: UserRole,
    specialty?: DoctorSpecialty
}

export type RegisterWithRole = RegisterData & {
    requesterRole: UserRole
}

export type LoginData = {
    email: string,
    password: string
}   