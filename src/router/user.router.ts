import { Router } from "express";
import UserController from "../controller/user.controller";
import { verifyToken } from "../middlewares/verifyToken";

class UserRouter {
  private route: Router;
  private userController: UserController;

  constructor() {
    this.route = Router();
    this.userController = new UserController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.route.use(verifyToken);
    this.route.get("/profile", this.userController.getUser);
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default UserRouter;
