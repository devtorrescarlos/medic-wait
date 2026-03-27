import api from "../api/axios";
import type { RegisterForm, LoginForm } from "../types";

export const registerUser = async (data: RegisterForm) => {
    const url = `${import.meta.env.VITE_API_URL}/auth/register`;
    const response = await api.post(url, data);
    return response.data;
}

export const loginUser = async (data: LoginForm) => {
    const url = `${import.meta.env.VITE_API_URL}/auth/login`;
    const response = await api.post(url, data);
    return response.data;
}

export const confirmAccount = async (token: string) => {
    const url = `${import.meta.env.VITE_API_URL}/auth/confirm-account/${token}`;
    const response = await api.post(url);
    return response.data;
}

export const forgotPassword = async (data: { email: string }) => {
    const url = `${import.meta.env.VITE_API_URL}/auth/forgot-password`;
    const response = await api.post(url, data);
    return response.data;
}

export const verifyToken = async (token: string) => {
    const url = `${import.meta.env.VITE_API_URL}/auth/verify-token/${token}`;
    const response = await api.post(url);
    return response.data;
}

export const resendConfirmationEmail = async (email: string) => {
    const url = `${import.meta.env.VITE_API_URL}/auth/resend-confirmation-email`;
    const response = await api.post(url, { email });
    return response.data;
}

export const resetPassword = async (token: string, data: { password: string }) => {
    const url = `${import.meta.env.VITE_API_URL}/auth/reset-password/${token}`;
    const response = await api.post(url, data);
    return response.data;
}

export const getUser = async () => {
    const url = `${import.meta.env.VITE_API_URL}/auth/user`;
    const response = await api.get(url);
    return response.data;
}