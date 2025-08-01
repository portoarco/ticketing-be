import { Response, Request, NextFunction } from "express";
import { prisma } from "../config/prisma";
import AppError from "../errors/AppError";

class UserController {
  public async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = res.locals.decrypt.id;
      console.log(id);

      const user = await prisma.users.findUnique({
        where: { id },
        select: {
          first_name: true,
          last_name: true,
          email: true,
          phone_number: true,
        },
      });

      if (!user) {
        throw new AppError("User Not Found", 404);
      }
      res.status(200).send({ success: true, result: user });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
