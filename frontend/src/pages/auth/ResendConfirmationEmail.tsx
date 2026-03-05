import ResendConfirmationEmailForm from "../../components/auth/ResendConfirmationEmailForm";
import { Link } from "react-router-dom";

export default function ResendConfirmationEmailPage() {
    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Reenvia el correo de confirmación
            </h2>
            <p className="text-gray-500 mb-8">
                Ingresa tu correo electrónico para reenviar el correo de confirmación
            </p>

            <ResendConfirmationEmailForm />

            <nav className="mt-10 flex flex-col space-y-4">
                <Link
                    to="/auth/login"
                    className="text-center text-gray-500 hover:text-gray-900"
                >
                    ¿Ya tienes cuenta? <span className="text-emerald-600 hover:text-emerald-900">Inicia sesión</span>
                </Link>

                <Link
                    to="/auth/create-account"
                    className="text-center text-gray-500 hover:text-gray-900"
                >
                    ¿No tienes una cuenta? <span className=" text-emerald-600 hover:text-emerald-900">Regístrate aquí</span>
                </Link>
            </nav>
        </div>
    )
}
