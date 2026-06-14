import { Router } from "express";
import * as scheduleController from "./schedules.controller";
import { authenticate } from "../../middlewares/auth";
import { verifyDoctorApproved } from "../../middlewares/verifyRole";
import {
  scheduleIdValidation,
  doctorIdValidation,
  scheduleInputsValidation,
} from "../../middlewares/slotsAndScheduleValidation";
import { handleInputErrors } from "../../middlewares/validation";

const router = Router();

router.post(
  "/",
  authenticate,
  scheduleInputsValidation,
  verifyDoctorApproved,
  handleInputErrors,
  scheduleController.createOrUpdateSchedule,
);

router.get(
  "/",
  authenticate,
  verifyDoctorApproved,
  scheduleController.getDoctorSchedules,
);

router.get(
  "/:doctorId",
  authenticate,
  doctorIdValidation,
  handleInputErrors,
  scheduleController.getDoctorSchedulesByDoctorId,
);

router.delete(
  "/:scheduleId",
  authenticate,
  scheduleIdValidation,
  verifyDoctorApproved,
  handleInputErrors,
  scheduleController.deleteScheduleAndSlots,
);

router.put(
  "/:scheduleId",
  authenticate,
  scheduleInputsValidation,
  scheduleIdValidation,
  verifyDoctorApproved,
  handleInputErrors,
  scheduleController.updateSchedule,
);

router.patch(
  "/:scheduleId/toggle",
  authenticate,
  scheduleIdValidation,
  verifyDoctorApproved,
  handleInputErrors,
  scheduleController.toggleSchedule,
);

export default router;
