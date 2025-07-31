import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { randomUUID } from "crypto";
import { E } from "@faker-js/faker/dist/airline-CLphikKp";
import AppError from "../errors/AppError";

// Eky - Start
class EventController {
  public async getAllEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const events = await prisma.events.findMany({
        orderBy: {
          start_date: "desc",
        },
        include: {
          organizer: {
            include: {
              user: { select: { first_name: true, last_name: true } },
            },
          },

          category_event: true,
          location_Event: true,
        },
      });

      if (!events) {
        throw new AppError("Data not found", 404);
      }

      res.status(200).send(events);
    } catch (error) {
      next(error);
    }
  }

  public async getEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;

      const event = await prisma.events.findUnique({
        where: { id },
        include: {
          organizer: {
            include: {
              user: { select: { first_name: true, last_name: true } },
            },
          },

          category_event: true,
          location_Event: true,
        },
      });

      if (!event) {
        throw new AppError("Data not found", 404);
      }

      res.status(200).send({ success: true, data: event });
    } catch (error) {
      next(error);
    }
  }

  public async deleteEvent(req: Request, res: Response, next: NextFunction) {
    try {
      await prisma.events.delete({
        where: { id: req.params.id },
      });
      res.status(204).send({ message: "Delete success" });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }

  public async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description, price, start_date, end_date } = req.body;

      // Temporary
      const newEvent = await prisma.events.create({
        data: {
          organizer_id: randomUUID(),
          event_category_id: "", // temporary
          event_location_id: "", //
          name,
          description,
          price,
          start_date,
          end_date,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default EventController;
// Eky - End
