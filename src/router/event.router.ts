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
    this.route.get("/", this.event.getAllEvents); // mas eky
    this.route.get("/:id", this.event.getEvent); // mas eky
    this.route.get("/:organizer_id", this.event.getEventsById); //mas eky
  }

  public getRouter() {
    return this.route;
  }
}

export default EventRouter;
