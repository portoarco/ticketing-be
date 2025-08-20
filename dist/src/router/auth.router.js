"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controller/auth.controller"));
const auth_1 = require("../middlewares/validation/auth");
const verifyToken_1 = require("../middlewares/verifyToken");
class AuthRouter {
    constructor() {
        this.route = (0, express_1.Router)();
        this.authController = new auth_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.route.post("/register", auth_1.regisValidator, this.authController.register); //arco
        this.route.post("/login", this.authController.login); // arco
        this.route.post("/forget-password", this.authController.forgetPass); // arco
        this.route.get("/me", verifyToken_1.verifyToken, this.authController.getUserData);
        //
        this.route.use(verifyToken_1.verifyToken); // arco
        //
        this.route.get("/verify", this.authController.verifyAccount); // arco
        this.route.post("/check-organizer", this.authController.checkOrganizer); // arco
        this.route.patch("/register-organizer", this.authController.registerOrganizer); //arco
        this.route.patch("/reset-password", this.authController.resetPass); // arco
    }
    getRouter() {
        return this.route;
    }
}
exports.default = AuthRouter;
