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
  // Eky -- start
  public async getCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await prisma.event_Category.findMany({
        select: { name: true },
      });

      if (categories.length === 0)
        throw new AppError("Category not found", 404);

      console.log(categories);

      res.status(200).json(categories);
    } catch (error) {
      console.log("getCategory error");
      next(error);
    }
  }
  public async getLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const locations = await prisma.event_Location.findMany({
        distinct: ["city"],
        select: { city: true },
      });

      if (locations.length === 0) throw new AppError("Location not found", 404);

      console.log(locations);

      res.status(200).json(locations);
    } catch (error) {
      console.log("getLocation error");
      next(error);
    }
  }

  // Eky -- end
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

  public async getEventsById(req: Request, res: Response, next: NextFunction) {
    try {
      const organizer_id: string = req.params.organizer_id;

      const eventsbyid = await prisma.events.findMany({
        where: { organizer_id },
      });

      console.log(eventsbyid);

      res.status(200).send(eventsbyid);
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

  //   public async createEvent(req: Request, res: Response, next: NextFunction) {
  //     try {
  //       const {
  //         name,
  //         description,
  //         price,
  //         start_date,
  //         end_date,
  //         event_category,
  //         city,
  //         address,
  //       } = req.body;

  //       const userId = res.locals.decrypt.id;

  //       const user = await prisma.users.findUnique({
  //         where: { id: userId },
  //         include: { organizer: true },
  //       });

  //       if (!user?.organizer || user.organizer.length === 0)
  //         throw new AppError("User is not an organizer", 403);

  //       const category_id = await prisma.event_Category.findUnique({
  //         where: { name: event_category },
  //       });

  //       if (!category_id) throw new AppError("Category id not found", 404);

  //       const location_id = await prisma.event_Location.create({
  //         data: { city, address, event_id: "" },
  //       });

  //       if (!location_id) throw new AppError("Location id not found", 404);

  //       const newEvent = await prisma.events.create({
  //         data: {
  //           organizer_id: user.organizer[0].id,
  //           event_category_id: category_id.id,
  //           event_location_id: location_id.id,
  //           name,
  //           description,
  //           price,
  //           start_date,
  //           end_date,
  //         },
  //       });

  //       res
  //         .status(201)
  //         .json({ message: "Event created successfully", data: newEvent });
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
  // }

  public async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = res.locals.decrypt.id;

      const organizer = await prisma.organizer.findUnique({
        where: { user_id: userId },
      });

      if (!organizer) {
        throw new AppError(
          "Access denied. Only organizers can create events.",
          403
        );
      }

      const {
        name,
        description,
        price,
        // availableSeats,
        start_date,
        end_date,
        event_category_name,
        city,
        address,
        // image,
      } = req.body;

      const category = await prisma.event_Category.findUnique({
        where: { name: event_category_name },
      });

      if (!category) {
        throw new AppError(`Category '${event_category_name}' not found.`, 404);
      }

      const newLocation = await prisma.event_Location.create({
        data: {
          city,
          address,
          event_id: "",
        },
      });

      const newEvent = await prisma.events.create({
        data: {
          name,
          description,
          price: Number(price),

          start_date: new Date(start_date),
          end_date: end_date ? new Date(end_date) : null,

          organizer_id: organizer.id,
          event_category_id: category.id,

          event_location_id: newLocation.id,
        },
      });

      console.log(newEvent);

      res.status(201).json({
        message: "Event created successfully",
        data: newEvent,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default EventController;
// Eky - End
