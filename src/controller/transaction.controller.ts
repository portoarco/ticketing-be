import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import AppError from "../errors/AppError";

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

  // public async confirmTransaction(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   const user_id = res.locals.decrypt.id;

  //   const user = await prisma.users.findUnique({
  //     where: { id: user_id },
  //   });

  //   const userId_in_organizer = await prisma.organizer.findUnique({
  //     where: { user_id },
  //   });

  //   const organizerId = userId_in_organizer?.id;

  //   await prisma.
  // }

  // public async deleteTransaction() {}
}

export default TransactionController;
