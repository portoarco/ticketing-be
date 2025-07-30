import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { randomUUID } from "crypto";

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

      res.status(200).send(events);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
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
    } catch (error) {}
  }
}

export default EventController;
// Eky - End
