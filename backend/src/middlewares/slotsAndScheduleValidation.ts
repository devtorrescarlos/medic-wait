import { param, body } from "express-validator";

export const scheduleIdValidation = [
  param("scheduleId")
    .notEmpty()
    .withMessage("El id del horario es obligatorio")
    .isUUID()
    .withMessage("El id del horario debe ser un uuid"),
];

export const doctorIdValidation = [
  param("doctorId")
    .notEmpty()
    .withMessage("El id del doctor es obligatorio")
    .isUUID()
    .withMessage("El id del doctor debe ser un uuid"),
];

export const scheduleInputsValidation = [
  body("day_of_week")
    .notEmpty()
    .withMessage("El dia de la semana es obligatorio")
    .isIn([
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ])
    .withMessage("Dia de la semana inválido"),
  body("start_time").notEmpty().withMessage("La hora de inicio es obligatoria"),
  body("end_time").notEmpty().withMessage("La hora de fin es obligatoria"),
];
