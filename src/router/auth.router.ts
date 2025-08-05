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
    this.route.post("/register", regisValidator, this.authController.register); //arco
    this.route.post("/login", this.authController.login); // arco
    this.route.post("/forget-password", this.authController.forgetPass); // arco
    this.route.get("/me", verifyToken, this.authController.getUserData);
    //
    this.route.use(verifyToken); // arco
    //
    this.route.get("/verify", this.authController.verifyAccount); // arco
    this.route.post("/check-organizer", this.authController.checkOrganizer); // arco
    this.route.patch(
      "/register-organizer",
      this.authController.registerOrganizer
    ); //arco
    this.route.patch("/reset-password", this.authController.resetPass); // arco
  }
  public getRouter(): Router {
    return this.route;
  }
}
export default AuthRouter;
