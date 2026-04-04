import ResetPasswordForm from "../../components/auth/ResetPasswordForm";
import { useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAuth } from "../../hooks/auth/useAuth";


export default function ResetPasswordPage() {
    const { token } = useParams();
    const { verifyTokenMutation } = useAuth();

    const hasVerified = useRef(false);

    useEffect(() => {
        if (token && !hasVerified.current) {
            hasVerified.current = true;
            verifyTokenMutation.mutate(token);
        }
    }, [token]);
    return (
        <>
            <h1 className="text-3xl font-bold text-gray-900">Restablecer contraseña</h1>
            <p className="text-gray-600 mt-2">Ingresa tu nueva contraseña</p>

            <ResetPasswordForm token={token as string} />
        </>
    )
}
