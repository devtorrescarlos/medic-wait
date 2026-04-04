
export type RegisterForm = {
    fullName: string;
    email: string;
    password: string;
    confirmPassword?: string;
    specialty?: string;
    role?: string;
}

export type LoginForm = {
    email: string;
    password: string;
}

export type User = {
    email: string;
    id: string;
    role: string;
    fullName: string;
    is_approved_by_admin: boolean;
}

export type Slot = {
    id: string;
    start_time: string;
    end_time: string;
    date: string;
    is_available: boolean;
    schedule: {
        day_of_week: string;
    }
    createdAt: string;
}

export type SlotsData = {
    slots: Slot[];
    day_of_week: string;
    currentPage: number;
    totalPages: number;
    totalItems: number;
}

export type ScheduleData = {
    id: string;
    doctor_id?: string;
    updatedAt?: string;
    createdAt?: string;
    start_time: string;
    end_time: string;
    day_of_week: string;
    is_active: boolean;
}

export type ScheduleFormData = {
    id?: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
    slot_duration?: number;
    is_active?: boolean;
}
