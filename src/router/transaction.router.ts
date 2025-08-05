import { Router } from "express";
import TransactionController from "../controller/transaction.controller";
import { verifyToken } from "../middlewares/verifyToken";

class TransactionRouter {
  private route: Router;
  private transactionController: TransactionController;

  constructor() {
    this.route = Router();
    this.transactionController = new TransactionController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.route.use(verifyToken); //arco

    this.route.get("/detail", this.transactionController.getAllTransactions); //arco
    this.route.patch(
      "/confirm/:id",
      this.transactionController.confirmTransaction
    ); //arco
    this.route.patch(
      "/reject/:id",
      this.transactionController.rejectTransaction
    ); //arco
    this.route.patch(
      "/revert/:id",
      this.transactionController.revertTransaction
    ); //arco
    this.route.delete(
      "/delete/:id",
      this.transactionController.deleteTransaction
    ); //arco
  }
  public getRouter(): Router {
    return this.route;
  }
}
export default TransactionRouter;
