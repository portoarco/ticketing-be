"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../config/prisma");
const AppError_1 = __importDefault(require("../errors/AppError"));
const cloudinary_1 = require("../config/cloudinary");
// Eky - Start
class EventController {
    getAllEvents(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const events = yield prisma_1.prisma.events.findMany({
                    orderBy: {
                        start_date: "asc",
                    },
                    include: {
                        organizer: {
                            include: {
                                user: { select: { first_name: true, last_name: true } },
                            },
                        },
                        category_event: true,
                        location_Event: true,
                        voucher_event: true,
                        ticketType: true,
                    },
                });
                if (!events) {
                    throw new AppError_1.default("Data not found", 404);
                }
                res.status(200).send(events);
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Eky -- start
    getCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield prisma_1.prisma.event_Category.findMany({
                    select: { name: true },
                });
                if (categories.length === 0)
                    throw new AppError_1.default("Category not found", 404);
                console.log(categories);
                res.status(200).json(categories);
            }
            catch (error) {
                console.log("getCategory error");
                next(error);
            }
        });
    }
    getLocation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const locations = yield prisma_1.prisma.event_Location.findMany({
                    distinct: ["city"],
                    select: { city: true },
                });
                if (locations.length === 0)
                    throw new AppError_1.default("Location not found", 404);
                console.log(locations);
                res.status(200).json(locations);
            }
            catch (error) {
                console.log("getLocation error");
                next(error);
            }
        });
    }
    // Eky -- end
    getEvent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const event = yield prisma_1.prisma.events.findUnique({
                    where: { id },
                    include: {
                        organizer: {
                            include: {
                                user: { select: { first_name: true, last_name: true } },
                            },
                        },
                        category_event: true,
                        location_Event: true,
                        voucher_event: true,
                        ticketType: true,
                    },
                });
                if (!event) {
                    throw new AppError_1.default("Data not found", 404);
                }
                console.log("getEvent : ", event);
                res.status(200).send({ success: true, data: event });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getEventsById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const organizer_id = req.params.organizer_id;
                const eventsbyid = yield prisma_1.prisma.events.findMany({
                    where: { organizer_id },
                });
                console.log(eventsbyid);
                res.status(200).send(eventsbyid);
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteEvent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield prisma_1.prisma.events.delete({
                    where: { id: req.params.id },
                });
                res.status(204).send({ message: "Delete success" });
            }
            catch (error) {
                console.log(error);
                res.status(500).send(error);
            }
        });
    }
    //   public async createEvent(req: Request, res: Response, next: NextFunction) {
    //     try {
    //       const {
    //         name,
    //         description,
    //         price,
    //         start_date,
    //         end_date,
    //         event_category,
    //         city,
    //         address,
    //       } = req.body;
    //       const userId = res.locals.decrypt.id;
    //       const user = await prisma.users.findUnique({
    //         where: { id: userId },
    //         include: { organizer: true },
    //       });
    //       if (!user?.organizer || user.organizer.length === 0)
    //         throw new AppError("User is not an organizer", 403);
    //       const category_id = await prisma.event_Category.findUnique({
    //         where: { name: event_category },
    //       });
    //       if (!category_id) throw new AppError("Category id not found", 404);
    //       const location_id = await prisma.event_Location.create({
    //         data: { city, address, event_id: "" },
    //       });
    //       if (!location_id) throw new AppError("Location id not found", 404);
    //       const newEvent = await prisma.events.create({
    //         data: {
    //           organizer_id: user.organizer[0].id,
    //           event_category_id: category_id.id,
    //           event_location_id: location_id.id,
    //           name,
    //           description,
    //           price,
    //           start_date,
    //           end_date,
    //         },
    //       });
    //       res
    //         .status(201)
    //         .json({ message: "Event created successfully", data: newEvent });
    //     } catch (error) {
    //       next(error);
    //     }
    //   }
    // }
    createEvent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body);
                const userId = res.locals.decrypt.id;
                const organizer = yield prisma_1.prisma.organizer.findUnique({
                    where: { user_id: userId },
                });
                if (!organizer) {
                    throw new AppError_1.default("Access denied. Only organizers can create events.", 403);
                }
                const { name, description, price, tickets, start_date, end_date, event_category_name, city, address, promotions, } = req.body;
                let uploadedImageUrl;
                const ticketsConverted = JSON.parse(tickets);
                const promotionsConverted = JSON.parse(promotions);
                if (req.file) {
                    const upload = yield (0, cloudinary_1.cloudinaryUpload)(req.file);
                    uploadedImageUrl = upload.secure_url;
                }
                const category = yield prisma_1.prisma.event_Category.findUnique({
                    where: { name: event_category_name },
                });
                if (!category) {
                    throw new AppError_1.default(`Category '${event_category_name}' not found.`, 404);
                }
                const newEventWithDetails = yield prisma_1.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const newLocation = yield tx.event_Location.create({
                        data: { city, address, event_id: "" },
                    });
                    const newEvent = yield tx.events.create({
                        data: {
                            name,
                            description,
                            image: uploadedImageUrl,
                            start_date: new Date(start_date),
                            end_date: end_date ? new Date(end_date) : null,
                            organizer_id: organizer.id,
                            event_category_id: category.id,
                            event_location_id: newLocation.id,
                            price: price !== null && price !== void 0 ? price : 0,
                        },
                    });
                    if (ticketsConverted && ticketsConverted.length > 0) {
                        const ticketsData = ticketsConverted.map((item) => ({
                            name: item.name,
                            price: item.price,
                            quantity: item.quantity,
                            event_id: newEvent.id,
                        }));
                        yield tx.ticketType.createMany({ data: ticketsData });
                    }
                    if (promotionsConverted && promotionsConverted.length > 0) {
                        const promotionsData = promotionsConverted.map((item) => ({
                            code: item.code,
                            percentage: item.discountPercentage,
                            start_date: new Date(item.startDate),
                            expired_at: new Date(item.expiryDate),
                            event_id: newEvent.id,
                            organizer_id: organizer.id,
                        }));
                        yield tx.voucher.createMany({ data: promotionsData });
                    }
                    return newEvent;
                }));
                console.log(newEventWithDetails);
                res.status(201).json({
                    message: "Event created successfully",
                    data: newEventWithDetails,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getEventbyAttendance(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const id = res.locals.decrypt.id;
                const data = yield prisma_1.prisma.users.findUnique({
                    where: { id },
                    include: {
                        organizer: {
                            include: {
                                event: {
                                    select: {
                                        id: true,
                                        name: true,
                                        price: true,
                                        event_transactionDetail: true,
                                        location_Event: true,
                                        ticketType: {
                                            orderBy: {
                                                price: "asc",
                                            },
                                            select: {
                                                price: true,
                                                quantity: true,
                                            },
                                        },
                                        voucher_event: {
                                            select: {
                                                code: true,
                                            },
                                        },
                                        category_event: true,
                                        attendees_event: {
                                            select: {
                                                status: true,
                                                user_attendees: true,
                                            },
                                        },
                                        start_date: true,
                                        end_date: true,
                                    },
                                },
                            },
                        },
                    },
                });
                const events = ((_a = data === null || data === void 0 ? void 0 : data.organizer) === null || _a === void 0 ? void 0 : _a.event) || [];
                const eventList = events.map((ev) => ({
                    id: ev.id,
                    name: ev.name,
                    // price: ev.ticketType.map((p) => p.price).filter(),
                    price: ev.ticketType[0].price,
                    // total_seat: ev.ticketType.map((s) => s.quantity),
                    total_seat: ev.ticketType[0].quantity,
                    booked_seat: ev.event_transactionDetail.reduce((total, tx) => total + tx.quantity, 0),
                    start_date: ev.start_date,
                    end_date: ev.end_date,
                    category: ev.category_event.name,
                    address: ev.location_Event.address,
                    city: ev.location_Event.city,
                    attendance_status: ev.attendees_event.map((s) => s.status),
                    confirmed_attendance_user_name: ev.attendees_event.map((u) => u.user_attendees.first_name + " " + u.user_attendees.last_name),
                    confirmed_attendance_user_invoice: ev.event_transactionDetail.map((iv) => iv.id),
                    confirmed_attendance_user_quantity: ev.event_transactionDetail.map((us) => us.quantity),
                    confirmed_attendance_length: ev.attendees_event.filter((attendee) => attendee.status === "CONFIRMED").length,
                    promo_code: ev.voucher_event.map((voucher) => voucher.code),
                }));
                console.log(eventList);
                res
                    .status(200)
                    .send({ success: true, message: "Data Found", data: eventList });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateSeatsQuantity(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const eventId = req.params.id;
                const newQuantity = req.body.quantity;
                console.log(eventId);
                console.log(newQuantity);
                const updateSeatsQuantity = yield prisma_1.prisma.ticketType.updateMany({
                    where: { event_id: eventId },
                    data: { quantity: newQuantity },
                });
                console.log(updateSeatsQuantity);
                res.status(200).send({ success: true, data: updateSeatsQuantity });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAttendeesbyEventsId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const eventId = req.params.id;
                console.log(eventId);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = EventController;
// Eky - End
