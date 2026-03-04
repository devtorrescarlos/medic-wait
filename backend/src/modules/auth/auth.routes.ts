import { Router } from "express";
import { body, param } from "express-validator";
import * as AuthController from "./auth.controller";
import { handleInputErrors } from "../../middlewares/validation";
import { authenticate } from "../../middlewares/auth";

const router = Router();

router.post("/register",
    body("email")
        .notEmpty()
        .withMessage("E-Mail es requerido")
        .isEmail()
        .withMessage("E-Mail inválido"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password debe tener al menos 6 caracteres"),
    body("fullName")
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

router.post("/confirm-account",
    body("token")
        .isLength({
            min: 6,
        })
        .withMessage("Token no válido"),
    handleInputErrors,
    AuthController.confirmAccount);

router.post('/forgot-password',
    body("email")
        .isEmail()
        .withMessage("E-Mail no válido"),
    handleInputErrors,
    AuthController.forgotPassword)

router.post('/verify-token',
    body("token")
        .isLength({
            min: 6,
        })
        .withMessage("Token no válido"),
    handleInputErrors,
    AuthController.verifyToken)

router.post('/reset-password/:token',
    param("token")
        .notEmpty()
        .withMessage("El Token no puede ir vacío")
        .isLength({
            min: 6,
        })
        .withMessage("Token no válido"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password debe tener al menos 6 caracteres"),
    handleInputErrors,
    AuthController.resetPasswordWithToken)

router.get('/user', authenticate, AuthController.getUser)
// TODO: UPDATE PASSWORD WHEN USER IS LOGGED IN
export default router;