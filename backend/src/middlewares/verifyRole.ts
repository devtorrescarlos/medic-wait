import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import Role from "../models/Role";
import UserRole from "../models/UserRole";

declare global {
  namespace Express {
    interface Request {
      doctorId?: string;
      patientId?: string;
    }
  }
}

const verifyUserRole = async (
  user: User,
  requiredRole: string,
): Promise<boolean> => {
  const userRoles = await UserRole.findAll({
    where: { user_id: user.id },
    include: [{ model: Role }],
  });

  return userRoles.some((ur) => ur.role.name === requiredRole);
};

export const verifyRole = async (
  role: string,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user as User;

  if (!user) {
    return res.status(401).json({ error: "No autenticado" });
  }

  const hasRole = await verifyUserRole(user, role);

  if (!hasRole) {
    return res
      .status(403)
      .json({ error: "No tienes permiso para realizar esta acción" });
  }

  if (role === "doctor" && !user.is_approved_by_admin) {
    return res.status(403).json({
      error: "Tu cuenta aún no ha sido aprobada por un administrador",
    });
  } else if (role === "patient") {
    req.patientId = user.id;
  } else if (role === "doctor") {
    req.doctorId = user.id;
  }

  next();
};

export const verifyDoctorApproved = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  return verifyRole("doctor", req, res, next);
};

export const verifyPatient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  return verifyRole("patient", req, res, next);
};

export const verifyAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  return verifyRole("admin", req, res, next);
};

export const verifyDoctorOrPatient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user as User;

  if (!user) {
    return res.status(401).json({ message: "No autenticado" });
  }

  const userRoles = await UserRole.findAll({
    where: { user_id: user.id },
    include: [{ model: Role }],
  });

  const roleNames = userRoles.map((ur) => ur.role.name);
  const isDoctor = roleNames.includes("doctor");
  const isPatient = roleNames.includes("patient");

  if (!isDoctor && !isPatient) {
    return res
      .status(403)
      .json({ error: "No tienes permiso para realizar esta acción" });
  }

  if (isDoctor) {
    if (!user.is_approved_by_admin) {
      return res.status(403).json({
        error: "Tu cuenta aún no ha sido aprobada por un administrador",
      });
    }
    req.doctorId = user.id;
  }

  if (isPatient) {
    req.patientId = user.id;
  }

  next();
};
