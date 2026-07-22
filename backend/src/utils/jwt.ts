import jwt from "jsonwebtoken";

export const generateAccessToken = (id: string, role: string) => {
  const token = jwt.sign(
    { id, role, type: "access" },
    process.env.SUPER_SECRET as string,
    {
      expiresIn: "15m",
    },
  );
  return token;
};

export const generateRefreshToken = (id: string) => {
  const token = jwt.sign(
    { id, type: "refresh" },
    process.env.REFRESH_SECRET as string,
    {
      expiresIn: "7d",
    },
  );
  return token;
};

// This is for E-Mail verification
export const generateVerificationJWT = (id: string) => {
  const token = jwt.sign({ id }, process.env.VERIFICATION_SECRET as string, {
    expiresIn: "15m",
  });
  return token;
};

export const verifyAccessToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.SUPER_SECRET as string) as {
      id: string;
      role: string;
      type: "access";
    };
    if (decoded.type !== "access") {
      throw {
        status: 401,
        message: "Token no válido",
      };
    }
    return decoded;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw {
        status: 401,
        message: "El token ha expirado",
      };
    }
    throw {
      status: 401,
      message: "Token no válido",
    };
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET as string) as {
      id: string;
      type: "refresh";
    };
    if (decoded.type !== "refresh") {
      throw {
        status: 401,
        message: "Token no válido",
      };
    }
    return decoded;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw {
        status: 401,
        message: "El token ha expirado",
      };
    }
    throw {
      status: 401,
      message: "Token no válido",
    };
  }
};

export const verifyEmailVerificationJWT = (token: string) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.VERIFICATION_SECRET as string,
    ) as { id: string };
    return decoded;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw {
        status: 401,
        message:
          "El token ha expirado. Por favor, solicita un nuevo correo de verificación",
      };
    }
    throw {
      status: 401,
      message: "Token no válido",
    };
  }
};
