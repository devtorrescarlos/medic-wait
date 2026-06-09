import { useState } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "../shared/ErrorMessage";
import type { RegisterForm } from "../../types";
import { specialties } from "../../constants/specialties";
import { useAuthMutations } from "../../hooks/auth/useAuthMutations";
import {
  Mail,
  Stethoscope,
  User,
  UserCircle,
  Lock,
  ShieldCheck,
  Calendar,
} from "lucide-react";

const initialValues = {
  full_name: "",
  email: "",
  password: "",
  age: "",
  confirmPassword: "",
  specialty: "",
};

export default function RegisterForm() {
  const [isDoctor, setIsDoctor] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({ defaultValues: initialValues });
  const { registerMutation } = useAuthMutations();

  const handleOnSubmit = (data: RegisterForm) => {
    const { confirmPassword, specialty, ...rest } = data;

    const payload = isDoctor
      ? { ...rest, role: "doctor", specialty }
      : { ...rest, role: "patient" };

    registerMutation.mutate(payload);
  };

  return (
    <>
      <form className="space-y-5" onSubmit={handleSubmit(handleOnSubmit)}>
        <div>
          <label
            htmlFor="full_name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nombre Completo
          </label>
          <div className="flex items-center gap-2 w-full outline-none pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all duration-200 placeholder:text-gray-400">
            <User className="text-gray-400 shrink-0" size={24} />
            <input
              className="w-full outline-none text-gray-600"
              id="full_name"
              type="text"
              placeholder="Nombre Apellido"
              {...register("full_name", {
                required: "El nombre es requerido",
                minLength: {
                  value: 3,
                  message: "El nombre debe tener al menos 3 caracteres",
                },
              })}
            />
          </div>
          {errors.full_name && (
            <ErrorMessage message={errors.full_name.message as string} />
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Correo electrónico
          </label>
          <div className="flex items-center gap-2 w-full outline-none pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all duration-200 placeholder:text-gray-400">
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
          <label
            htmlFor="age"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Edad
          </label>
          <div className="flex items-center gap-2 w-full outline-none pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all duration-200 placeholder:text-gray-400">
            <Calendar className="text-gray-400 shrink-0" size={24} />
            <input
              id="age"
              type="number"
              className="w-full outline-none text-gray-600"
              placeholder="Edad"
              {...register("age", {
                required: "La edad es requerida",
              })}
            />
          </div>
          {errors.age && (
            <ErrorMessage message={errors.age.message as string} />
          )}
        </div>

        <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <UserCircle className="text-emerald-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Soy profesional de la salud
              </p>
              <p className="text-xs text-gray-500">
                Activa si eres médico o especialista
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsDoctor(!isDoctor)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${isDoctor ? "bg-emerald-600" : "bg-gray-300"}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${isDoctor ? "translate-x-6" : "translate-x-1"}`}
            />
          </button>
        </div>

        {isDoctor && (
          <div>
            <label
              htmlFor="specialty"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Especialidad
            </label>
            <div className="flex items-center gap-2 w-full outline-none pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all duration-200">
              <Stethoscope className="text-gray-400 shrink-0" size={24} />
              <select
                id="specialty"
                className="w-full outline-none text-gray-600 appearance-none bg-transparent"
                {...register("specialty", {
                  required: isDoctor ? "La especialidad es requerida" : false,
                })}
              >
                <option value="">Selecciona tu especialidad</option>
                {specialties.map((specialty) => (
                  <option key={specialty.value} value={specialty.value}>
                    {specialty.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.specialty && (
              <ErrorMessage message={errors.specialty.message as string} />
            )}
          </div>
        )}

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Contraseña
          </label>
          <div className="flex items-center gap-2 w-full outline-none pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all duration-200 placeholder:text-gray-400">
            <Lock className="text-gray-400 shrink-0" size={24} />
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full outline-none text-gray-600"
              {...register("password", {
                required: "La contraseña es requerida",
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener al menos 6 caracteres",
                },
              })}
            />
          </div>
          {errors.password && (
            <ErrorMessage message={errors.password.message as string} />
          )}
          <p className="mt-2 text-xs text-gray-500">Mínimo 6 caracteres</p>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirmar contraseña
          </label>
          <div className="flex items-center gap-2 w-full outline-none pl-4 pr-4 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all duration-200 placeholder:text-gray-400">
            <ShieldCheck className="text-gray-400 shrink-0" size={24} />
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="w-full outline-none text-gray-600"
              {...register("confirmPassword", {
                required: "Confirmar contraseña es requerido",
                validate: (value) =>
                  value === watch("password") || "Las contraseñas no coinciden",
              })}
            />
          </div>
          {errors.confirmPassword && (
            <ErrorMessage message={errors.confirmPassword.message as string} />
          )}
        </div>

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {registerMutation.isPending ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>
    </>
  );
}
