import { Router } from "express";
import AuthController from "../controller/auth.controller";
import { regisValidator } from "../middlewares/validation/auth";

class AuthRouter {
  private route: Router;
  private authController: AuthController;

  constructor() {
    this.route = Router();
    this.authController = new AuthController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.route.post("/register", regisValidator, this.authController.register);
  }
  public getRouter(): Router {
    return this.route;
  }
}
export default AuthRouter;
