import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/auth/useAuth";
import ErrorMessage from "../shared/ErrorMessage";

export default function ResetPasswordForm({ token }: { token: string }) {
    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        defaultValues: {
            password: "",
            confirmPassword: ""
        }
    });
    const { resetPasswordMutation } = useAuth();

    const handleOnSubmit = (data: { password: string, confirmPassword: string }) => {

        const { confirmPassword, ...rest } = data;

        resetPasswordMutation.mutate({ password: rest.password, token });
    }

    return (
        <div>
            <form onSubmit={handleSubmit(handleOnSubmit)}>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
                        Nueva contraseña
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Ingresa tu nueva contraseña"
                        {...register("password", {
                            required: "La contraseña es obligatoria",
                            minLength: {
                                value: 6,
                                message: "La contraseña debe tener al menos 6 caracteres"
                            }
                        })}
                    />
                    {errors.password && <ErrorMessage message={errors.password.message as string} />}
                </div>

                <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block text-gray-700 font-bold mb-2">
                        Confirmar contraseña
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Confirma tu nueva contraseña"
                        {...register("confirmPassword", {
                            required: "Confirmar contraseña es requerido",
                            validate: (value) =>
                                value === watch("password") || "Las contraseñas no coinciden"
                        })}
                    />
                    {errors.confirmPassword && <ErrorMessage message={errors.confirmPassword.message as string} />}
                </div>

                <button
                    type="submit"
                    disabled={resetPasswordMutation.isPending}
                    className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700"
                >
                    Restablecer contraseña
                </button>
            </form>
        </div>
    )
}
