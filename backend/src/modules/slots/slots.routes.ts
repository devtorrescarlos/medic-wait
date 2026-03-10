import { Router } from "express"
import { body, param } from "express-validator";
import * as slotsController from "../slots/slots.controller";
import { authenticate } from "../../middlewares/auth";
import { verifyDoctorApproved } from "../../middlewares/slots/verifyDoctorApproved";
import { handleInputErrors } from "../../middlewares/validation";
import { validateSlotInputs } from "../../middlewares/slots/validateSlotInputs";

const router = Router();

router.post("/",
    validateSlotInputs,
    authenticate,
    verifyDoctorApproved,
    handleInputErrors,
    slotsController.generateSlots)

router.get("/:doctorId",
    param("doctorId")
        .notEmpty()
        .withMessage("El doctor es obligatorio")
        .isInt()
        .withMessage("El doctor debe ser un número"),
    authenticate,
    slotsController.getAvailableSlots)

router.put("/:slotId",
    param("slotId")
        .notEmpty()
        .withMessage("El slot es obligatorio"),
    validateSlotInputs,
    authenticate,
    verifyDoctorApproved,
    handleInputErrors,
    slotsController.updateSlotsById)

router.delete("/",
    authenticate,
    verifyDoctorApproved,
    slotsController.deleteSlots)

router.delete("/:slotId",
    param("slotId")
        .notEmpty()
        .withMessage("El slot es obligatorio"),
    authenticate,
    verifyDoctorApproved,
    handleInputErrors,
    slotsController.deleteSlotsById)
export default router;