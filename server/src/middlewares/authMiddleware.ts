import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  const decoded = verifyAccessToken(token);
  if (!decoded) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }

  console.log("🔍 Decoded token:", decoded);
  req.user = decoded;
  console.log("🔍 req.user after assignment:", req.user);
  next();
};
