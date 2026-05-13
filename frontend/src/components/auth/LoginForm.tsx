import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuthMutations } from "../../hooks/auth/useAuthMutations";
import ErrorMessage from "../shared/ErrorMessage";
import type { LoginForm } from "../../types";


const initialValues: LoginForm = {
    email: "",
    password: "",
}

export default function LoginForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({ defaultValues: initialValues });

    const { loginMutation } = useAuthMutations();

    const handleOnSubmit = (data: LoginForm) => {
        loginMutation.mutate(data);
    }

    return (
        <form className="space-y-5" onSubmit={handleSubmit(handleOnSubmit)}>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                    </div>
                    <input
                        id="email"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        className="block w-full outline-none pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder:text-gray-400"
                        {...register("email", {
                            required: "El correo es requerido",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Correo electrónico inválido"
                            }
                        })}
                    />
                </div>
                {errors.email && <ErrorMessage message={errors.email.message as string} />}
            </div>

            <div>
                <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Contraseña
                    </label>
                    <Link to="/auth/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="block w-full outline-none pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder:text-gray-400"
                        {...register("password", {
                            required: "La contraseña es requerida"
                        })}
                    />
                </div>
                {errors.password && <ErrorMessage message={errors.password.message as string} />}
            </div>

            <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full cursor-pointer flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loginMutation.isPending ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
        </form>
    )
}
