import { transport } from "../config/nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendVerificationEmail = async (email: string, token: string) => {
  await transport.sendMail({
    from: '"Medic Wait" no-reply@medicwait.com',
    to: email,
    subject: "Verifica tu cuenta",
    html: `
            <h1>Verifica tu cuenta</h1>
            <a href="${process.env.CLIENT_URL}/auth/confirm-account/${token}">Verificar cuenta</a>
        `,
  });
};

export const sendForgotPasswordEmail = async (email: string, token: string) => {
  await transport.sendMail({
    from: '"Medic Wait" no-reply@medicwait.com',
    to: email,
    subject: "Olvide mi contraseña",
    html: `
            <h1>Olvide mi contraseña</h1>
            <a href="${process.env.CLIENT_URL}/auth/reset-password/${token}">Restablecer contraseña</a>
        `,
  });
};
