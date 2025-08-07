import { prisma } from "../config/prisma";

export async function rollbackTransaction(transactionId: string) {
  return prisma.$transaction(async (tx) => {
    const transactionDetails = await tx.transactions_detail.findMany({
      where: { id: transactionId },
    });

    if (transactionDetails.length === 0) {
      throw new Error("Transaction to roll back not found.");
    }

    for (const detail of transactionDetails) {
      if (detail.ticketType_id) {
        await tx.ticketType.update({
          where: { id: detail.ticketType_id },
          data: { quantity: { increment: detail.quantity } },
        });
      }

      if (detail.voucher_id) {
        await tx.voucher.update({
          where: { id: detail.voucher_id },
          data: { isUsed: false },
        });
      }
    }

    await tx.referral_Usage.deleteMany({
      where: { transaction_detail_id: transactionId },
    });

    console.log(
      `Transaction ${transactionId} has been successfully rolled back.`
    );
  });
}
