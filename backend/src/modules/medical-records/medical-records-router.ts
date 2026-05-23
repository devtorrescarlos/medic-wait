import { Router } from "express";
import { body } from "express-validator";
import {
  createMedicalRecord,
  getPatientById,
  getPatients,
  createMedicalRecordAnnexe,
  getMedicalRecordById,
} from "./medical-records.controller";
import { authenticate } from "../../middlewares/auth";
import { verifyDoctorApproved } from "../../middlewares/verifyRole";

const router = Router();

// TODO: IMPLEMENT AI SDK TO SUMMARIZE MEDICAL RECORDS AND TO GENERATE TREATMENT PLAN BY DOCTOR KNOWLEDGE,
// BUT NPM IS GETTING IN TROUBLE

router.get("/patients", authenticate, verifyDoctorApproved, getPatients);

router.get("/patients/:id", authenticate, verifyDoctorApproved, getPatientById); // TODO: MODIFY THIS ENDPOINT TO INCLUDE MORE DATA ABOUT THE PATIENT LIKE COMPLETED APPOINTMENTS ETC

router.post(
  "/",
  body("appointment_id")
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
  createMedicalRecord,
);

router.post(
  "/annex/:medicalRecordId",
  body("content").notEmpty().withMessage("El contenido es requerido"),
  body("medicalRecordId")
    .isUUID()
    .withMessage("El id del medical record debe ser un UUID"),
  body("type").notEmpty().withMessage("El tipo no puede ir vacío"),
  authenticate,
  verifyDoctorApproved,
  createMedicalRecordAnnexe,
);

router.get(
  "/:medicalRecordId",
  authenticate,
  verifyDoctorApproved,
  getMedicalRecordById,
);
export default router;
