import { Link } from "react-router-dom";
import RegisterForm from "../../components/auth/RegisterForm";


export default function RegisterPage() {
    return (
        <>
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Crear cuenta
                </h2>
                <p className="text-gray-500 mb-8">
                    Únete a MedicWait y gestiona tus citas médicas
                </p>

                <RegisterForm />

                <p className="mt-8 text-center text-sm text-gray-500">
                    ¿Ya tienes una cuenta?{" "}
                    <Link to="/auth/login" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
                        Inicia sesión
                    </Link>
                </p>
            </div >
        </>
    );
}
