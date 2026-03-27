import { useAuth } from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import ErrorMessage from "../shared/ErrorMessage";

type FormData = {
    email: string;
}

export default function ResendConfirmationEmailForm() {
    const { resendConfirmationEmailMutation } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    const handleOnSubmit = (data: FormData) => {
        resendConfirmationEmailMutation.mutate(data);
    }

    return (
        <form onSubmit={handleSubmit(handleOnSubmit)}>
            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico
                </label>
                <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Ingresa tu correo electrónico"
                    {...register("email", {
                        required: "El correo electrónico es obligatorio",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "El correo electrónico no es válido"
                        }
                    })}
                />
                {errors.email && <ErrorMessage message={errors.email.message as string} />}
            </div>

            <button
                type="submit"
                disabled={resendConfirmationEmailMutation.isPending}
                className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
                Reenviar correo de confirmación
            </button>
        </form>
    )
}
