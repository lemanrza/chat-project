import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import UserModel from "../models/userModel.js";

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

  console.log("Auth header:", authHeader);
  console.log(
    "Extracted token:",
    token ? `${token.substring(0, 20)}...` : "null"
  );

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "Access token required" });
  }

  const decoded = verifyAccessToken(token);
  console.log("Decoded token:", decoded);

  if (!decoded) {
    console.log("Token verification failed");
    return res.status(403).json({ message: "Invalid or expired token" });
  }

  req.user = decoded;
  console.log("User set on request:", req.user);
  next();
};
