import { Router } from "express";
import * as appointmentController from "./appointments.controller";
import {
  verifyDoctorApproved,
  verifyPatient,
} from "../../middlewares/verifyRole";
import { authenticate } from "../../middlewares/auth";
import { body, param, query } from "express-validator";
import { handleInputErrors } from "../../middlewares/validation";
import { doctorIdValidation } from "../../middlewares/slotsAndScheduleValidation";

const router = Router();

router.post(
  "/",
  query("doctorId")
    .isUUID()
    .withMessage("El id del doctor debe ser un uuid")
    .notEmpty()
    .withMessage("El id del doctor es obligatorio"),
  body("reason")
    .isString()
    .withMessage("La razon debe ser un string")
    .notEmpty()
    .withMessage("La razon es obligatoria"),
  body("slotId")
    .isUUID()
    .withMessage("El id del slot debe ser un uuid")
    .notEmpty()
    .withMessage("El id del slot es obligatorio"),
  body("patientName")
    .isString()
    .withMessage("El nombre del paciente debe ser un string")
    .notEmpty()
    .withMessage("El nombre del paciente es obligatorio"),
  body("patientEmail")
    .isEmail()
    .withMessage("El email del paciente debe ser un email")
    .notEmpty()
    .withMessage("El email del paciente es obligatorio"),
  authenticate,
  verifyPatient,
  handleInputErrors,
  appointmentController.createAppointment,
);

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

router.get(
  "/all",
  authenticate,
  verifyDoctorApproved,
  appointmentController.getAllAppointments,
);

router.get(
  "/doctor/:doctorId",
  authenticate,
  doctorIdValidation,
  verifyPatient,
  appointmentController.getAppointmentsByDoctorId,
);

router.get(
  "/patient/:patientId",
  authenticate,
  param("patientId")
    .isUUID()
    .withMessage("El id del paciente debe ser un uuid")
    .notEmpty()
    .withMessage("El id del paciente es obligatorio"),
  handleInputErrors,
  verifyDoctorApproved,
  appointmentController.getAppointmentsByPatientId,
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
