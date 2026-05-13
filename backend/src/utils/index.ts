import Role from "../models/Role";
import UserRole from "../models/UserRole";
import { parse } from "date-fns";

export const getUserRole = async (userId: string): Promise<string | null> => {
    const userRole = await UserRole.findOne({
        where: { user_id: userId },
        include: [{ model: Role }]
    });
    return userRole?.role.name || null;
};

export const parseTimeString = (timeStr: string, referenceDate: Date): Date => {
    return parse(timeStr, "HH:mm", referenceDate);
};