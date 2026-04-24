import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import prisma from "../prisma";

export interface AuthRequest extends Request {
  user?: any;
}

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);

    //check if user exists in database
    const user = await prisma.user.findUnique({
      where: { id: (decoded as any).id }
    });

    if (!user) {
      return res.status(401).json({ error: "Token inválido" });
    }

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}