"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = require("../middlewares/verifyToken");
const organizer_controller_1 = __importDefault(require("../controller/organizer.controller"));
class OrganizerRouter {
    constructor() {
        this.route = (0, express_1.Router)();
        this.organizerController = new organizer_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.route.use(verifyToken_1.verifyToken);
        this.route.get("/profile", this.organizerController.organizersById);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = OrganizerRouter;
