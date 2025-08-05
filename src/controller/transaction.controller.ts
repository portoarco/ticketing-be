import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import AppError from "../errors/AppError";
import { transport } from "../config/nodemailer";
import paymentConfirmationMail from "../templates/confirmpayment-template";
import paymentRejectedMail from "../templates/rejectpayment-template";

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
}

export default TransactionController;
