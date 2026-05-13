import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorMessage from "../../components/shared/ErrorMessage";
import { useAuthMutations } from "../../hooks/auth/useAuthMutations";

type ForgotPasswordForm = {
    email: string;
}

const initialValues: ForgotPasswordForm = {
    email: "",
}

export default function ForgotPasswordPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>({ defaultValues: initialValues });

    const { forgotPasswordMutation } = useAuthMutations();

    const handleOnSubmit = (data: ForgotPasswordForm) => {
        forgotPasswordMutation.mutate(data);
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                ¿Olvidaste tu contraseña?
            </h2>
            <p className="text-gray-500 mb-8">
                Ingresa tu correo electrónico y te enviaremos las instrucciones para recuperarla
            </p>

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

                <button
                    type="submit"
                    disabled={forgotPasswordMutation.isPending}
                    className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {forgotPasswordMutation.isPending ? "Enviando..." : "Enviar instrucciones"}
                </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500">
                ¿Recordaste tu contraseña?{" "}
                <Link to="/auth/login" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
                    Inicia sesión
                </Link>
            </p>
        </div>
    );
}
