import User from "../../models/User";
import Role from "../../models/Role";
import UserRole from "../../models/UserRole";
import type { RegisterData, LoginData } from "../../types/auth.types";
import { hashPassword, comparePassword } from "../../utils/bcrypt";
import { sendVerificationEmail, sendForgotPasswordEmail } from "../../emails";
import {
  generateAccessToken,
  generateRefreshToken,
  generateVerificationJWT,
  verifyRefreshToken,
  verifyEmailVerificationJWT,
} from "../../utils/jwt";
import { getUserRole } from "../../utils";
import Specialty from "../../models/Specialty";

export const register = async (userData: RegisterData) => {
  const { email, password, full_name, role, specialty_id, age } = userData;
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw {
      status: 400,
      message: "El Usuario ya existe. Inicia Sesión con tus credenciales",
    };
  }

  if (role) {
    const roleRecord = await Role.findOne({ where: { name: role } });
    if (roleRecord && Number(age) < 21) {
      throw {
        status: 400,
        message: "El usuario debe tener al menos 21 años para ser doctor",
      };
    }
  }

  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    email,
    password: hashedPassword,
    full_name,
    age,
    specialty_id: specialty_id || null,
  });

  if (role) {
    const roleRecord = await Role.findOne({ where: { name: role } });
    if (roleRecord) {
      await UserRole.create({ user_id: user.id, role_id: roleRecord.id });
    }
  } else {
    const defaultRole = await Role.findOne({ where: { name: "patient" } });
    if (defaultRole) {
      await UserRole.create({ user_id: user.id, role_id: defaultRole.id });
    }
  }
  const token = generateVerificationJWT(user.id);
  await sendVerificationEmail(email, token);
  return token;
};

export const login = async (userData: LoginData) => {
  const { email, password } = userData;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw {
      status: 404,
      message: "Usuario no encontrado",
    };
  }

  if (!user.is_email_verified) {
    throw {
      status: 403,
      message: "Usuario inactivo. Por favor, verifica tu cuenta",
    };
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw {
      status: 401,
      message: "Credenciales incorrectas",
    };
  }

  const userRole = await getUserRole(user.id);

  if (userRole === "doctor" && !user.is_approved_by_admin) {
    throw {
      status: 403,
      message: "El Doctor no ha sido aprobado por el administrador",
    };
  }

  const accessToken = generateAccessToken(user.id, userRole || "patient");
  const refreshToken = generateRefreshToken(user.id);

  user.refresh_token = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};

export const resendConfirmationEmail = async (email: string) => {
  const user = await User.findOne({ where: { email } });

  if (user) {
    if (user.is_email_verified) {
      throw {
        status: 400,
        message: "Usuario ya verificado",
      };
    }

    const token = generateVerificationJWT(user.id);
    await sendVerificationEmail(email, token);
  }

  return;
};

export const confirmAccount = async (token: string) => {
  const decoded = verifyEmailVerificationJWT(token);
  const user = await User.findByPk(decoded.id);

  if (!user) {
    throw {
      status: 404,
      message: "Usuario no encontrado",
    };
  }

  if (user.is_email_verified) {
    throw {
      status: 400,
      message: "Usuario ya verificado",
    };
  }

  user.is_email_verified = true;
  await user.save();

  return;
};

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ where: { email } });

  if (user) {
    const token = generateVerificationJWT(user.id);
    await sendForgotPasswordEmail(email, token);
  }

  return "Si el correo existe, recibirás un enlace de recuperación";
};

export const verifyToken = async (token: string) => {
  const decoded = verifyEmailVerificationJWT(token);
  const user = await User.findByPk(decoded.id);

  if (!user) {
    throw {
      status: 401,
      message: "Token no válido",
    };
  }

  return;
};

export const resetPasswordWithToken = async (
  token: string,
  password: string,
) => {
  const decoded = verifyEmailVerificationJWT(token);
  const user = await User.findByPk(decoded.id);

  if (!user) {
    throw {
      status: 401,
      message: "Token no válido",
    };
  }

  const hashedPassword = await hashPassword(password);
  user.password = hashedPassword;
  await user.save();

  return;
};

export const getSpecialties = async () => {
  const specialties = await Specialty.findAll();
  return specialties;
};

export const refreshToken = async (refreshToken: string) => {
  const user = await User.findOne({ where: { refresh_token: refreshToken } });

  if (!user) {
    throw {
      status: 401,
      message: "Token no válido",
    };
  }

  const decoded = verifyRefreshToken(refreshToken);

  if (decoded.id !== user.id) {
    throw {
      status: 401,
      message: "Token no válido",
    };
  }

  const userRole = await getUserRole(user.id);
  const accessToken = generateAccessToken(user.id, userRole || "patient");
  const newRefreshToken = generateRefreshToken(user.id);

  user.refresh_token = newRefreshToken;
  await user.save();

  return { accessToken, refreshToken: newRefreshToken };
};

export const logout = async (userId: string) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw {
      status: 404,
      message: "Usuario no encontrado",
    };
  }

  user.refresh_token = null;
  await user.save();
};
