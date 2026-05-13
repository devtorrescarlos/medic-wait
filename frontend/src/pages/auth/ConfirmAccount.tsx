import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuthMutations } from "../../hooks/auth/useAuthMutations";
import { useEffect, useRef } from "react";


export default function ConfirmAccountPage() {

    const { token } = useParams();
    const { confirmAccountMutation, verifyTokenMutation } = useAuthMutations();
    const hasVerified = useRef(false);

    useEffect(() => {
        if (token && !hasVerified.current) {
            hasVerified.current = true;
            verifyTokenMutation.mutate(token);
        }
    }, [token]);

    const handleOnClick = () => {
        if (token) {
            confirmAccountMutation.mutate(token);
        }
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Confirma tu cuenta e inicia sesión para gestionar tus citas médicas
            </h2>

            <button
                onClick={handleOnClick}
                disabled={confirmAccountMutation.isPending}
                className="w-full flex cursor-pointer justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {confirmAccountMutation.isPending ? "Confirmando..." : "Confirmar cuenta"}
            </button>


            <p className="mt-8 text-center text-sm text-gray-500">
                <Link to="/auth/login" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
                    Volver a iniciar sesión
                </Link>
            </p>
        </div >
    );
}
