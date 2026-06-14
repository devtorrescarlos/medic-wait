import { Router } from "express";
import { body, param, query } from "express-validator";
import {
  createMedicalRecord,
  getPatientById,
  getPatients,
  createMedicalRecordAnnexe,
  getMedicalRecordById,
  getMedicalRecordAnnexeById,
} from "./medical-records.controller";
import { authenticate } from "../../middlewares/auth";
import { verifyDoctorApproved } from "../../middlewares/verifyRole";
import { generateWithAI } from "./ai.controller";
import { handleInputErrors } from "../../middlewares/validation";

const router = Router();

router.get("/patients", authenticate, verifyDoctorApproved, getPatients);

router.get("/patients/:id", authenticate, verifyDoctorApproved, getPatientById);

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
  createMedicalRecord,
);

router.post(
  "/annex/:medicalRecordId",
  body("content").notEmpty().withMessage("El contenido es requerido"),
  param("medicalRecordId")
    .isUUID()
    .withMessage("El id del medical record debe ser un UUID"),
  body("type").notEmpty().withMessage("El tipo no puede ir vacío"),
  authenticate,
  verifyDoctorApproved,
  handleInputErrors,
  createMedicalRecordAnnexe,
);

router.get(
  "/:medicalRecordId",
  authenticate,
  verifyDoctorApproved,
  getMedicalRecordById,
);

router.get(
  "/annexe/:annexeId",
  authenticate,
  verifyDoctorApproved,
  getMedicalRecordAnnexeById,
);

router.post("/ai/generate", authenticate, verifyDoctorApproved, generateWithAI);
export default router;
