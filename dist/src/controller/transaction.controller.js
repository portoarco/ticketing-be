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
const nodemailer_1 = require("../config/nodemailer");
const confirmpayment_template_1 = __importDefault(require("../templates/confirmpayment-template"));
const rejectpayment_template_1 = __importDefault(require("../templates/rejectpayment-template"));
class TransactionController {
    getAllTransactions(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user_id = res.locals.decrypt.id;
                const user = yield prisma_1.prisma.users.findUnique({
                    where: { id: user_id },
                });
                const userId_in_organizer = yield prisma_1.prisma.organizer.findUnique({
                    where: { user_id },
                });
                const organizerId = userId_in_organizer === null || userId_in_organizer === void 0 ? void 0 : userId_in_organizer.id;
                const transactionDetails = yield prisma_1.prisma.transactions_detail.findMany({
                    where: { organizer_id: organizerId },
                    include: {
                        user: true,
                        detail_event: {
                            include: {
                                location_Event: {
                                    select: {
                                        city: true,
                                        address: true,
                                    },
                                },
                                category_event: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                        ticketType: true,
                    },
                });
                console.log(JSON.stringify(transactionDetails, null, 2));
                if (!transactionDetails) {
                    throw new AppError_1.default("Transaction data not found", 404);
                }
                res.status(200).send({
                    success: true,
                    message: "Data found!",
                    data: transactionDetails,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    confirmTransaction(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                console.log(id);
                // check voucher id
                const checkVoucherId = yield prisma_1.prisma.voucher;
                const confirmPayment = yield prisma_1.prisma.transactions_detail.update({
                    where: { id },
                    data: {
                        transaction_status: "PAID",
                        isConfirmed: true,
                    },
                });
                const userTransactionData = yield prisma_1.prisma.transactions_detail.findUnique({
                    where: { id },
                    select: {
                        id: true,
                        transaction_status: true,
                        amount: true,
                        quantity: true,
                        user: {
                            select: {
                                first_name: true,
                                last_name: true,
                                email: true,
                                user_voucher: true,
                            },
                        },
                        detail_event: {
                            select: {
                                name: true,
                                start_date: true,
                                end_date: true,
                                location_Event: {
                                    select: {
                                        city: true,
                                        address: true,
                                    },
                                },
                            },
                        },
                    },
                });
                console.log(confirmPayment);
                console.log(userTransactionData === null || userTransactionData === void 0 ? void 0 : userTransactionData.user.email);
                if (!confirmPayment)
                    throw new AppError_1.default("Transaction not found", 404);
                // convert date
                const startDateStr = (userTransactionData === null || userTransactionData === void 0 ? void 0 : userTransactionData.detail_event.start_date)
                    ? new Date(userTransactionData.detail_event.start_date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })
                    : "";
                const endDateStr = (userTransactionData === null || userTransactionData === void 0 ? void 0 : userTransactionData.detail_event.end_date)
                    ? new Date(userTransactionData.detail_event.end_date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })
                    : "";
                const mailHTML = (0, confirmpayment_template_1.default)((userTransactionData === null || userTransactionData === void 0 ? void 0 : userTransactionData.id.slice(0, 5).toUpperCase()) || "", (userTransactionData === null || userTransactionData === void 0 ? void 0 : userTransactionData.transaction_status) || "", (userTransactionData === null || userTransactionData === void 0 ? void 0 : userTransactionData.amount) || 0, (userTransactionData === null || userTransactionData === void 0 ? void 0 : userTransactionData.quantity) || 0, (userTransactionData === null || userTransactionData === void 0 ? void 0 : userTransactionData.user.email) || "", (userTransactionData === null || userTransactionData === void 0 ? void 0 : userTransactionData.user.first_name) || "", (userTransactionData === null || userTransactionData === void 0 ? void 0 : userTransactionData.user.last_name) || "", (userTransactionData === null || userTransactionData === void 0 ? void 0 : userTransactionData.detail_event.name) || "", startDateStr, endDateStr, (userTransactionData === null || userTransactionData === void 0 ? void 0 : userTransactionData.detail_event.location_Event.city) || "", (userTransactionData === null || userTransactionData === void 0 ? void 0 : userTransactionData.detail_event.location_Event.address) || "");
                // send email
                yield nodemailer_1.transport.sendMail({
                    from: process.env.MAILSENDER,
                    to: userTransactionData === null || userTransactionData === void 0 ? void 0 : userTransactionData.user.email,
                    subject: "Payment Confirmation",
                    html: mailHTML,
                });
                res.status(200).send({ success: true, message: "Payment Confirmed" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    rejectTransaction(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                console.log(id);
                const rejectPayment = yield prisma_1.prisma.transactions_detail.update({
                    where: { id },
                    data: {
                        transaction_status: "REJECTED",
                        isConfirmed: true,
                    },
                });
                const userTransactionData = yield prisma_1.prisma.transactions_detail.findUnique({
                    where: { id },
                    select: {
                        id: true,
                        transaction_status: true,
                        amount: true,
                        quantity: true,
                        user: {
                            select: {
                                first_name: true,
                                last_name: true,
                                email: true,
                            },
                        },
                        detail_event: {
                            select: {
                                name: true,
                                start_date: true,
                                end_date: true,
                                location_Event: {
                                    select: {
                                        city: true,
                                        address: true,
                                    },
                                },
                            },
                        },
                    },
                });
                // convert date
                const startDateStr = (userTransactionData === null || userTransactionData === void 0 ? void 0 : userTransactionData.detail_event.start_date)
                    ? new Date(userTransactionData.detail_event.start_date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })
                    : "";
                const endDateStr = (userTransactionData === null || userTransactionData === void 0 ? void 0 : userTransactionData.detail_event.end_date)
                    ? new Date(userTransactionData.detail_event.end_date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })
                    : "";
                const mailHTML = (0, rejectpayment_template_1.default)((userTransactionData === null || userTransactionData === void 0 ? void 0 : userTransactionData.id.slice(0, 5).toUpperCase()) || "", (userTransactionData === null || userTransactionData === void 0 ? void 0 : userTransactionData.transaction_status) || "", (userTransactionData === null || userTransactionData === void 0 ? void 0 : userTransactionData.amount) || 0, (userTransactionData === null || userTransactionData === void 0 ? void 0 : userTransactionData.quantity) || 0, (userTransactionData === null || userTransactionData === void 0 ? void 0 : userTransactionData.user.email) || "", (userTransactionData === null || userTransactionData === void 0 ? void 0 : userTransactionData.user.first_name) || "", (userTransactionData === null || userTransactionData === void 0 ? void 0 : userTransactionData.user.last_name) || "", (userTransactionData === null || userTransactionData === void 0 ? void 0 : userTransactionData.detail_event.name) || "", startDateStr, endDateStr, (userTransactionData === null || userTransactionData === void 0 ? void 0 : userTransactionData.detail_event.location_Event.city) || "", (userTransactionData === null || userTransactionData === void 0 ? void 0 : userTransactionData.detail_event.location_Event.address) || "");
                // send email
                yield nodemailer_1.transport.sendMail({
                    from: process.env.MAILSENDER,
                    to: userTransactionData === null || userTransactionData === void 0 ? void 0 : userTransactionData.user.email,
                    subject: "Payment Confirmation",
                    html: mailHTML,
                });
                res.status(200).send({ success: true, message: "Payment Rejected" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    revertTransaction(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                console.log(id);
                const revertPayment = yield prisma_1.prisma.transactions_detail.update({
                    where: { id },
                    data: {
                        transaction_status: "PENDING",
                        isConfirmed: false,
                    },
                });
                res
                    .status(200)
                    .send({ success: true, message: "Payment Revert to Pending" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteTransaction(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                console.log(id);
                const deletePayment = yield prisma_1.prisma.transactions_detail.delete({
                    where: { id },
                });
                res
                    .status(200)
                    .send({ success: true, message: "Delete Transaction Success" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // Eky - start
    createTransaction(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body);
                const userId = res.locals.decrypt.id;
                const { eventId, tickets: ticketsToPurchase, voucherCode, referralCodeIds, } = req.body;
                const [event, ticketTypesFromDatabase, voucherFromDatabase] = yield Promise.all([
                    prisma_1.prisma.events.findUnique({ where: { id: eventId } }),
                    prisma_1.prisma.ticketType.findMany({
                        where: {
                            id: { in: ticketsToPurchase.map((t) => t.ticketTypeId) },
                            event_id: eventId,
                        },
                    }),
                    voucherCode
                        ? prisma_1.prisma.voucher.findFirst({
                            where: { code: voucherCode, event_id: eventId },
                        })
                        : null,
                ]);
                if (!event) {
                    throw new AppError_1.default("Event not found.", 404);
                }
                if (ticketTypesFromDatabase.length !== ticketsToPurchase.length) {
                    throw new AppError_1.default("One or more ticket types are invalid for this event.", 400);
                }
                let subtotal = 0;
                for (const ticket of ticketsToPurchase) {
                    const databaseTicket = ticketTypesFromDatabase.find((tick) => tick.id === ticket.ticketTypeId);
                    if (!databaseTicket || ticket.quantity > databaseTicket.quantity) {
                        throw new AppError_1.default(`Not enough stock for ticket: ${(databaseTicket === null || databaseTicket === void 0 ? void 0 : databaseTicket.name) || "Unknown"}.`, 400);
                    }
                    subtotal += databaseTicket.price * ticket.quantity;
                }
                let finalAmount = subtotal;
                let voucherDiscount = 0;
                if (voucherCode && voucherFromDatabase) {
                    voucherDiscount =
                        (subtotal * (voucherFromDatabase.percentage || 0)) / 100;
                    finalAmount -= voucherDiscount;
                }
                let pointsDiscount = 0;
                if (referralCodeIds && referralCodeIds.length > 0) {
                    const availableBonuses = yield prisma_1.prisma.referral_Code.findMany({
                        where: { id: { in: referralCodeIds }, user_id: userId },
                    });
                    if (availableBonuses.length !== referralCodeIds.length) {
                        throw new AppError_1.default("Invalid or already used referral points.", 400);
                    }
                    pointsDiscount = availableBonuses.reduce((sum, bonus) => sum + (bonus.points || 0), 0);
                    const actualPointsToSpend = Math.min(finalAmount, pointsDiscount);
                    finalAmount -= actualPointsToSpend;
                    pointsDiscount = actualPointsToSpend;
                }
                const newTransactionDetails = yield prisma_1.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const createdDetails = [];
                    for (const ticket of ticketsToPurchase) {
                        const detail = yield tx.transactions_detail.create({
                            data: {
                                user_id: userId,
                                event_id: eventId,
                                organizer_id: event.organizer_id,
                                ticketType_id: ticket.ticketTypeId,
                                quantity: ticket.quantity,
                                amount: finalAmount,
                                transaction_status: "PENDING",
                            },
                        });
                        createdDetails.push(detail);
                        yield tx.ticketType.update({
                            where: { id: ticket.ticketTypeId },
                            data: { quantity: { decrement: ticket.quantity } },
                        });
                    }
                    if (pointsDiscount > 0) {
                        yield tx.referral_Usage.createMany({
                            data: referralCodeIds.map((codeId) => ({
                                user_id: userId,
                                referral_code_id: codeId,
                                isUsed: false,
                            })),
                        });
                    }
                    if (voucherFromDatabase) {
                        yield tx.voucher.update({
                            where: { id: voucherFromDatabase.id },
                            data: { isUsed: true },
                        });
                    }
                    return createdDetails;
                }));
                res.status(201).json({
                    message: "Transaction success. Please proceed to payment.",
                    data: newTransactionDetails,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    uploadPaymentProof(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { transactionId } = req.params;
                const userId = res.locals.decrypt.id;
                const { paymentProofUrl } = req.body;
                // 1. Basic validation
                if (!paymentProofUrl) {
                    throw new AppError_1.default("No payment proof URL was provided.", 400);
                }
                const transaction = yield prisma_1.prisma.transactions_detail.findFirst({
                    where: { id: transactionId, user_id: userId },
                });
                if (!transaction) {
                    throw new AppError_1.default("Transaction not found or you are not authorized.", 404);
                }
                if (transaction.transaction_status !== "PENDING") {
                    throw new AppError_1.default("This transaction is no longer awaiting payment.", 400);
                }
                const updatedTransaction = yield prisma_1.prisma.transactions_detail.update({
                    where: { id: transactionId },
                    data: {
                        proof: paymentProofUrl,
                        transaction_status: "PAID",
                        paid_at: new Date(),
                    },
                });
                res.status(200).json({
                    message: "Payment proof submitted successfully.",
                    data: updatedTransaction,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getTransactionById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { transactionId } = req.params;
                const userId = res.locals.decrypt.id;
                const transaction = yield prisma_1.prisma.transactions_detail.findFirst({
                    where: {
                        id: transactionId,
                        user_id: userId,
                    },
                    include: {
                        detail_event: {
                            select: {
                                name: true,
                            },
                        },
                    },
                });
                if (!transaction) {
                    throw new AppError_1.default("Transaction not found or you are not authorized to view it.", 404);
                }
                res.status(200).json({
                    message: "Transaction details fetched successfully.",
                    data: transaction,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = TransactionController;
