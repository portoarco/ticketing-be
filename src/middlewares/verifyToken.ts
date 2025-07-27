import { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError";
import { verify } from "jsonwebtoken";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new AppError("Token Not Found!", 404);
    }
    const checkToken = verify(token, process.env.TOKEN_KEY || "minprosecret");
    res.locals.decrypt = checkToken;
    next();
  } catch (error) {
    next(error);
  }
};
