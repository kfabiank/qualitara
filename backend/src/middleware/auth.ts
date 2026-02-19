import { NextFunction, Request, Response } from "express";

export function authGuard(req: Request, res: Response, next: NextFunction) {
  const auth = req.header("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }

  const token = auth.slice("Bearer ".length);
  if (token !== "demo-token") {
    return res.status(401).json({ error: "Invalid token" });
  }

  (req as Request & { user?: { id: number; role: string } }).user = {
    id: 1,
    role: "admin",
  };

  next();
}
