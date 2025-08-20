"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controller/user.controller"));
const verifyToken_1 = require("../middlewares/verifyToken");
const uploader_1 = require("../middlewares/uploader");
class UserRouter {
    constructor() {
        this.route = (0, express_1.Router)();
        this.userController = new user_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.route.use(verifyToken_1.verifyToken);
        this.route.get("/profile", this.userController.getUser);
        this.route.patch("/profile", (0, uploader_1.uploaderMemory)().single("avatar"), this.userController.editUserProfile);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = UserRouter;
