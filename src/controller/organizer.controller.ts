import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import AppError from "../errors/AppError";

class OrganizerController {
  public async organizersById(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = res.locals.decrypt.id;

      console.log(user_id);

      const organizer = await prisma.organizer.findUnique({
        where: { user_id },
        select: {
          organizer_name: true,
        },
      });
      if (!organizer) {
        throw new AppError("Organizer Not Found", 404);
      }
      res.status(200).send({ success: true, result: organizer });
    } catch (error) {
      next(error);
    }
  }
}

export default OrganizerController;
