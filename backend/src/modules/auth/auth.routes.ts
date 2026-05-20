import { Router } from "express";
import { body, param } from "express-validator";
import * as AuthController from "./auth.controller";
import { handleInputErrors } from "../../middlewares/validation";
import { authenticate } from "../../middlewares/auth";
import { limiter } from "../../config/limiter";

const router = Router();

router.use(limiter);

router.post("/register",
    body("email")
        .notEmpty()
        .withMessage("E-Mail es requerido")
        .isEmail()
        .withMessage("E-Mail inválido"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password debe tener al menos 6 caracteres"),
    body("full_name")
        .isLength({ min: 3 })
        .withMessage("Nombre debe tener al menos 3 caracteres"),
    handleInputErrors,
    AuthController.register);

router.post("/login",
    body("email")
        .notEmpty()
        .withMessage("E-Mail es requerido")
        .isEmail()
        .withMessage("E-Mail inválido"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password debe tener al menos 6 caracteres"),
    handleInputErrors,
    AuthController.login);

router.post("/confirm-account/:token",
    param("token")
        .notEmpty()
        .withMessage("El Token no puede ir vacío"),
    handleInputErrors,
    AuthController.confirmAccount);

router.post("/verify-token/:token",
    param("token")
        .notEmpty()
        .withMessage("El Token no puede ir vacío"),
    handleInputErrors,
    AuthController.verifyToken);

router.post('/forgot-password',
    body("email")
        .isEmail()
        .withMessage("E-Mail no válido"),
    handleInputErrors,
    AuthController.forgotPassword)

router.post('/reset-password/:token',
    param("token")
        .notEmpty()
        .withMessage("El Token no puede ir vacío"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password debe tener al menos 6 caracteres"),
    handleInputErrors,
    AuthController.resetPasswordWithToken)

router.post("/resend-confirmation-email",
    body("email")
        .isEmail()
        .withMessage("E-Mail no válido"),
    handleInputErrors,
    AuthController.resendConfirmationEmail)

router.get('/user', authenticate, AuthController.getUser)

// TODO: UPDATE PASSWORD WHEN USER IS LOGGED IN
export default router;