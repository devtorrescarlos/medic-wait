import jwt from "jsonwebtoken";

export const generateJWT = (id: string, role: string) => {
    const token = jwt.sign({ id, role }, process.env.SUPER_SECRET as string, { expiresIn: "1d" });
    return token;
}

export const generateVerificationJWT = (id: string) => {
    const token = jwt.sign({ id }, process.env.VERIFICATION_SECRET as string, { expiresIn: "15m" });
    return token;
}

export const verifyVerificationJWT = (token: string) => {
    try {
        const decoded = jwt.verify(token, process.env.VERIFICATION_SECRET as string) as { id: string };
        return decoded;
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            throw {
                status: 401,
                message: "El token ha expirado. Por favor, solicita un nuevo correo de verificación"
            };
        }
        throw {
            status: 401,
            message: "Token no válido"
        };
    }
}