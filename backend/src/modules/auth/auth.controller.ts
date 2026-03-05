import { Request, Response } from "express";
import * as authService from "./auth.service";
import type { loginData, registerData } from "../../types/auth.types";

export const register = async (req: Request, res: Response) => {
    const userData: registerData = req.body;
    try {
        const token = await authService.register(userData);
        res.status(201).json({
            message: "Usuario creado correctamente, revisa tu correo electrónico para verificar tu cuenta",
            token
        });
    } catch (error: any) {
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

export const login = async (req: Request, res: Response) => {
    const userData: loginData = req.body;
    try {
        const token = await authService.login(userData);
        res.status(200).json({ token });
    } catch (error: any) {
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

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
}

export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        const token = await authService.forgotPassword(email);
        res.status(200).json({ message: "Se ha enviado un correo electrónico con las instrucciones para restablecer tu contraseña", token });
    } catch (error: any) {
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

export const resendConfirmationEmail = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        const token = await authService.resendConfirmationEmail(email);
        res.status(200).json({ message: "Correo electrónico de confirmación reenviado", token });
    } catch (error: any) {
        if (error.status) {
            return res.status(error.status).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
}

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
}

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
}

export const getUser = async (req: Request, res: Response) => {
    res.json(req.user);
}