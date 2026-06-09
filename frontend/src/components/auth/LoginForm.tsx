import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuthMutations } from "../../hooks/auth/useAuthMutations";
import ErrorMessage from "../shared/ErrorMessage";
import type { LoginForm } from "../../types";
import { Mail, Lock } from "lucide-react";

const initialValues: LoginForm = {
  email: "",
  password: "",
};

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ defaultValues: initialValues });

  const { loginMutation } = useAuthMutations();

  const handleOnSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(handleOnSubmit)}>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Correo electrónico
        </label>

        <div className="flex items-center gap-2 outline-none pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all duration-200 placeholder:text-gray-400">
          <Mail className="text-gray-400 shrink-0" size={24} />
          <input
            id="email"
            type="email"
            className="w-full outline-none text-gray-600"
            placeholder="correo@ejemplo.com"
            {...register("email", {
              required: "El correo es requerido",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Correo electrónico inválido",
              },
            })}
          />
        </div>
        {errors.email && (
          <ErrorMessage message={errors.email.message as string} />
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Contraseña
          </label>
          <Link
            to="/auth/forgot-password"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <div className="flex items-center gap-2 outline-none pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all duration-200 placeholder:text-gray-400">
          <Lock className="text-gray-400 shrink-0" size={24} />
          <input
            id="password"
            type="password"
            className="w-full outline-none text-gray-600"
            placeholder="Contraseña"
            {...register("password", {
              required: "La contraseña es requerida",
            })}
          />
        </div>
        {errors.password && (
          <ErrorMessage message={errors.password.message as string} />
        )}
      </div>

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full cursor-pointer flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loginMutation.isPending ? "Iniciando sesión..." : "Iniciar sesión"}
      </button>
    </form>
  );
}
