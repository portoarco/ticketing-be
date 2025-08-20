"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const auth_router_1 = __importDefault(require("./router/auth.router"));
const event_router_1 = __importDefault(require("./router/event.router"));
const user_router_1 = __importDefault(require("./router/user.router"));
const transaction_router_1 = __importDefault(require("./router/transaction.router"));
const PORT = process.env.PORT || "8000";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.configure();
        this.route();
        this.errorMiddleware();
    }
    configure() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
    }
    route() {
        // Route Const Management
        const authRouter = new auth_router_1.default();
        const eventRouter = new event_router_1.default();
        const userRouter = new user_router_1.default();
        const transactionRouter = new transaction_router_1.default();
        // Main Page
        this.app.get("/", (req, res) => {
            res.status(200).send("<h1>This is Main Page</h1>");
        });
        this.app.use("/events", eventRouter.getRouter()); //mas eky
        this.app.use("/auth", authRouter.getRouter()); // arco
        this.app.use("/user", userRouter.getRouter()); // arco
        // this.app.use("/organizer", userRouter.getRouter()); // arco
        this.app.use("/transaction", transactionRouter.getRouter()); // arco
    }
    // error handler
    errorMiddleware() {
        this.app.use((error, req, res, next) => {
            console.log(error);
            res.status(500).send(error);
        });
    }
    start() {
        this.app.listen(PORT, () => {
            console.log(`API is Running at http://localhost:${PORT}`);
        });
    }
}
exports.default = App;
