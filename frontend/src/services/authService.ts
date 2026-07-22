import api from "../api/axios";
import type { RegisterForm, LoginForm } from "../types";

export const registerUser = async (data: RegisterForm) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const loginUser = async (data: LoginForm) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const confirmAccount = async (token: string) => {
  const response = await api.post(`/auth/confirm-account/${token}`);
  return response.data;
};

export const forgotPassword = async (data: { email: string }) => {
  const response = await api.post("/auth/forgot-password", data);
  return response.data;
};

export const verifyToken = async (token: string) => {
  const response = await api.post(`/auth/verify-token/${token}`);
  return response.data;
};

export const resendConfirmationEmail = async (email: string) => {
  const response = await api.post("/auth/resend-confirmation-email", { email });
  return response.data;
};

export const resetPassword = async (
  token: string,
  data: { password: string },
) => {
  const response = await api.post(`/auth/reset-password/${token}`, data);
  return response.data;
};

export const getUser = async () => {
  const response = await api.get("/auth/user");
  return response.data;
};

export const getRole = async () => {
  const response = await api.get("/auth/role");
  return response.data.role;
};

export const getSpecialties = async () => {
  const response = await api.get("/auth/specialties");
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};
