import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send("Unauthorized");
  }
  try {
    //@ts-ignore
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //@ts-ignore
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).send("Unauthorized");
  }
}
