"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const event_controller_1 = __importDefault(require("../controller/event.controller"));
const verifyToken_1 = require("../middlewares/verifyToken");
const uploader_1 = require("../middlewares/uploader");
class EventRouter {
    constructor() {
        this.route = (0, express_1.Router)();
        this.event = new event_controller_1.default();
        this.initializeRoutes();
    }
    // Initialize route
    initializeRoutes() {
        // Eky - start
        this.route.post("/", verifyToken_1.verifyToken, (0, uploader_1.uploaderMemory)().single("image"), this.event.createEvent);
        this.route.get("/categories", this.event.getCategory);
        this.route.get("/locations", this.event.getLocation);
        this.route.get("/attendance", verifyToken_1.verifyToken, this.event.getEventbyAttendance); // arco
        // this.route.get("/attendees/:id", verifyToken, this.event.); // arco
        this.route.patch("/seats/:id", verifyToken_1.verifyToken, this.event.updateSeatsQuantity); // arco
        this.route.get("/", this.event.getAllEvents);
        this.route.get("/:id", this.event.getEvent);
        // Eky - end
        this.route.get("/:organizer_id", this.event.getEventsById);
    }
    getRouter() {
        return this.route;
    }
}
exports.default = EventRouter;
