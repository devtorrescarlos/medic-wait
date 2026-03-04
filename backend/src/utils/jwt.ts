import jwt from "jsonwebtoken";

export const generateJWT = (id: string) => {
    const token = jwt.sign({ id }, process.env.SUPER_SECRET as string, { expiresIn: "1d" });
    return token;
}