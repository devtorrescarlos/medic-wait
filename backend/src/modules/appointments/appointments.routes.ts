import { Router } from "express";
import * as appointmentController from "./appointments.controller";
import {
  verifyDoctorApproved,
  verifyPatient,
  verifyDoctorOrPatient,
} from "../../middlewares/verifyRole";
import { authenticate } from "../../middlewares/auth";
import { body, param, query } from "express-validator";
import { handleInputErrors } from "../../middlewares/validation";

const router = Router();

router.post(
  "/:appointmentId/cancel",
  authenticate,
  param("appointmentId")
    .isUUID()
    .withMessage("El id de la cita debe ser un uuid")
    .notEmpty()
    .withMessage("El id de la cita es obligatorio"),
  body("cancellation_reason")
    .isString()
    .withMessage("La razon de cancelacion debe ser un string")
    .optional(),
  handleInputErrors,
  appointmentController.cancelAppointment,
);

router.post(
  "/:appointmentId/complete",
  authenticate,
  param("appointmentId")
    .isUUID()
    .withMessage("El id de la cita debe ser un uuid")
    .notEmpty()
    .withMessage("El id de la cita es obligatorio"),
  verifyDoctorApproved,
  handleInputErrors,
  appointmentController.completeAppointment,
);

router.post(
  "/:appointmentId/confirm",
  authenticate,
  param("appointmentId")
    .isUUID()
    .withMessage("El id de la cita debe ser un uuid")
    .notEmpty()
    .withMessage("El id de la cita es obligatorio"),
  verifyPatient,
  handleInputErrors,
  appointmentController.confirmAppointment,
);

router.post(
  "/:doctorId/:slotId",
  authenticate,
  param("doctorId")
    .isUUID()
    .withMessage("El id del doctor debe ser un uuid")
    .notEmpty()
    .withMessage("El id del doctor es obligatorio"),
  body("reason")
    .isString()
    .withMessage("La razon debe ser un string")
    .notEmpty()
    .withMessage("La razon es obligatoria"),
  param("slotId")
    .isUUID()
    .withMessage("El id del slot debe ser un uuid")
    .notEmpty()
    .withMessage("El id del slot es obligatorio"),
  verifyPatient,
  handleInputErrors,
  appointmentController.createAppointment,
);



router.get(
  "/all",
  authenticate,
  verifyDoctorOrPatient,
  appointmentController.getAllAppointments,
);

router.get(
  "/:appointmentId",
  authenticate,
  param("appointmentId")
    .isUUID()
    .withMessage("El id de la cita debe ser un uuid")
    .notEmpty()
    .withMessage("El id de la cita es obligatorio"),
  handleInputErrors,
  appointmentController.getAppointmentById,
);

export default router;
