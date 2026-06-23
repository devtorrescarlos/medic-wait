import { Router } from "express";
import { body, param } from "express-validator";
import * as slotsController from "../slots/slots.controller";
import { authenticate } from "../../middlewares/auth";
import { handleInputErrors } from "../../middlewares/validation";
import { verifyDoctorApproved } from "../../middlewares/verifyRole";
import { doctorIdValidation } from "../../middlewares/slotsAndScheduleValidation";

const router = Router();

router.get("/", authenticate, verifyDoctorApproved, slotsController.getSlots);

router.get(
  "/:doctorId",
  authenticate,
  doctorIdValidation,
  handleInputErrors,
  slotsController.getAvailableSlots,
);

router.delete(
  "/:slotId",
  authenticate,
  param("slotId").isUUID().withMessage("El id del slot debe ser un UUID"),
  handleInputErrors,
  verifyDoctorApproved,
  slotsController.deleteSlot,
);

router.put(
  "/:slotId",
  authenticate,
  param("slotId").isUUID().withMessage("El id del slot debe ser un UUID"),
  body("start_time")
    .notEmpty()
    .withMessage("La hora de inicio es obligatoria")
    .matches(/^([01]?\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Hora de inicio inválida. Formato esperado: HH:mm"),
  body("end_time")
    .notEmpty()
    .withMessage("La hora de fin es obligatoria")
    .matches(/^([01]?\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Hora de fin inválida. Formato esperado: HH:mm"),
  handleInputErrors,
  verifyDoctorApproved,
  slotsController.updateSlot,
);
export default router;
