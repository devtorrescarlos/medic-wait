import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { verifyPatient } from "../../middlewares/verifyRole";
import * as doctorsController from "./doctors.controller";

const router = Router();

router.get("/", authenticate, verifyPatient, doctorsController.getDoctors);
router.get(
  "/:doctorId",
  authenticate,
  verifyPatient,
  doctorsController.getDoctorById,
);

export default router;
