import { Response, Request, NextFunction } from "express";
import { prisma } from "../config/prisma";
import AppError from "../errors/AppError";
import { createToken } from "../../utils/createToken";

class UserController {
  public async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = res.locals.decrypt.id;

      const user = await prisma.users.findUnique({
        where: { id },
        select: {
          first_name: true,
          last_name: true,
          email: true,
          phone_number: true,
          avatar: true,
          refferal_code: true,
          organizer: {
            select: {
              organizer_name: true,
            },
          },
        },
      });

      console.log(user);

      if (!user) {
        throw new AppError("User Not Found", 404);
      }

      const token = createToken(user);

      res.status(200).send({ success: true, result: user, token: token });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
