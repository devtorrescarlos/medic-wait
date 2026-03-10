import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { registerUser, loginUser, confirmAccount, forgotPassword, verifyToken, resendConfirmationEmail, resetPassword } from "../services/authService";
import type { RegisterForm, LoginForm } from "../types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { decodeJWT } from "../utils/jwt";



export const useAuth = () => {

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const registerMutation = useMutation({
        onMutate: () => {
            setIsLoading(true);
        },
        mutationFn: (data: RegisterForm) => registerUser(data),
        onError: (error) => {
            if (isAxiosError(error) && error.response) {
                toast.error(error.response.data.message);
            }
        },
        onSuccess: (data) => {
            toast.success(data.message);
            navigate("/auth/login");
        },
        onSettled: () => {
            setIsLoading(false);
        }
    })

    const loginMutation = useMutation({
        onMutate: () => {
            setIsLoading(true);
        },
        mutationFn: (data: LoginForm) => loginUser(data),
        onError: (error) => {
            if (isAxiosError(error) && error.response) {
                toast.error(error.response.data.message);
            }
        },
        onSuccess: (data) => {
            localStorage.setItem("token", data.token);
            toast.success(data.message);
            setUser(data.user);
            const decoded = decodeJWT(data.token);
            const role = decoded?.role || 'patient';
            navigate(`/dashboard/${role}`);
        },
        onSettled: () => {
            setIsLoading(false);
        }
    })

    const confirmAccountMutation = useMutation({
        onMutate: () => {
            setIsLoading(true);
        },
        mutationFn: (token: string) => confirmAccount(token),
        onError: (error) => {
            if (isAxiosError(error) && error.response) {
                toast.error(error.response.data.message);
            }
        },
        onSuccess: (data) => {
            toast.success(data.message);
            navigate("/auth/login");
        },
        onSettled: () => {
            setIsLoading(false);
        }
    })

    const forgotPasswordMutation = useMutation({
        onMutate: () => {
            setIsLoading(true);
        },
        mutationFn: (data: { email: string }) => forgotPassword(data),
        onError: (error) => {
            if (isAxiosError(error) && error.response) {
                toast.error(error.response.data.message);
            }
        },
        onSuccess: (data) => {
            toast.success(data.message);
        },
        onSettled: () => {
            setIsLoading(false);
        }
    })

    const verifyTokenMutation = useMutation({
        onMutate: () => {
            setIsLoading(true);
        },
        mutationFn: (token: string) => verifyToken(token),
        onError: (error) => {
            if (isAxiosError(error) && error.response) {
                navigate("/auth/login");
            }

        },
        onSuccess: (data) => {
            toast.success(data.message);
        },
        onSettled: () => {
            setIsLoading(false);
        }
    })

    const resendConfirmationEmailMutation = useMutation({
        onMutate: () => {
            setIsLoading(true);
        },
        mutationFn: (data: { email: string }) => resendConfirmationEmail(data.email),
        onError: (error) => {
            if (isAxiosError(error) && error.response) {
                toast.error(error.response.data.message);
            }
        },
        onSuccess: (data) => {
            toast.success(data.message);
        },
        onSettled: () => {
            setIsLoading(false);
        }
    })

    const resetPasswordMutation = useMutation({
        onMutate: () => {
            setIsLoading(true);
        },
        mutationFn: (data: { password: string, token: string }) => resetPassword(data.token, { password: data.password }),
        onError: (error) => {
            if (isAxiosError(error) && error.response) {
                toast.error(error.response.data.message);
            }
        },
        onSuccess: (data) => {
            toast.success(data.message);
            navigate("/auth/login");
        },
        onSettled: () => {
            setIsLoading(false);
        }
    })

    return {
        registerMutation,
        loginMutation,
        confirmAccountMutation,
        forgotPasswordMutation,
        verifyTokenMutation,
        resendConfirmationEmailMutation,
        resetPasswordMutation,
        isLoading
    }
}
