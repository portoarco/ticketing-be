import { Router } from "express";
import EventController from "../controller/event.controller";

class EventRouter {
  private route: Router;
  private event: EventController;

  constructor() {
    this.route = Router();
    this.event = new EventController();
    this.initializeRoutes();
  }
  // Initialize route
  private initializeRoutes(): void {

    // Eky - start
    this.route.get("/", this.event.getAllEvents);
    this.route.get("/:id", this.event.getEvent);
    // Eky - end
    this.route.get("/:organizer_id", this.event.getEventsById);



  }

  public getRouter() {
    return this.route;
  }
}

export default EventRouter;
