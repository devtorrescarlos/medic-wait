import { Link } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Bienvenido de nuevo
      </h2>
      <p className="text-gray-500 mb-8">
        Ingresa tus credenciales para acceder a tu cuenta
      </p>

      <LoginForm />

      <div className="mt-8 flex flex-col items-center">
        <p className="text-center text-sm text-gray-500">
          ¿No tienes una cuenta?{" "}
          <Link
            to="/auth/create-account"
            className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
          >
            Regístrate aquí
          </Link>
        </p>
        <p className="mt-8 text-center text-sm text-gray-500">
          ¿Aún no has activado tu cuenta?{" "}
          <Link
            to="/auth/resend-confirmation-email"
            className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
          >
            Activa tu cuenta aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
