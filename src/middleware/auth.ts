import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  let token: string | null = null;

  if (authHeader) {
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      token = authHeader;
    }
  }

  if (!token && typeof req.body?.token === "string") token = req.body.token;
  if (!token && typeof req.query?.token === "string") token = req.query.token;

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  if (!jwtSecret) {
    console.error("JWT_SECRET is not defined in environment variables");
    return res.status(500).json({ message: "Server configuration error" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload & {
      id: string;
      username: string;
      email: string;
    };

    req.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
    };
    next();
  } catch (err: any) {
    console.error("JWT verification error:", err.message);
    return res
      .status(403)
      .json({ message: "Invalid or expired token", error: err });
  }
};
