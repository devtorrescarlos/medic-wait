import { useMutation } from "@tanstack/react-query";
import { registerUser, loginUser, confirmAccount, forgotPassword, verifyToken, resendConfirmationEmail, resetPassword } from "../../services/authService";
import type { RegisterForm, LoginForm } from "../../types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { decodeJWT } from "../../utils/jwt";
import { useAuth } from "./useAuth";



export const useAuthMutations = () => {

    const { login } = useAuth();
    const navigate = useNavigate();

    const registerMutation = useMutation({
        mutationFn: (data: RegisterForm) => registerUser(data),
        onError: (error) => {
            if (isAxiosError(error) && error.response) {
                toast.error(error.response.data.message);
            }
        },
        onSuccess: (data) => {
            toast.success(data.message);
            navigate("/auth/login");
        }
    })

    const loginMutation = useMutation({
        mutationFn: (data: LoginForm) => loginUser(data),
        onError: (error) => {
            if (isAxiosError(error) && error.response) {
                toast.error(error.response.data.message);
            }
        },
        onSuccess: (data) => {
            login(data.token);
            toast.success(data.message);
            const decoded = decodeJWT(data.token);
            const role = decoded?.role || 'patient';
            navigate(`/dashboard/${role}`);
        }
    })

    const confirmAccountMutation = useMutation({
        mutationFn: (token: string) => confirmAccount(token),
        onError: (error) => {
            if (isAxiosError(error) && error.response) {
                toast.error(error.response.data.message);
            }
        },
        onSuccess: (data) => {
            toast.success(data.message);
            navigate("/auth/login");
        }
    })

    const forgotPasswordMutation = useMutation({
        mutationFn: (data: { email: string }) => forgotPassword(data),
        onError: (error) => {
            if (isAxiosError(error) && error.response) {
                toast.error(error.response.data.message);
            }
        },
        onSuccess: (data) => {
            toast.success(data.message);
        }
    })

    const verifyTokenMutation = useMutation({
        mutationFn: (token: string) => verifyToken(token),
        onError: (error) => {
            if (isAxiosError(error) && error.response) {
                navigate("/auth/login");
            }

        }
    })

    const resendConfirmationEmailMutation = useMutation({
        mutationFn: (data: { email: string }) => resendConfirmationEmail(data.email),
        onError: (error) => {
            if (isAxiosError(error) && error.response) {
                toast.error(error.response.data.message);
            }
        },
        onSuccess: (data) => {
            toast.success(data.message);
        }
    })

    const resetPasswordMutation = useMutation({
        mutationFn: (data: { password: string, token: string }) => resetPassword(data.token, { password: data.password }),
        onError: (error) => {
            if (isAxiosError(error) && error.response) {
                toast.error(error.response.data.message);
            }
        },
        onSuccess: (data) => {
            toast.success(data.message);
            navigate("/auth/login");
        }
    })

    return {
        registerMutation,
        loginMutation,
        confirmAccountMutation,
        forgotPasswordMutation,
        verifyTokenMutation,
        resendConfirmationEmailMutation,
        resetPasswordMutation
    }
}
