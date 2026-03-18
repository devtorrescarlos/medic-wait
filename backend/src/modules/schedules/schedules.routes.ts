import Router from "express";
import * as scheduleController from "./schedules.controller"
import { authenticate } from "../../middlewares/auth";
import { verifyDoctorApproved } from "../../middlewares/verifyDoctorApproved";
import { body, param } from "express-validator";
import { handleInputErrors } from "../../middlewares/validation";

const router = Router();

router.post("/",
    authenticate,
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
        .isInt({ min: 1 }).withMessage("La duracion del slot debe ser un número entero positivo"),
    verifyDoctorApproved,
    handleInputErrors,
    scheduleController.createOrUpdateSchedule)

router.delete("/:scheduleId",
    param("scheduleId")
        .notEmpty()
        .withMessage("El id del horario es obligatorio")
        .isUUID()
        .withMessage("El id del horario debe ser un uuid"),
    authenticate,
    verifyDoctorApproved,
    handleInputErrors,
    scheduleController.deleteScheduleAndSlots)
export default router;