import { DoctorSpecialty, UserRole } from "../models/User";

export type registerData = {
    email: string,
    password: string,
    fullName: string,
    is_active?: boolean,
    token?: string,
    role?: UserRole,
    specialty?: DoctorSpecialty
}

export type registerWithRole = registerData & {
    requesterRole: UserRole
}

export type loginData = {
    email: string,
    password: string
}   