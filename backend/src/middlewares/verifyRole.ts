import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import Role from "../models/Role";

declare global {
    namespace Express {
        interface Request {
            doctorId?: string;
            patientId?: string;
        }
    }
}

export const verifyDoctorApproved = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;

    if (!user) {
        return res.status(401).json({ message: "No autenticado" });
    }

    if (user.role !== "doctor") {
        return res.status(403).json({ message: "No tienes permiso para realizar esta acción" });
    }

    if (!user.is_approved_by_admin) {
        return res.status(403).json({ message: "Tu cuenta aún no ha sido aprobada por un administrador" });
    }

    req.doctorId = user.id;

    next();
};

export const verifyPatient = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;

    if (!user) {
        return res.status(401).json({ message: "No autenticado" });
    }

    if (user.role !== "patient") {
        return res.status(403).json({ message: "No tienes permiso para realizar esta acción" });
    }

    req.patientId = user.id;
    next();
};
