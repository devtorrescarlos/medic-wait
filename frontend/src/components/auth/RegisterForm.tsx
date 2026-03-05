import { useState } from "react"
import { useForm } from "react-hook-form"
import ErrorMessage from "../shared/ErrorMessage"
import type { RegisterForm } from "../../types";
import { specialties } from "../../data/specialties";
import { useAuth } from "../../hooks/useAuth";



const initialValues = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialty: "",
}

export default function RegisterForm() {
    const [isDoctor, setIsDoctor] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>({ defaultValues: initialValues });
    const { isLoading, registerMutation } = useAuth();


    const handleOnSubmit = async (data: RegisterForm) => {
        const { confirmPassword, specialty, ...rest } = data;

        const payload = isDoctor
            ? { ...rest, role: "doctor", specialty }
            : { ...rest, role: "patient" };

        registerMutation.mutate(payload);
    }

    return (
        <>
            <form className="space-y-5" onSubmit={handleSubmit(handleOnSubmit)}>
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre Completo
                    </label>
                    <input
                        id="fullName"
                        type="text"
                        placeholder="Nombre Apellido"
                        className="block w-full outline-none px-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder:text-gray-400"
                        {...register("fullName", {
                            required: "El nombre es requerido",
                            minLength: {
                                value: 3,
                                message: "El nombre debe tener al menos 3 caracteres"
                            }
                        })}
                    />
                    {errors.fullName && <ErrorMessage message={errors.fullName.message as string} />}
                </div>
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

                <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">Soy profesional de la salud</p>
                            <p className="text-xs text-gray-500">Activa si eres médico o especialista</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsDoctor(!isDoctor)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${isDoctor ? 'bg-emerald-600' : 'bg-gray-300'}`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${isDoctor ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                    </button>
                </div>

                {isDoctor && (
                    <div>
                        <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-2">
                            Especialidad
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <select
                                id="specialty"
                                className="block outline-none w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 appearance-none"
                                {...register("specialty", {
                                    required: isDoctor ? "La especialidad es requerida" : false
                                })}
                            >
                                <option value="">Selecciona tu especialidad</option>
                                {specialties.map((specialty) => (
                                    <option key={specialty.value} value={specialty.value}>
                                        {specialty.label}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            {errors.specialty && <ErrorMessage message={errors.specialty.message as string} />}
                        </div>
                    </div>
                )}

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña
                    </label>
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
                            className="block outline-none w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder:text-gray-400"
                            {...register("password", {
                                required: "La contraseña es requerida",
                                minLength: {
                                    value: 6,
                                    message: "La contraseña debe tener al menos 6 caracteres"
                                }
                            })}
                        />
                    </div>
                    {errors.password && <ErrorMessage message={errors.password.message as string} />}
                    <p className="mt-2 text-xs text-gray-500">
                        Mínimo 6 caracteres
                    </p>
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar contraseña
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            className="block outline-none w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder:text-gray-400"
                            {...register("confirmPassword", {
                                required: "Confirmar contraseña es requerido",
                                validate: (value) =>
                                    value === watch("password") || "Las contraseñas no coinciden"
                            })}
                        />
                    </div>
                    {errors.confirmPassword && <ErrorMessage message={errors.confirmPassword.message as string} />}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
                >
                    Crear cuenta
                </button>
            </form >
        </>
    )
}
