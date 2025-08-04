import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import AppError from "../errors/AppError";

// class TransactionController {
//   public createTransaction(req: Request, res: Response) {}
// }

class TransactionController {
  public async getTransactionDetail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user_id = res.locals.decrypt.id;

      // cari data user_id dari user di organizer
      const user = await prisma.users.findUnique({
        where: { id: user_id },
      });

      const userId_in_organizer = await prisma.organizer.findUnique({
        where: { user_id },
      });

      console.log(user);
      console.log("ini pemisah yaa");
      console.log(userId_in_organizer?.id);

      // tangkap data id organizer
      const organizerId = userId_in_organizer?.id;
      // hasil tangkapan data id organizer dipakai untuk cara di db transaction detail ada transaksi apa aja yang sesuai
      const transactionDetails = await prisma.transactions_detail.findMany({
        where: { organizer_id: organizerId },
        include: {
          user: true,
          detail_event: true,
        },
      });
      console.log(transactionDetails);

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
}

export default TransactionController;
