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
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollbackTransaction = rollbackTransaction;
const prisma_1 = require("../config/prisma");
function rollbackTransaction(transactionId) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma_1.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
            const transactionDetails = yield tx.transactions_detail.findMany({
                where: { id: transactionId },
            });
            if (transactionDetails.length === 0) {
                throw new Error("Transaction to roll back not found.");
            }
            for (const detail of transactionDetails) {
                if (detail.ticketType_id) {
                    yield tx.ticketType.update({
                        where: { id: detail.ticketType_id },
                        data: { quantity: { increment: detail.quantity } },
                    });
                }
                if (detail.voucher_id) {
                    yield tx.voucher.update({
                        where: { id: detail.voucher_id },
                        data: { isUsed: false },
                    });
                }
            }
            yield tx.referral_Usage.deleteMany({
                where: { transaction_detail_id: transactionId },
            });
            console.log(`Transaction ${transactionId} has been successfully rolled back.`);
        }));
    });
}
