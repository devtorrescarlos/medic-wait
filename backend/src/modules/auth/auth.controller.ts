import { Request, Response } from "express";
import * as authService from "./auth.service";
import type { LoginData, RegisterData } from "../../types/auth.types";

export const register = async (req: Request, res: Response) => {
  const userData: RegisterData = req.body;
  try {
    const token = await authService.register(userData);
    res.status(201).json({
      message:
        "Usuario creado correctamente, revisa tu correo electrónico para verificar tu cuenta",
      token,
    });
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const userData: LoginData = req.body;
  try {
    const { accessToken, refreshToken } = await authService.login(userData);
    res.status(200).json({ accessToken, refreshToken });
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const confirmAccount = async (req: Request, res: Response) => {
  const token = req.params.token as string;
  try {
    await authService.confirmAccount(token);
    res.status(200).json({ message: "Cuenta confirmada correctamente" });
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    await authService.forgotPassword(email);
    res.status(200).json({
      message:
        "Se ha enviado un correo electrónico con las instrucciones para restablecer tu contraseña",
    });
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const resendConfirmationEmail = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    await authService.resendConfirmationEmail(email);
    res
      .status(200)
      .json({ message: "Correo electrónico de confirmación reenviado" });
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  const token = req.params.token as string;
  try {
    await authService.verifyToken(token);
    res.status(200).json({ message: "Token válido" });
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const resetPasswordWithToken = async (req: Request, res: Response) => {
  const { password } = req.body;
  const token = req.params.token as string;
  try {
    await authService.resetPasswordWithToken(token, password);
    res.status(200).json({ message: "Contraseña restablecida correctamente" });
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req: Request, res: Response) => {
  res.json({
    id: req.user!.id,
    email: req.user!.email,
    full_name: req.user!.full_name,
    age: req.user!.age,
    specialty_id: req.user!.specialty_id,
    is_approved_by_admin: req.user!.is_approved_by_admin,
  });
};

export const getSpecialties = async (req: Request, res: Response) => {
  try {
    const specialties = await authService.getSpecialties();
    res.status(200).json(specialties);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  try {
    const tokens = await authService.refreshToken(refreshToken);
    res.status(200).json(tokens);
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    await authService.logout(req.user!.id);
    res.status(200).json({ message: "Sesión cerrada correctamente" });
  } catch (error: any) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};
