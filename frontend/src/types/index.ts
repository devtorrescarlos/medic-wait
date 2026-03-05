
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