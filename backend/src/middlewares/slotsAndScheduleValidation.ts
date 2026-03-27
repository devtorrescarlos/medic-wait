import { param, body } from "express-validator";


export const scheduleIdValidation = [
    param("scheduleId")
        .notEmpty()
        .withMessage("El id del horario es obligatorio")
        .isUUID()
        .withMessage("El id del horario debe ser un uuid")
]

export const doctorIdValidation = [
    param("doctorId")
        .notEmpty()
        .withMessage("El id del doctor es obligatorio")
        .isUUID()
        .withMessage("El id del doctor debe ser un uuid")
]

export const scheduleInputsValidation = [
    body("day_of_week")
        .notEmpty().withMessage("El dia de la semana es obligatorio")
        .isIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
        .withMessage("Dia de la semana inválido"),
    body("start_time")
        .notEmpty().withMessage("La hora de inicio es obligatoria")
        .matches(/^([01]?\d|2[0-3]):([0-5]\d)$/)
        .withMessage("Hora de inicio inválida. Formato esperado: HH:mm"),
    body("end_time")
        .notEmpty().withMessage("La hora de fin es obligatoria")
        .matches(/^([01]?\d|2[0-3]):([0-5]\d)$/)
        .withMessage("Hora de fin inválida. Formato esperado: HH:mm"),
    body("slot_duration")
        .notEmpty().withMessage("La duracion del slot es obligatoria")
        .isInt({ min: 1 }).withMessage("La duracion del slot debe ser un número entero positivo")
]