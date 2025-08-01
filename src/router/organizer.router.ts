import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import OrganizerController from "../controller/organizer.controller";

class OrganizerRouter {
  private route: Router;
  private organizerController: OrganizerController;

  constructor() {
    this.route = Router();
    this.organizerController = new OrganizerController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.route.use(verifyToken);
    this.route.get("/profile", this.organizerController.organizersById);
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default OrganizerRouter;
