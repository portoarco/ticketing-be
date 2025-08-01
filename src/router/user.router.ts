import { Router } from "express";
import UserController from "../controller/user.controller";

class UserRouter {
  private route: Router;
  private userController: UserController;

  constructor() {
    this.route = Router();
    this.userController = new UserController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // this.route.<methods>()
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default UserRouter;
