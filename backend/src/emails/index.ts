import { transport } from "../config/nodemailer";

export const sendVerificationEmail = async (email: string, token: string) => {
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email`;
    await transport.sendMail({
        from: '"Medic Wait" <[EMAIL_ADDRESS]>',
        to: email,
        subject: 'Verifica tu cuenta',
        html: `
            <h1>Verifica tu cuenta</h1>
            <p>Ingresa el siguiente código para verificar tu cuenta</p>
            <p>${token}</p>
            <a href="${verificationLink}">Verificar cuenta</a>
        `
    });
}

export const sendForgotPasswordEmail = async (email: string, token: string) => {
    const verificationLink = `${process.env.FRONTEND_URL}/forgot-password`;
    await transport.sendMail({
        from: '"Medic Wait" <[EMAIL_ADDRESS]>',
        to: email,
        subject: 'Olvide mi contraseña',
        html: `
            <h1>Olvide mi contraseña</h1>
            <p>Ingresa el siguiente código para restablecer tu contraseña</p>
            <p>${token}</p>
            <a href="${verificationLink}">Restablecer contraseña</a>
        `
    });
}