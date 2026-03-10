import { body } from "express-validator";

export const validateSlotInputs = [
    body("startTime").notEmpty().withMessage("El horario de inicio es obligatorio"),
    body("endTime").notEmpty().withMessage("El horario de fin es obligatorio"),
    body("durationMinutes").notEmpty().withMessage("La duración es obligatoria").isInt().withMessage("La duración debe ser un número"),
    body("doctorId").notEmpty().withMessage("El doctor es obligatorio")
]