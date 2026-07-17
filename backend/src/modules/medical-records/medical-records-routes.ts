import { Router } from "express";
import { body, param, query } from "express-validator";
import * as medicalRecordsController from "./medical-records.controller";
import { authenticate } from "../../middlewares/auth";
import {
  verifyDoctorApproved,
  verifyPatient,
} from "../../middlewares/verifyRole";
import { generateWithAI } from "./ai.controller";
import { handleInputErrors } from "../../middlewares/validation";

const router = Router();

router.get(
  "/patients",
  authenticate,
  verifyDoctorApproved,
  medicalRecordsController.getPatients,
);

router.get(
  "/patients/:id",
  authenticate,
  verifyDoctorApproved,
  medicalRecordsController.getPatientById,
);

router.get(
  "/doctors",
  authenticate,
  verifyPatient,
  medicalRecordsController.getMyDoctors,
);

router.get(
  "/doctors/:doctorId",
  authenticate,
  verifyPatient,
  medicalRecordsController.getMyDoctorById,
);

router.post(
  "/",
  query("appointmentId")
    .isUUID()
    .withMessage("El id del appointment debe ser un UUID"),
  body("initial_diagnosis")
    .notEmpty()
    .withMessage("El diagnostico es requerido"),
  body("treatment_plan")
    .notEmpty()
    .withMessage("El plan de tratamiento es requerido"),
  authenticate,
  verifyDoctorApproved,
  handleInputErrors,
  medicalRecordsController.createMedicalRecord,
);

router.post(
  "/annex/:medicalRecordId",
  body("content").notEmpty().withMessage("El contenido es requerido"),
  param("medicalRecordId")
    .isUUID()
    .withMessage("El id del medical record debe ser un UUID"),
  body("type")
    .isIn(["evolution", "lab_result", "correction"])
    .withMessage("El tipo debe ser: evolution, lab_result o correction"),
  authenticate,
  verifyDoctorApproved,
  handleInputErrors,
  medicalRecordsController.createMedicalRecordAnnexe,
);

router.get(
  "/:medicalRecordId",
  authenticate,
  medicalRecordsController.getMedicalRecordById,
);

router.get(
  "/annexe/:annexeId",
  authenticate,
  medicalRecordsController.getMedicalRecordAnnexeById,
);

router.post("/ai/generate", authenticate, verifyDoctorApproved, generateWithAI);
export default router;
