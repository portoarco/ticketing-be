"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transaction_controller_1 = __importDefault(require("../controller/transaction.controller"));
const verifyToken_1 = require("../middlewares/verifyToken");
class TransactionRouter {
    constructor() {
        this.route = (0, express_1.Router)();
        this.transactionController = new transaction_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.route.use(verifyToken_1.verifyToken); //arco
        // Eky - start
        this.route.post("/", this.transactionController.createTransaction);
        this.route.get("/detail", this.transactionController.getAllTransactions); //arco
        this.route.get("/:id", this.transactionController.getTransactionById); // mas eky
        // this.route.get(
        //   "/statistics",
        //   this.transactionController.getTransactionStatistics
        // ); // arco
        this.route.patch("/confirm/:id", this.transactionController.confirmTransaction); //arco
        this.route.patch("/reject/:id", this.transactionController.rejectTransaction); //arco
        this.route.patch("/revert/:id", this.transactionController.revertTransaction); //arco
        this.route.delete("/delete/:id", this.transactionController.deleteTransaction); //arco
        this.route.patch("/upload/:transactionId", this.transactionController.uploadPaymentProof); // mas eky
    }
    getRouter() {
        return this.route;
    }
}
exports.default = TransactionRouter;
