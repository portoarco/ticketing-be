import { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError";
import { prisma } from "../config/prisma";
import { hashPassword } from "../../utils/hash";

class AuthController {
  public async register(req: Request, res: Response, next: NextFunction) {
    const { name, email, password, country, birthdate, phone_number } =
      req.body;
    const hashedPassword = await hashPassword(password);

    try {
      const newUser = await prisma.users.create({
        data: {
          name,
          email,
          password: hashedPassword,
          country,
          birthdate,
          phone_number,
        },
      });

      res.status(201).send({ success: true, data: newUser });
    } catch (error) {
      throw new AppError("Something went wrong", 500);
    }
  }
}

export default AuthController;
