import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import AppError from "../errors/AppError";
import { transport } from "../config/nodemailer";
import paymentConfirmationMail from "../templates/confirmpayment-template";
import paymentRejectedMail from "../templates/rejectpayment-template";
import { cloudinaryUpload } from "../config/cloudinary";

class TransactionController {
  public async getAllTransactions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user_id = res.locals.decrypt.id;

      const user = await prisma.users.findUnique({
        where: { id: user_id },
      });

      const userId_in_organizer = await prisma.organizer.findUnique({
        where: { user_id },
      });

      const organizerId = userId_in_organizer?.id;
      const transactionDetails = await prisma.transactions_detail.findMany({
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
        },
      });

      console.log(JSON.stringify(transactionDetails, null, 2));

      if (!transactionDetails) {
        throw new AppError("Transaction data not found", 404);
      }

      res.status(200).send({
        success: true,
        message: "Data found!",
        data: transactionDetails,
      });
    } catch (error) {
      next(error);
    }
  }

  public async confirmTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = req.params.id;
      console.log(id);

      const confirmPayment = await prisma.transactions_detail.update({
        where: { id },
        data: {
          transaction_status: "PAID",
          isConfirmed: true,
        },
      });

      const userTransactionData = await prisma.transactions_detail.findUnique({
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
      console.log(confirmPayment);
      console.log(userTransactionData?.user.email);

      // convert date
      const startDateStr = userTransactionData?.detail_event.start_date
        ? new Date(
            userTransactionData.detail_event.start_date
          ).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "";

      const endDateStr = userTransactionData?.detail_event.end_date
        ? new Date(
            userTransactionData.detail_event.end_date
          ).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "";

      const mailHTML = paymentConfirmationMail(
        userTransactionData?.id.slice(0, 5).toUpperCase() || "",
        userTransactionData?.transaction_status || "",
        userTransactionData?.amount || 0,
        userTransactionData?.quantity || 0,
        userTransactionData?.user.email || "",
        userTransactionData?.user.first_name || "",
        userTransactionData?.user.last_name || "",
        userTransactionData?.detail_event.name || "",
        startDateStr,
        endDateStr,
        userTransactionData?.detail_event.location_Event.city || "",
        userTransactionData?.detail_event.location_Event.address || ""
      );

      // send email
      await transport.sendMail({
        from: process.env.MAILSENDER,
        to: userTransactionData?.user.email,
        subject: "Payment Confirmation",
        html: mailHTML,
      });

      res.status(200).send({ success: true, message: "Payment Confirmed" });
    } catch (error) {
      next(error);
    }
  }

  public async rejectTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = req.params.id;
      console.log(id);

      const rejectPayment = await prisma.transactions_detail.update({
        where: { id },
        data: {
          transaction_status: "REJECTED",
          isConfirmed: true,
        },
      });

      const userTransactionData = await prisma.transactions_detail.findUnique({
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
      const startDateStr = userTransactionData?.detail_event.start_date
        ? new Date(
            userTransactionData.detail_event.start_date
          ).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "";

      const endDateStr = userTransactionData?.detail_event.end_date
        ? new Date(
            userTransactionData.detail_event.end_date
          ).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "";

      const mailHTML = paymentRejectedMail(
        userTransactionData?.id.slice(0, 5).toUpperCase() || "",
        userTransactionData?.transaction_status || "",
        userTransactionData?.amount || 0,
        userTransactionData?.quantity || 0,
        userTransactionData?.user.email || "",
        userTransactionData?.user.first_name || "",
        userTransactionData?.user.last_name || "",
        userTransactionData?.detail_event.name || "",
        startDateStr,
        endDateStr,
        userTransactionData?.detail_event.location_Event.city || "",
        userTransactionData?.detail_event.location_Event.address || ""
      );

      // send email
      await transport.sendMail({
        from: process.env.MAILSENDER,
        to: userTransactionData?.user.email,
        subject: "Payment Confirmation",
        html: mailHTML,
      });
      res.status(200).send({ success: true, message: "Payment Rejected" });
    } catch (error) {
      next(error);
    }
  }

  public async revertTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = req.params.id;
      console.log(id);

      const revertPayment = await prisma.transactions_detail.update({
        where: { id },
        data: {
          transaction_status: "PENDING",
          isConfirmed: false,
        },
      });
      res
        .status(200)
        .send({ success: true, message: "Payment Revert to Pending" });
    } catch (error) {
      next(error);
    }
  }

  public async deleteTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = req.params.id;
      console.log(id);

      const deletePayment = await prisma.transactions_detail.delete({
        where: { id },
      });
      res
        .status(200)
        .send({ success: true, message: "Delete Transaction Success" });
    } catch (error) {
      next(error);
    }
  }

  // Eky - start
  public async createTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      console.log(req.body);

      const userId = res.locals.decrypt.id;

      const {
        eventId,
        tickets: ticketsToPurchase,
        voucherCode,
        referralCodeIds,
      } = req.body;

      const [event, ticketTypesFromDatabase, voucherFromDatabase] =
        await Promise.all([
          prisma.events.findUnique({ where: { id: eventId } }),
          prisma.ticketType.findMany({
            where: {
              id: { in: ticketsToPurchase.map((t: any) => t.ticketTypeId) },
              event_id: eventId,
            },
          }),
          voucherCode
            ? prisma.voucher.findFirst({
                where: { code: voucherCode, event_id: eventId },
              })
            : null,
        ]);

      if (!event) {
        throw new AppError("Event not found.", 404);
      }
      if (ticketTypesFromDatabase.length !== ticketsToPurchase.length) {
        throw new AppError(
          "One or more ticket types are invalid for this event.",
          400
        );
      }

      let subtotal = 0;
      for (const ticket of ticketsToPurchase) {
        const databaseTicket = ticketTypesFromDatabase.find(
          (tick) => tick.id === ticket.ticketTypeId
        );
        if (!databaseTicket || ticket.quantity > databaseTicket.quantity) {
          throw new AppError(
            `Not enough stock for ticket: ${
              databaseTicket?.name || "Unknown"
            }.`,
            400
          );
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
        const availableBonuses = await prisma.referral_Code.findMany({
          where: { id: { in: referralCodeIds }, user_id: userId },
        });

        if (availableBonuses.length !== referralCodeIds.length) {
          throw new AppError("Invalid or already used referral points.", 400);
        }

        pointsDiscount = availableBonuses.reduce(
          (sum, bonus) => sum + (bonus.points || 0),
          0
        );

        const actualPointsToSpend = Math.min(finalAmount, pointsDiscount);
        finalAmount -= actualPointsToSpend;
        pointsDiscount = actualPointsToSpend;
      }

      const newTransactionDetails = await prisma.$transaction(async (tx) => {
        const createdDetails = [];
        for (const ticket of ticketsToPurchase) {
          const detail = await tx.transactions_detail.create({
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

          await tx.ticketType.update({
            where: { id: ticket.ticketTypeId },
            data: { quantity: { decrement: ticket.quantity } },
          });
        }

        if (pointsDiscount > 0) {
          await tx.referral_Usage.createMany({
            data: referralCodeIds.map((codeId: string) => ({
              user_id: userId,
              referral_code_id: codeId,
              isUsed: false,
            })),
          });
        }

        if (voucherFromDatabase) {
          await tx.voucher.update({
            where: { id: voucherFromDatabase.id },
            data: { isUsed: true },
          });
        }

        return createdDetails;
      });

      res.status(201).json({
        message: "Transaction success. Please proceed to payment.",

        data: newTransactionDetails,
      });
    } catch (error) {
      next(error);
    }
  }

  public async uploadPaymentProof(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { transactionId } = req.params;
      const userId = res.locals.decrypt.id;
      const { paymentProofUrl } = req.body;

      // 1. Basic validation
      if (!paymentProofUrl) {
        throw new AppError("No payment proof URL was provided.", 400);
      }

      const transaction = await prisma.transactions_detail.findFirst({
        where: { id: transactionId, user_id: userId },
      });

      if (!transaction) {
        throw new AppError(
          "Transaction not found or you are not authorized.",
          404
        );
      }
      if (transaction.transaction_status !== "PENDING") {
        throw new AppError(
          "This transaction is no longer awaiting payment.",
          400
        );
      }

      const updatedTransaction = await prisma.transactions_detail.update({
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
    } catch (error) {
      next(error);
    }
  }

  public async getTransactionById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { transactionId } = req.params;
      const userId = res.locals.decrypt.id;

      const transaction = await prisma.transactions_detail.findFirst({
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
        throw new AppError(
          "Transaction not found or you are not authorized to view it.",
          404
        );
      }

      res.status(200).json({
        message: "Transaction details fetched successfully.",
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  // Eky - end
}

export default TransactionController;
