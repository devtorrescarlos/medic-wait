import jwt from "jsonwebtoken";
import User from "../models/User";
import { Request, Response, NextFunction } from "express";

declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {

    const bearer = req.headers.authorization;

    if (!bearer) {
        const error = new Error("No autorizado");
        return res.status(401).json({ error: error.message });
    }

    const [, token] = bearer.split(" ");

    if (!token) {
        const error = new Error("Token no válido");
        return res.status(401).json({ error: error.message });
    }

    try {
        const decoded = jwt.verify(token, process.env.SUPER_SECRET as string) as { id: string };

        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({ error: "Usuario no encontrado" });
        }

        if (!user.is_email_verified) {
            return res.status(401).json({ error: "Usuario no verificado" });
        }

        req.user = user;
        return next();

    } catch (error) {
        console.log("Error:", error)
        return res.status(500).json({
            error: "Token no válido"
        })
    }
}