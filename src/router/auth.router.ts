import { Router } from "express";
import AuthController from "../controller/auth.controller";
import { regisValidator } from "../middlewares/validation/auth";
import { verifyToken } from "../middlewares/verifyToken";
import { verify } from "crypto";

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
    this.route.post("/login", this.authController.login);
    this.route.post("/forget-password", this.authController.forgetPass);
    //
    this.route.use(verifyToken);
    //
    this.route.patch("/verify", this.authController.verifyAccount);
    this.route.post(
      "/register-organizer",
      this.authController.registerOrganizer
    );
    this.route.patch("/reset-password", this.authController.resetPass);
  }
  public getRouter(): Router {
    return this.route;
  }
}
export default AuthRouter;
