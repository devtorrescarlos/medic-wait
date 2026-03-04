import User, { UserRole } from "../../models/User"
import type { registerData, loginData } from "../../types/auth.types"
import { hashPassword, comparePassword } from "../../utils/bcrypt";
import { generateToken } from "../../utils/token";
import { sendVerificationEmail, sendForgotPasswordEmail } from "../../emails";
import { generateJWT } from "../../utils/jwt";


export const register = async (userData: registerData) => {
    const { email, password, fullName, role } = userData;
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
        throw {
            status: 400,
            message: "El Usuario ya existe. Inicia Sesión con tus credenciales"
        }
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
        email,
        password: hashedPassword,
        fullName,
        role
    })

    const token = generateToken();
    user.token = token;
    await user.save();

    sendVerificationEmail(email, token);

    return;
}

export const login = async (userData: loginData) => {
    const { email, password } = userData;

    const user = await User.findOne({ where: { email } });

    if (!user) {
        throw {
            status: 404,
            message: "Usuario no encontrado"
        }
    }

    if (!user.is_email_verified) {
        throw {
            status: 403,
            message: "Usuario inactivo. Por favor, verifica tu cuenta"
        }
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
        throw {
            status: 401,
            message: "Credenciales incorrectas"
        }
    }

    if (user.role === UserRole.DOCTOR && !user.is_approved_by_admin) {
        throw {
            status: 403,
            message: "El Doctor no ha sido aprobado por el administrador"
        }
    }

    const token = generateJWT(user.id);

    return token;
}

export const confirmAccount = async (token: string) => {
    const user = await User.findOne({ where: { token } });

    if (!user) {
        throw {
            status: 401,
            message: "Token no válido"
        }
    }

    user.is_email_verified = true;
    user.token = "";
    await user.save();

    return;
}

export const forgotPassword = async (email: string) => {
    const user = await User.findOne({ where: { email } });

    if (!user) {
        throw {
            status: 404,
            message: "Usuario no encontrado"
        }
    }

    const token = generateToken();
    user.token = token;
    await user.save();

    sendForgotPasswordEmail(email, token);

    return;
}

export const verifyToken = async (token: string) => {
    const user = await User.findOne({ where: { token } });

    if (!user) {
        throw {
            status: 401,
            message: "Token no válido"
        }
    }

    return;
}

export const resetPasswordWithToken = async (token: string, password: string) => {
    const user = await User.findOne({ where: { token } });

    if (!user) {
        throw {
            status: 401,
            message: "Token no válido"
        }
    }

    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    user.token = "";
    await user.save();

    return;
}