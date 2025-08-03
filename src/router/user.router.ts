import { Router } from "express";
import UserController from "../controller/user.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { uploaderMemory } from "../middlewares/uploader";

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
    this.route.patch(
      "/profile",
      uploaderMemory().single("avatar"),
      this.userController.editUserProfile
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default UserRouter;
